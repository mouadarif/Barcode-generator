# Configuration Presets

This folder contains default configuration presets for the barcode generator.

## How it works

- Configuration files are automatically saved here when you create new presets
- You can manually add configuration files to this folder
- The application will automatically load all configurations from this folder
- File format: JSON files with `.json` extension

## File naming

- Use descriptive names like `small-labels-a4.json`
- Avoid spaces and special characters
- The application will use the filename as the preset name

## Example structure

```json
{
  "id": "config-preset-1234567890",
  "name": "Small Labels A4",
  "timestamp": 1234567890,
  "config": {
    "columns": 6,
    "rows": 8,
    "pageFormat": "A4",
    "margin": 5,
    "lineColors": [],
    "columnColors": [],
    "cellColors": [],
    "lineSpacing": [],
    "columnSpacing": [],
    "globalSettings": {
      "barcodeHeight": 40,
      "barWidth": 2,
      "fontSize": 12,
      "textMargin": 2,
      "cellPadding": 4
    }
  }
}
```
