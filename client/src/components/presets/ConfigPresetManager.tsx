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
import { Save, Trash2, Copy, Settings, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigPresetManager() {
  const { configPresets, saveConfigPreset, loadConfigPreset, deleteConfigPreset, loadConfigPresetsFromStorage } = useBarcodeStore();
  const [presetName, setPresetName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveConfigPreset = () => {
    if (!presetName.trim()) {
      toast.error("Veuillez entrer un nom pour la configuration");
      return;
    }
    saveConfigPreset(presetName);
    toast.success(`Configuration "${presetName}" sauvegardée`);
    setPresetName("");
    setIsDialogOpen(false);
  };

  const handleLoadConfigPreset = (id: string) => {
    loadConfigPreset(id);
    const configPreset = configPresets.find((p) => p.id === id);
    toast.success(`Configuration "${configPreset?.name}" appliquée`);
  };

  const handleDeleteConfigPreset = (id: string) => {
    const configPreset = configPresets.find((p) => p.id === id);
    deleteConfigPreset(id);
    toast.success(`Configuration "${configPreset?.name}" supprimée`);
  };

  const handleRefreshConfigurations = async () => {
    await loadConfigPresetsFromStorage();
    toast.success("Configurations rechargées");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Configurations</h3>
          <p className="text-sm text-muted-foreground">
            Sauvegardez et appliquez des configurations (sans les données)
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
                <DialogTitle>Sauvegarder une configuration</DialogTitle>
                <DialogDescription>
                  Donnez un nom à votre configuration pour la retrouver facilement
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="configPresetName">Nom de la configuration</Label>
                  <Input
                    id="configPresetName"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Ex: Petites étiquettes A4"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveConfigPreset}>Sauvegarder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={handleRefreshConfigurations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Recharger
          </Button>
        </div>
      </div>

      {configPresets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Aucune configuration sauvegardée. Créez-en une pour commencer !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {configPresets.map((configPreset) => (
            <Card key={configPreset.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {configPreset.name}
                </CardTitle>
                <CardDescription>
                  {new Date(configPreset.timestamp).toLocaleDateString("fr-FR", {
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
                  <p>Grille: {configPreset.config.columns}×{configPreset.config.rows}</p>
                  <p>Format: {configPreset.config.pageFormat}</p>
                  <p>Couleurs: {configPreset.config.lineColors.length + configPreset.config.columnColors.length + configPreset.config.cellColors.length}</p>
                  <p>Espacement: {configPreset.config.lineSpacing.length + configPreset.config.columnSpacing.length} règles</p>
                  <p>Police: {configPreset.config.globalSettings.fontSize}px</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleLoadConfigPreset(configPreset.id)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Appliquer
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteConfigPreset(configPreset.id)}
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
