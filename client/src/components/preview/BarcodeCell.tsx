import { useEffect, useRef } from "react";
import { generateBarcode } from "@/lib/barcode-generator";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { cn } from "@/lib/utils";

interface BarcodeCellProps {
  value: string;
  text?: string;
  row: number;
  col: number;
  customBarcodeHeight?: number;
}

export default function BarcodeCell({ value, text, row, col, customBarcodeHeight }: BarcodeCellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    config,
    lineColors,
    columnColors,
    cellColors,
    selection,
    toggleSelection,
    viewport,
  } = useBarcodeStore();

  const cellKey = `${row}-${col}`;
  const isSelected = selection.has(cellKey);
  const isHovered = viewport.hoveredCell === cellKey;

  // Déterminer les couleurs (priorité: cellule > ligne > colonne > défaut)
  const cellColor = cellColors.get(cellKey);
  const lineColor = lineColors.get(row);
  const columnColor = columnColors.get(col);

  const backgroundColor = cellColor?.backgroundColor || lineColor?.backgroundColor || columnColor?.backgroundColor || "#ffffff";
  const barcodeColor = cellColor?.barcodeColor || lineColor?.barcodeColor || columnColor?.barcodeColor || "#000000";
  const textColor = cellColor?.textColor || lineColor?.textColor || columnColor?.textColor || "#000000";

  useEffect(() => {
    if (canvasRef.current) {
      generateBarcode(canvasRef.current, value, {
        width: config.globalSettings.barWidth,
        height: customBarcodeHeight || config.globalSettings.barcodeHeight,
        fontSize: config.globalSettings.fontSize,
        textMargin: config.globalSettings.textMargin,
        background: "transparent",
        lineColor: barcodeColor,
        displayValue: false,
      });
    }
  }, [value, config.globalSettings, barcodeColor, customBarcodeHeight]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      toggleSelection(cellKey);
    } else {
      useBarcodeStore.getState().clearSelection();
      toggleSelection(cellKey);
    }
  };

  const handleMouseEnter = () => {
    useBarcodeStore.getState().updateViewport({ hoveredCell: cellKey });
  };

  const handleMouseLeave = () => {
    useBarcodeStore.getState().updateViewport({ hoveredCell: null });
  };

  return (
    <div
      className={cn(
        "relative border rounded transition-all cursor-pointer",
        isSelected && "ring-2 ring-blue-500 border-blue-500",
        isHovered && "border-blue-400 shadow-md"
      )}
      style={{
        backgroundColor,
        padding: `${config.globalSettings.cellPadding}px`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="w-full" />
      <div
        className="text-center mt-1 font-medium"
        style={{ color: textColor, fontSize: config.globalSettings.fontSize }}
      >
        {text || value}
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
