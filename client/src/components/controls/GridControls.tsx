import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBarcodeStore } from "@/stores/useBarcodeStore";

export default function GridControls() {
  const { config, updateConfig } = useBarcodeStore();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Configuration de la grille</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Définissez la disposition de vos codes-barres
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="columns">Colonnes</Label>
          <Input
            id="columns"
            type="number"
            value={config.columns}
            onChange={(e) => updateConfig({ columns: parseInt(e.target.value) || 1 })}
            min={1}
            max={10}
          />
        </div>

        <div>
          <Label htmlFor="rows">Lignes (par page)</Label>
          <Input
            id="rows"
            type="number"
            value={config.rows}
            onChange={(e) => updateConfig({ rows: parseInt(e.target.value) || 1 })}
            min={1}
            max={50}
          />
        </div>

        <div>
          <Label htmlFor="pageFormat">Format de page</Label>
          <Select
            value={config.pageFormat}
            onValueChange={(value: "A4" | "A1") => updateConfig({ pageFormat: value })}
          >
            <SelectTrigger id="pageFormat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="A1">A1 (594 × 841 mm)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="margin">Marges (mm)</Label>
          <Input
            id="margin"
            type="number"
            value={config.margin}
            onChange={(e) => updateConfig({ margin: parseInt(e.target.value) || 0 })}
            min={0}
            max={50}
          />
        </div>
      </div>
    </div>
  );
}
