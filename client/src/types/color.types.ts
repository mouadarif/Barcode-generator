export interface LineColor {
  lineIndex: number;
  backgroundColor: string;
  barcodeColor: string;
  textColor: string;
}

export interface ColumnColor {
  columnIndex: number;
  backgroundColor: string;
  barcodeColor: string;
  textColor: string;
}

export interface CellColor {
  row: number;
  col: number;
  backgroundColor: string;
  barcodeColor: string;
  textColor: string;
}

export const PRESET_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#14B8A6", // teal
  "#6366F1", // indigo
];
