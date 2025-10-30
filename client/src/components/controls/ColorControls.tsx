import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { PRESET_COLORS } from "@/types/color.types";
import { Palette, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ColorControls() {
  const {
    data,
    config,
    lineColors,
    columnColors,
    cellColors,
    setLineColor,
    setColumnColor,
    setCellColor,
    clearLineColor,
    clearColumnColor,
    clearCellColor,
    selection,
  } = useBarcodeStore();

  const [selectedLine, setSelectedLine] = useState<number>(0);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [lineColorState, setLineColorState] = useState({
    backgroundColor: "#ffffff",
    barcodeColor: "#000000",
    textColor: "#000000",
  });
  const [columnColorState, setColumnColorState] = useState({
    backgroundColor: "#ffffff",
    barcodeColor: "#000000",
    textColor: "#000000",
  });

  const totalRows = Math.ceil(data.length / config.columns);

  const applyLineColor = () => {
    setLineColor(selectedLine, {
      lineIndex: selectedLine,
      ...lineColorState,
    });
    toast.success(`Couleurs appliquées à la ligne ${selectedLine + 1}`);
  };

  const applyColumnColor = () => {
    setColumnColor(selectedColumn, {
      columnIndex: selectedColumn,
      ...columnColorState,
    });
    toast.success(`Couleurs appliquées à la colonne ${selectedColumn + 1}`);
  };

  const applyCellColor = () => {
    if (selection.size === 0) {
      toast.error("Veuillez sélectionner au moins une cellule");
      return;
    }

    selection.forEach((cellKey) => {
      const [row, col] = cellKey.split("-").map(Number);
      setCellColor(cellKey, {
        row,
        col,
        ...lineColorState, // Réutiliser les couleurs de ligne
      });
    });
    toast.success(`Couleurs appliquées à ${selection.size} cellule(s)`);
  };

  const applyToAllLines = () => {
    for (let i = 0; i < totalRows; i++) {
      setLineColor(i, {
        lineIndex: i,
        ...lineColorState,
      });
    }
    toast.success("Couleurs appliquées à toutes les lignes");
  };

  const applyZebraStriping = () => {
    const color1 = { backgroundColor: "#ffffff", barcodeColor: "#000000", textColor: "#000000" };
    const color2 = { backgroundColor: "#f3f4f6", barcodeColor: "#000000", textColor: "#000000" };

    for (let i = 0; i < totalRows; i++) {
      setLineColor(i, {
        lineIndex: i,
        ...(i % 2 === 0 ? color1 : color2),
      });
    }
    toast.success("Rayures zébrées appliquées");
  };

  const clearAllColors = () => {
    lineColors.forEach((_, index) => clearLineColor(index));
    columnColors.forEach((_, index) => clearColumnColor(index));
    cellColors.forEach((_, key) => clearCellColor(key));
    toast.success("Toutes les couleurs ont été réinitialisées");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Gestion des couleurs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Personnalisez les couleurs par ligne, colonne ou cellule
        </p>
      </div>

      <Tabs defaultValue="line" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="line">Lignes</TabsTrigger>
          <TabsTrigger value="column">Colonnes</TabsTrigger>
          <TabsTrigger value="cell">Cellules</TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="space-y-4 mt-4">
          <div>
            <Label>Sélectionner une ligne</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {Array.from({ length: Math.min(totalRows, 20) }, (_, i) => (
                <Button
                  key={i}
                  variant={selectedLine === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLine(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Fond</Label>
            <HexColorPicker
              color={lineColorState.backgroundColor}
              onChange={(color) => setLineColorState({ ...lineColorState, backgroundColor: color })}
              className="w-full mt-2"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => setLineColorState({ ...lineColorState, backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Couleur des barres</Label>
            <HexColorPicker
              color={lineColorState.barcodeColor}
              onChange={(color) => setLineColorState({ ...lineColorState, barcodeColor: color })}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label>Couleur du texte</Label>
            <HexColorPicker
              color={lineColorState.textColor}
              onChange={(color) => setLineColorState({ ...lineColorState, textColor: color })}
              className="w-full mt-2"
            />
          </div>

          <div className="space-y-2">
            <Button onClick={applyLineColor} className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              Appliquer à la ligne {selectedLine + 1}
            </Button>
            <Button onClick={applyToAllLines} variant="outline" className="w-full">
              Appliquer à toutes les lignes
            </Button>
            <Button onClick={applyZebraStriping} variant="outline" className="w-full">
              Rayures zébrées
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="column" className="space-y-4 mt-4">
          <div>
            <Label>Sélectionner une colonne</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {Array.from({ length: config.columns }, (_, i) => (
                <Button
                  key={i}
                  variant={selectedColumn === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColumn(i)}
                >
                  {String.fromCharCode(65 + i)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Fond</Label>
            <HexColorPicker
              color={columnColorState.backgroundColor}
              onChange={(color) => setColumnColorState({ ...columnColorState, backgroundColor: color })}
              className="w-full mt-2"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => setColumnColorState({ ...columnColorState, backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Couleur des barres</Label>
            <HexColorPicker
              color={columnColorState.barcodeColor}
              onChange={(color) => setColumnColorState({ ...columnColorState, barcodeColor: color })}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label>Couleur du texte</Label>
            <HexColorPicker
              color={columnColorState.textColor}
              onChange={(color) => setColumnColorState({ ...columnColorState, textColor: color })}
              className="w-full mt-2"
            />
          </div>

          <Button onClick={applyColumnColor} className="w-full">
            <Palette className="w-4 h-4 mr-2" />
            Appliquer à la colonne {String.fromCharCode(65 + selectedColumn)}
          </Button>
        </TabsContent>

        <TabsContent value="cell" className="space-y-4 mt-4">
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Sélection de cellules:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Cliquez sur une cellule pour la sélectionner</li>
              <li>Ctrl+Clic pour sélection multiple</li>
              <li>{selection.size} cellule(s) sélectionnée(s)</li>
            </ul>
          </div>

          <div>
            <Label>Fond</Label>
            <HexColorPicker
              color={lineColorState.backgroundColor}
              onChange={(color) => setLineColorState({ ...lineColorState, backgroundColor: color })}
              className="w-full mt-2"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => setLineColorState({ ...lineColorState, backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          <Button onClick={applyCellColor} className="w-full" disabled={selection.size === 0}>
            <Palette className="w-4 h-4 mr-2" />
            Appliquer aux cellules sélectionnées
          </Button>
        </TabsContent>
      </Tabs>

      <Button onClick={clearAllColors} variant="destructive" className="w-full">
        <Trash2 className="w-4 h-4 mr-2" />
        Réinitialiser toutes les couleurs
      </Button>
    </div>
  );
}
