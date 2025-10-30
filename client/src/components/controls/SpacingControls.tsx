import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function SpacingControls() {
  const {
    data,
    config,
    lineSpacing,
    columnSpacing,
    setLineSpacing,
    setColumnSpacing,
  } = useBarcodeStore();

  const [globalSpacing, setGlobalSpacing] = useState(16);
  const [selectedLineSpacing, setSelectedLineSpacing] = useState(0);
  const [selectedColumnSpacing, setSelectedColumnSpacing] = useState(0);
  const [lineSpacingValue, setLineSpacingValue] = useState(16);
  const [columnSpacingValue, setColumnSpacingValue] = useState(16);

  const totalRows = Math.ceil(data.length / config.columns);

  const applyGlobalSpacing = () => {
    // Appliquer l'espacement global à toutes les lignes et colonnes
    for (let i = 0; i < totalRows - 1; i++) {
      setLineSpacing(i, globalSpacing);
    }
    for (let i = 0; i < config.columns - 1; i++) {
      setColumnSpacing(i, globalSpacing);
    }
    toast.success("Espacement global appliqué");
  };

  const applyLineSpacingValue = () => {
    setLineSpacing(selectedLineSpacing, lineSpacingValue);
    toast.success(`Espacement appliqué après la ligne ${selectedLineSpacing + 1}`);
  };

  const applyColumnSpacingValue = () => {
    setColumnSpacing(selectedColumnSpacing, columnSpacingValue);
    toast.success(`Espacement appliqué après la colonne ${String.fromCharCode(65 + selectedColumnSpacing)}`);
  };

  const resetAllSpacing = () => {
    lineSpacing.forEach((_, index) => setLineSpacing(index, 16));
    columnSpacing.forEach((_, index) => setColumnSpacing(index, 16));
    toast.success("Tous les espacements ont été réinitialisés");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Gestion de l'espacement</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Contrôlez l'espacement entre les lignes et les colonnes
        </p>
      </div>

      {/* Espacement global */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="globalSpacing">Espacement global</Label>
            <span className="text-sm text-muted-foreground">{globalSpacing}px</span>
          </div>
          <Slider
            id="globalSpacing"
            value={[globalSpacing]}
            onValueChange={(value) => setGlobalSpacing(value[0])}
            min={0}
            max={100}
            step={4}
          />
        </div>
        <Button onClick={applyGlobalSpacing} className="w-full">
          Appliquer à toute la grille
        </Button>
      </div>

      <div className="border-t pt-4" />

      {/* Espacement par ligne */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Espacement entre les lignes</h4>
        <div>
          <Label>Après la ligne</Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.from({ length: Math.min(totalRows - 1, 10) }, (_, i) => (
              <Button
                key={i}
                variant={selectedLineSpacing === i ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedLineSpacing(i);
                  setLineSpacingValue(lineSpacing.get(i) || 16);
                }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="lineSpacingValue">Espacement</Label>
            <Input
              type="number"
              value={lineSpacingValue}
              onChange={(e) => setLineSpacingValue(parseInt(e.target.value) || 0)}
              className="w-20 h-8 text-sm"
              min={0}
              max={100}
            />
          </div>
          <Slider
            id="lineSpacingValue"
            value={[lineSpacingValue]}
            onValueChange={(value) => setLineSpacingValue(value[0])}
            min={0}
            max={100}
            step={4}
          />
        </div>

        <Button onClick={applyLineSpacingValue} variant="outline" className="w-full">
          Appliquer après la ligne {selectedLineSpacing + 1}
        </Button>
      </div>

      <div className="border-t pt-4" />

      {/* Espacement par colonne */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Espacement entre les colonnes</h4>
        <div>
          <Label>Après la colonne</Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.from({ length: config.columns - 1 }, (_, i) => (
              <Button
                key={i}
                variant={selectedColumnSpacing === i ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedColumnSpacing(i);
                  setColumnSpacingValue(columnSpacing.get(i) || 16);
                }}
              >
                {String.fromCharCode(65 + i)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="columnSpacingValue">Espacement</Label>
            <Input
              type="number"
              value={columnSpacingValue}
              onChange={(e) => setColumnSpacingValue(parseInt(e.target.value) || 0)}
              className="w-20 h-8 text-sm"
              min={0}
              max={100}
            />
          </div>
          <Slider
            id="columnSpacingValue"
            value={[columnSpacingValue]}
            onValueChange={(value) => setColumnSpacingValue(value[0])}
            min={0}
            max={100}
            step={4}
          />
        </div>

        <Button onClick={applyColumnSpacingValue} variant="outline" className="w-full">
          Appliquer après la colonne {String.fromCharCode(65 + selectedColumnSpacing)}
        </Button>
      </div>

      <div className="border-t pt-4" />

      <Button onClick={resetAllSpacing} variant="destructive" className="w-full">
        <Trash2 className="w-4 h-4 mr-2" />
        Réinitialiser tous les espacements
      </Button>
    </div>
  );
}
