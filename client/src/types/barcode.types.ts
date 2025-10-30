export interface BarcodeData {
  id: string;
  value: string;
  text?: string;
}

export interface GridConfig {
  columns: number;
  rows: number;
  pageFormat: "A4" | "A1";
  margin: number;
  globalSettings: GlobalSettings;
}

export interface GlobalSettings {
  barcodeWidth: number;
  barcodeHeight: number;
  fontSize: number;
  barWidth: number;
  textMargin: number;
  cellPadding: number;
}

export interface ViewState {
  zoom: number;
  pan: { x: number; y: number };
  selectedCells: Set<string>;
  hoveredCell: string | null;
}

export interface HistoryState {
  timestamp: number;
  state: any;
}
