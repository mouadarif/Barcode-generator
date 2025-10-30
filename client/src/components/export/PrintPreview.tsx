import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PrintContent } from "./PrintHandler";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { Input } from "@/components/ui/input";

interface PrintPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrintPreview({ open, onOpenChange }: PrintPreviewProps) {
  const [colorMode, setColorMode] = useState<"color" | "bw">("color");
  const [pagesExpr, setPagesExpr] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);
  const store = useBarcodeStore();

  const totalPages = useMemo(() => {
    const columns = Math.max(store.config.columns, 1);
    const rowsPerPage = Math.max(store.config.rows, 1);
    const itemsPerPage = columns * rowsPerPage;
    return Math.ceil(store.data.length / itemsPerPage);
  }, [store.config.columns, store.config.rows, store.data.length]);

  const selectedPages = useMemo(() => {
    const trimmed = pagesExpr.trim();
    if (!trimmed) return undefined;
    const set = new Set<number>();
    trimmed.split(",").forEach(part => {
      const p = part.trim();
      if (!p) return;
      if (p.includes("-")) {
        const [a, b] = p.split("-").map(n => parseInt(n, 10));
        if (Number.isFinite(a) && Number.isFinite(b)) {
          const start = Math.max(1, Math.min(a, b));
          const end = Math.min(totalPages, Math.max(a, b));
          for (let i = start; i <= end; i++) set.add(i);
        }
      } else {
        const n = parseInt(p, 10);
        if (Number.isFinite(n) && n >= 1 && n <= totalPages) set.add(n);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [pagesExpr, totalPages]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Codes-barres",
    onAfterPrint: () => {
      console.log("Print completed");
    },
  });

  const onPrint = () => {
    onOpenChange(false);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="print:hidden">
        <DialogHeader>
          <DialogTitle>Imprimer les codes-barres</DialogTitle>
          <DialogDescription>
            Configurez les options d'impression avant de lancer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <div>
              <Label>Pages à imprimer</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder={totalPages ? `ex: 1,3-4 (1-${totalPages})` : "ex: 1,3-4"}
                  value={pagesExpr}
                  onChange={(e) => setPagesExpr(e.target.value)}
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Total: {totalPages || 0}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Mode d'impression</Label>
            <RadioGroup value={colorMode} onValueChange={(value) => setColorMode(value as "color" | "bw")} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="color" />
                <Label htmlFor="color" className="font-normal cursor-pointer">
                  Couleur
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bw" id="bw" />
                <Label htmlFor="bw" className="font-normal cursor-pointer">
                  Noir et blanc
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Conseils d'impression:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Utilisez du papier A4 pour un résultat optimal</li>
              <li>Vérifiez l'aperçu avant d'imprimer</li>
              <li>Ajustez les marges si nécessaire</li>
              <li>Utilisez une imprimante de qualité pour les codes-barres</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Hidden print content */}
      <div style={{ display: "none" }}>
        <PrintContent ref={printRef} selectedPages={selectedPages} />
      </div>
    </Dialog>
  );
}
