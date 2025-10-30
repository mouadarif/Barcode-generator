import JsBarcode from "jsbarcode";

export interface BarcodeOptions {
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  textMargin?: number;
  background?: string;
  lineColor?: string;
  margin?: number;
}

export function generateBarcode(
  element: HTMLCanvasElement | SVGElement,
  value: string,
  options: BarcodeOptions = {}
): void {
  try {
    JsBarcode(element, value, {
      format: "CODE128",
      width: options.width || 2,
      height: options.height || 50,
      displayValue: options.displayValue !== false,
      fontSize: options.fontSize || 12,
      textMargin: options.textMargin || 2,
      background: options.background || "#ffffff",
      lineColor: options.lineColor || "#000000",
      margin: options.margin || 0,
    });
  } catch (error) {
    console.error("Error generating barcode:", error);
  }
}

export function validateBarcodeValue(value: string): boolean {
  // CODE128 accepts alphanumeric characters
  return /^[\x00-\x7F]+$/.test(value) && value.length > 0;
}
