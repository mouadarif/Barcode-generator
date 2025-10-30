import { useState } from "react";
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
import { Download, Loader2 } from "lucide-react";
import { generatePDF, generatePNG } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const [format, setFormat] = useState<"pdf" | "png">("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const previewElement = document.querySelector(".printable-root") as HTMLElement;
      if (!previewElement) {
        toast.error("Aucun élément à exporter");
        return;
      }

      if (format === "pdf") {
        await generatePDF(previewElement, "codes-barres.pdf");
        toast.success("PDF exporté avec succès");
      } else if (format === "png") {
        await generatePNG(previewElement, "codes-barres.png");
        toast.success("PNG exporté avec succès");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exporter les codes-barres</DialogTitle>
          <DialogDescription>
            Choisissez le format d'export pour vos codes-barres
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Format d'export</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as "pdf" | "png")} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="font-normal cursor-pointer">
                  PDF - Document imprimable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png" className="font-normal cursor-pointer">
                  PNG - Image haute résolution (300 DPI)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Informations:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {format === "pdf" && (
                <>
                  <li>Format A4 optimisé pour l'impression</li>
                  <li>Multi-pages si nécessaire</li>
                  <li>Qualité vectorielle</li>
                </>
              )}
              {format === "png" && (
                <>
                  <li>Haute résolution (300 DPI)</li>
                  <li>Idéal pour l'édition externe</li>
                  <li>Taille de fichier plus importante</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
