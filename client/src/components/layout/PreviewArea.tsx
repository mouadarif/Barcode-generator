import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Ruler } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import InteractiveGrid from "@/components/preview/InteractiveGrid";

const PAGE_SIZES = {
  A4: { width: 210, height: 297 },
  A1: { width: 594, height: 841 },
} as const;

const DEFAULT_SPACING = 16;

export default function PreviewArea() {
  const { viewport, updateViewport, config, data } = useBarcodeStore();

  const pageSize = PAGE_SIZES[config.pageFormat] ?? PAGE_SIZES.A4;
  
  // Calculate barcode dimensions
  const rowsPerPage = Math.max(config.rows, 1);
  const columns = Math.max(config.columns, 1);
  const pagePadding = Math.max(config.margin, 0);
  
  // Calculate available height for content
  const availableHeight = (pageSize.height - pagePadding * 2) * 3.7795; // Convert mm to px
  const availableWidth = (pageSize.width - pagePadding * 2) * 3.7795;
  
  // Calculate total spacing
  const totalRowSpacing = rowsPerPage > 1 ? (DEFAULT_SPACING * (rowsPerPage - 1)) : 0;
  const totalColSpacing = columns > 1 ? (DEFAULT_SPACING * (columns - 1)) : 0;
  
  // Calculate dimensions per unit
  const rowHeight = (availableHeight - totalRowSpacing) / rowsPerPage;
  const colWidth = (availableWidth - totalColSpacing) / columns;
  
  // Calculate optimal barcode height
  const optimalBarcodeHeight = Math.max(
    30,
    Math.min(
      150,
      rowHeight - config.globalSettings.cellPadding * 2 - config.globalSettings.fontSize - config.globalSettings.textMargin - 20
    )
  );
  
  // Convert to mm for display
  const barcodeHeightMm = Math.round(optimalBarcodeHeight / 3.7795);
  const barcodeWidthMm = Math.round((colWidth - config.globalSettings.cellPadding * 2) / 3.7795);
  const cellHeightMm = Math.round(rowHeight / 3.7795);
  const cellWidthMm = Math.round(colWidth / 3.7795);

  const handleZoomIn = () => {
    updateViewport({ zoom: Math.min(viewport.zoom + 0.25, 4) });
  };

  const handleZoomOut = () => {
    updateViewport({ zoom: Math.max(viewport.zoom - 0.25, 0.25) });
  };

  const handleFitToView = () => {
    updateViewport({ zoom: 1, pan: { x: 0, y: 0 } });
  };

  const handleZoomChange = (value: number[]) => {
    updateViewport({ zoom: value[0] });
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Contrôles de vue */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="w-32">
              <Slider
                value={[viewport.zoom]}
                min={0.25}
                max={4}
                step={0.25}
                onValueChange={handleZoomChange}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[4rem] text-center">
              {Math.round(viewport.zoom * 100)}%
            </span>
          </div>

          {data.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Cellule:</span>
                  <span className="font-semibold">{cellWidthMm}×{cellHeightMm}mm</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Code-barre:</span>
                  <span className="font-semibold">{barcodeWidthMm}×{barcodeHeightMm}mm</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Hauteur:</span>
                  <span className="font-semibold text-primary">{optimalBarcodeHeight}px</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={handleFitToView}>
          <Maximize2 className="w-4 h-4 mr-2" />
          Ajuster à la vue
        </Button>
      </div>

      {/* Zone de prévisualisation */}
      <div className="flex-1 overflow-auto p-8 printable-scroll">
        <div
          className="printable-root mx-auto space-y-8"
          style={{
            transform: `scale(${viewport.zoom})`,
            transformOrigin: "top center",
            width: `${pageSize.width}mm`,
          }}
        >
          <InteractiveGrid />
        </div>
      </div>
    </div>
  );
}
