export interface LineSpacing {
  afterLineIndex: number;
  spacing: number; // en px
}

export interface ColumnSpacing {
  afterColumnIndex: number;
  spacing: number; // en px
}

export interface CellPadding {
  row: number;
  col: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}
