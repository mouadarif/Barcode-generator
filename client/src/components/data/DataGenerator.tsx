import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { BarcodeData } from "@/types/barcode.types";
import { toast } from "sonner";

export default function DataGenerator() {
  const [prefix, setPrefix] = useState("LOC-");
  const [startNumber, setStartNumber] = useState(1);
  const [count, setCount] = useState(10);
  const setData = useBarcodeStore((state) => state.setData);

  const generateSequence = () => {
    if (count <= 0 || count > 1000) {
      toast.error("Le nombre doit être entre 1 et 1000");
      return;
    }

    const barcodeData: BarcodeData[] = [];
    for (let i = 0; i < count; i++) {
      const number = startNumber + i;
      const value = `${prefix}${number.toString().padStart(4, "0")}`;
      barcodeData.push({
        id: `barcode-${Date.now()}-${i}`,
        value,
        text: value,
      });
    }

    setData(barcodeData);
    toast.success(`${count} codes-barres générés avec succès`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Générer une séquence</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Créez automatiquement une série de codes-barres numérotés
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="prefix">Préfixe</Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="LOC-"
          />
        </div>

        <div>
          <Label htmlFor="startNumber">Numéro de départ</Label>
          <Input
            id="startNumber"
            type="number"
            value={startNumber}
            onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
            min={1}
          />
        </div>

        <div>
          <Label htmlFor="count">Nombre de codes</Label>
          <Input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            min={1}
            max={1000}
          />
        </div>
      </div>

      <Button onClick={generateSequence} className="w-full">
        <Wand2 className="w-4 h-4 mr-2" />
        Générer {count} codes-barres
      </Button>

      <div className="p-3 bg-muted rounded-lg text-sm">
        <p className="font-medium mb-1">Aperçu:</p>
        <div className="font-mono text-xs space-y-1">
          <div>{prefix}{startNumber.toString().padStart(4, "0")}</div>
          <div>{prefix}{(startNumber + 1).toString().padStart(4, "0")}</div>
          <div>{prefix}{(startNumber + 2).toString().padStart(4, "0")}</div>
          <div className="text-muted-foreground">...</div>
        </div>
      </div>
    </div>
  );
}
