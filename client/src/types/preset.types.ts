import { GridConfig, BarcodeData } from "./barcode.types";
import { LineColor, ColumnColor, CellColor } from "./color.types";
import { LineSpacing, ColumnSpacing } from "./spacing.types";

export interface Preset {
  id: string;
  name: string;
  timestamp: number;
  config: PresetConfig;
}

export interface PresetConfig {
  // Data
  data: BarcodeData[];
  
  // Grid configuration
  columns: number;
  rows: number;
  pageFormat: "A4" | "A1";
  margin: number;
  
  // Colors
  lineColors: LineColor[];
  columnColors: ColumnColor[];
  cellColors: CellColor[];
  
  // Spacing
  lineSpacing: LineSpacing[];
  columnSpacing: ColumnSpacing[];
  
  // Global settings
  globalSettings: GridConfig["globalSettings"];
}
