import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Save, Undo2, Redo2, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { APP_TITLE } from "@/const";
import ExportModal from "@/components/export/ExportModal";
import PrintPreview from "@/components/export/PrintPreview";
import PresetManager from "@/components/presets/PresetManager";
import ConfigPresetManager from "@/components/presets/ConfigPresetManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const { undo, redo, historyIndex, history } = useBarcodeStore();
  const { theme, toggleTheme } = useTheme();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isConfigPresetOpen, setIsConfigPresetOpen] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="border-b bg-background print:hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <h1 className="text-xl font-bold">{APP_TITLE}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => undo()}
            disabled={!canUndo}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => redo()}
            disabled={!canRedo}
            title="Refaire (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm" onClick={toggleTheme} title="Changer le thème">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm" title="Sauvegarder le preset (Ctrl+S)" onClick={() => setIsPresetOpen(true)}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="ghost" size="sm" title="Configurations" onClick={() => setIsConfigPresetOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurations
          </Button>
          <Button variant="ghost" size="sm" title="Exporter (Ctrl+E)" onClick={() => setIsExportOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="default" size="sm" title="Imprimer (Ctrl+P)" onClick={() => setIsPrintOpen(true)}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      <ExportModal open={isExportOpen} onOpenChange={setIsExportOpen} />
      <PrintPreview open={isPrintOpen} onOpenChange={setIsPrintOpen} />
      <Dialog open={isPresetOpen} onOpenChange={setIsPresetOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des presets</DialogTitle>
          </DialogHeader>
          <PresetManager />
        </DialogContent>
      </Dialog>
      <Dialog open={isConfigPresetOpen} onOpenChange={setIsConfigPresetOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des configurations</DialogTitle>
          </DialogHeader>
          <ConfigPresetManager />
        </DialogContent>
      </Dialog>
    </header>
  );
}
