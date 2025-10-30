import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { Save, Download, Upload, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PresetManager() {
  const { presets, savePreset, loadPreset, deletePreset } = useBarcodeStore();
  const [presetName, setPresetName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error("Veuillez entrer un nom pour le preset");
      return;
    }
    savePreset(presetName);
    toast.success(`Preset "${presetName}" sauvegardé`);
    setPresetName("");
    setIsDialogOpen(false);
  };

  const handleLoadPreset = (id: string) => {
    loadPreset(id);
    const preset = presets.find((p) => p.id === id);
    toast.success(`Preset "${preset?.name}" chargé`);
  };

  const handleDeletePreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    deletePreset(id);
    toast.success(`Preset "${preset?.name}" supprimé`);
  };

  const handleExportPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;

    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${preset.name.replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Preset exporté");
  };

  const handleImportPreset = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const preset = JSON.parse(event.target?.result as string);
          // Ajouter le preset importé
          const newPresets = [...presets, { ...preset, id: `preset-${Date.now()}` }];
          localStorage.setItem("barcode-presets", JSON.stringify(newPresets));
          useBarcodeStore.getState().loadPresetsFromStorage();
          toast.success("Preset importé avec succès");
        } catch (error) {
          toast.error("Erreur lors de l'import du preset");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Presets</h3>
          <p className="text-sm text-muted-foreground">
            Sauvegardez et chargez vos configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sauvegarder un preset</DialogTitle>
                <DialogDescription>
                  Donnez un nom à votre configuration pour la retrouver facilement
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="presetName">Nom du preset</Label>
                  <Input
                    id="presetName"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Ex: Configuration entrepôt"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSavePreset}>Sauvegarder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={handleImportPreset}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      {presets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Aucun preset sauvegardé. Créez-en un pour commencer !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {presets.map((preset) => (
            <Card key={preset.id}>
              <CardHeader>
                <CardTitle className="text-base">{preset.name}</CardTitle>
                <CardDescription>
                  {new Date(preset.timestamp).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Grille: {preset.config.columns}×{preset.config.rows}</p>
                  <p>Format: {preset.config.pageFormat}</p>
                  <p>Données: {preset.config.data?.length || 0} codes-barres</p>
                  <p>Couleurs: {preset.config.lineColors.length + preset.config.columnColors.length + preset.config.cellColors.length}</p>
                  <p>Espacement: {preset.config.lineSpacing.length + preset.config.columnSpacing.length} règles</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleLoadPreset(preset.id)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Charger
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportPreset(preset.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePreset(preset.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
