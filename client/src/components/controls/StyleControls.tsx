import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useBarcodeStore } from "@/stores/useBarcodeStore";

export default function StyleControls() {
  const { config, updateConfig } = useBarcodeStore();
  const { globalSettings } = config;

  const updateSettings = (updates: Partial<typeof globalSettings>) => {
    updateConfig({
      globalSettings: {
        ...globalSettings,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Styles des codes-barres</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Personnalisez l'apparence de vos codes-barres
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="barcodeHeight">Hauteur du code-barres</Label>
            <span className="text-sm text-muted-foreground">{globalSettings.barcodeHeight}px</span>
          </div>
          <Slider
            id="barcodeHeight"
            value={[globalSettings.barcodeHeight]}
            onValueChange={(value) => updateSettings({ barcodeHeight: value[0] })}
            min={20}
            max={150}
            step={5}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="barWidth">Largeur des barres</Label>
            <span className="text-sm text-muted-foreground">{globalSettings.barWidth}px</span>
          </div>
          <Slider
            id="barWidth"
            value={[globalSettings.barWidth]}
            onValueChange={(value) => updateSettings({ barWidth: value[0] })}
            min={1}
            max={5}
            step={0.5}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="fontSize">Taille du texte</Label>
            <span className="text-sm text-muted-foreground">{globalSettings.fontSize}px</span>
          </div>
          <Slider
            id="fontSize"
            value={[globalSettings.fontSize]}
            onValueChange={(value) => updateSettings({ fontSize: value[0] })}
            min={8}
            max={48}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="textMargin">Marge du texte</Label>
            <span className="text-sm text-muted-foreground">{globalSettings.textMargin}px</span>
          </div>
          <Slider
            id="textMargin"
            value={[globalSettings.textMargin]}
            onValueChange={(value) => updateSettings({ textMargin: value[0] })}
            min={0}
            max={10}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="cellPadding">Padding des cellules</Label>
            <span className="text-sm text-muted-foreground">{globalSettings.cellPadding}px</span>
          </div>
          <Slider
            id="cellPadding"
            value={[globalSettings.cellPadding]}
            onValueChange={(value) => updateSettings({ cellPadding: value[0] })}
            min={0}
            max={30}
            step={2}
          />
        </div>
      </div>
    </div>
  );
}
