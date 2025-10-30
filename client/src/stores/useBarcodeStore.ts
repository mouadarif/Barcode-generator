import { create } from "zustand";
import { BarcodeData, GridConfig, ViewState, HistoryState } from "@/types/barcode.types";
import { LineColor, ColumnColor, CellColor } from "@/types/color.types";
import { LineSpacing, ColumnSpacing } from "@/types/spacing.types";
import { Preset } from "@/types/preset.types";
import { ConfigPreset } from "@/types/config-preset.types";

interface BarcodeStore {
  // Données
  data: BarcodeData[];
  setData: (data: BarcodeData[]) => void;
  
  // Configuration grille
  config: GridConfig;
  updateConfig: (updates: Partial<GridConfig>) => void;
  
  // Couleurs
  lineColors: Map<number, LineColor>;
  columnColors: Map<number, ColumnColor>;
  cellColors: Map<string, CellColor>;
  setLineColor: (index: number, color: LineColor) => void;
  setColumnColor: (index: number, color: ColumnColor) => void;
  setCellColor: (key: string, color: CellColor) => void;
  clearLineColor: (index: number) => void;
  clearColumnColor: (index: number) => void;
  clearCellColor: (key: string) => void;
  
  // Espacement
  lineSpacing: Map<number, number>;
  columnSpacing: Map<number, number>;
  setLineSpacing: (index: number, spacing: number) => void;
  setColumnSpacing: (index: number, spacing: number) => void;
  
  // Vue
  viewport: ViewState;
  updateViewport: (updates: Partial<ViewState>) => void;
  
  // Sélection
  selection: Set<string>;
  select: (keys: string[]) => void;
  deselect: (keys: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (key: string) => void;
  
  // Historique
  history: HistoryState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  addToHistory: () => void;
  
  // Presets (with data)
  presets: Preset[];
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  loadPresetsFromStorage: () => void;
  
  // Configuration presets (without data)
  configPresets: ConfigPreset[];
  saveConfigPreset: (name: string) => void;
  loadConfigPreset: (id: string) => void;
  deleteConfigPreset: (id: string) => void;
  loadConfigPresetsFromStorage: () => void;
}

const defaultConfig: GridConfig = {
  columns: 4,
  rows: 10,
  pageFormat: "A4",
  margin: 20,
  globalSettings: {
    barcodeWidth: 2,
    barcodeHeight: 50,
    fontSize: 12,
    barWidth: 2,
    textMargin: 2,
    cellPadding: 10,
  },
};

export const useBarcodeStore = create<BarcodeStore>((set, get) => ({
  // État initial
  data: [],
  config: defaultConfig,
  lineColors: new Map(),
  columnColors: new Map(),
  cellColors: new Map(),
  lineSpacing: new Map(),
  columnSpacing: new Map(),
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedCells: new Set(),
    hoveredCell: null,
  },
  selection: new Set(),
  history: [],
  historyIndex: -1,
  presets: [],
  configPresets: [],

  // Actions données
  setData: (data) => {
    set({ data });
    get().addToHistory();
  },

  // Actions configuration
  updateConfig: (updates) => {
    set((state) => ({
      config: { ...state.config, ...updates },
    }));
    get().addToHistory();
  },

  // Actions couleurs
  setLineColor: (index, color) => {
    set((state) => {
      const newMap = new Map(state.lineColors);
      newMap.set(index, color);
      return { lineColors: newMap };
    });
    get().addToHistory();
  },

  setColumnColor: (index, color) => {
    set((state) => {
      const newMap = new Map(state.columnColors);
      newMap.set(index, color);
      return { columnColors: newMap };
    });
    get().addToHistory();
  },

  setCellColor: (key, color) => {
    set((state) => {
      const newMap = new Map(state.cellColors);
      newMap.set(key, color);
      return { cellColors: newMap };
    });
    get().addToHistory();
  },

  clearLineColor: (index) => {
    set((state) => {
      const newMap = new Map(state.lineColors);
      newMap.delete(index);
      return { lineColors: newMap };
    });
    get().addToHistory();
  },

  clearColumnColor: (index) => {
    set((state) => {
      const newMap = new Map(state.columnColors);
      newMap.delete(index);
      return { columnColors: newMap };
    });
    get().addToHistory();
  },

  clearCellColor: (key) => {
    set((state) => {
      const newMap = new Map(state.cellColors);
      newMap.delete(key);
      return { cellColors: newMap };
    });
    get().addToHistory();
  },

  // Actions espacement
  setLineSpacing: (index, spacing) => {
    set((state) => {
      const newMap = new Map(state.lineSpacing);
      newMap.set(index, spacing);
      return { lineSpacing: newMap };
    });
    get().addToHistory();
  },

  setColumnSpacing: (index, spacing) => {
    set((state) => {
      const newMap = new Map(state.columnSpacing);
      newMap.set(index, spacing);
      return { columnSpacing: newMap };
    });
    get().addToHistory();
  },

  // Actions vue
  updateViewport: (updates) => {
    set((state) => ({
      viewport: { ...state.viewport, ...updates },
    }));
  },

  // Actions sélection
  select: (keys) => {
    set((state) => {
      const newSelection = new Set(state.selection);
      keys.forEach((key) => newSelection.add(key));
      return { selection: newSelection };
    });
  },

  deselect: (keys) => {
    set((state) => {
      const newSelection = new Set(state.selection);
      keys.forEach((key) => newSelection.delete(key));
      return { selection: newSelection };
    });
  },

  clearSelection: () => {
    set({ selection: new Set() });
  },

  toggleSelection: (key) => {
    set((state) => {
      const newSelection = new Set(state.selection);
      if (newSelection.has(key)) {
        newSelection.delete(key);
      } else {
        newSelection.add(key);
      }
      return { selection: newSelection };
    });
  },

  // Actions historique
  addToHistory: () => {
    const state = get();
    const snapshot = {
      timestamp: Date.now(),
      state: {
        data: state.data,
        config: state.config,
        lineColors: new Map(state.lineColors),
        columnColors: new Map(state.columnColors),
        cellColors: new Map(state.cellColors),
        lineSpacing: new Map(state.lineSpacing),
        columnSpacing: new Map(state.columnSpacing),
      },
    };

    set((state) => ({
      history: [...state.history.slice(0, state.historyIndex + 1), snapshot],
      historyIndex: state.historyIndex + 1,
    }));
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const previousState = state.history[state.historyIndex - 1].state;
      set({
        ...previousState,
        historyIndex: state.historyIndex - 1,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1].state;
      set({
        ...nextState,
        historyIndex: state.historyIndex + 1,
      });
    }
  },

  // Actions presets
  savePreset: (name) => {
    const state = get();
    const preset: Preset = {
      id: `preset-${Date.now()}`,
      name,
      timestamp: Date.now(),
      config: {
        // Save all data
        data: state.data,
        
        // Grid configuration
        columns: state.config.columns,
        rows: state.config.rows,
        pageFormat: state.config.pageFormat,
        margin: state.config.margin,
        
        // Colors
        lineColors: Array.from(state.lineColors.values()),
        columnColors: Array.from(state.columnColors.values()),
        cellColors: Array.from(state.cellColors.values()),
        
        // Spacing
        lineSpacing: Array.from(state.lineSpacing.entries()).map(([afterLineIndex, spacing]) => ({
          afterLineIndex,
          spacing,
        })),
        columnSpacing: Array.from(state.columnSpacing.entries()).map(([afterColumnIndex, spacing]) => ({
          afterColumnIndex,
          spacing,
        })),
        
        // Global settings
        globalSettings: state.config.globalSettings,
      },
    };

    const newPresets = [...state.presets, preset];
    set({ presets: newPresets });
    localStorage.setItem("barcode-presets", JSON.stringify(newPresets));
  },

  loadPreset: (id) => {
    const state = get();
    const preset = state.presets.find((p) => p.id === id);
    if (preset) {
      const lineColors = new Map(preset.config.lineColors.map((c) => [c.lineIndex, c]));
      const columnColors = new Map(preset.config.columnColors.map((c) => [c.columnIndex, c]));
      const cellColors = new Map(
        preset.config.cellColors.map((c) => [`${c.row}-${c.col}`, c])
      );
      const lineSpacing = new Map(preset.config.lineSpacing.map((s) => [s.afterLineIndex, s.spacing]));
      const columnSpacing = new Map(
        preset.config.columnSpacing.map((s) => [s.afterColumnIndex, s.spacing])
      );

      set({
        // Load all data
        data: preset.config.data || [],
        
        // Grid configuration
        config: {
          columns: preset.config.columns,
          rows: preset.config.rows,
          pageFormat: preset.config.pageFormat,
          margin: preset.config.margin,
          globalSettings: preset.config.globalSettings,
        },
        
        // Colors
        lineColors,
        columnColors,
        cellColors,
        
        // Spacing
        lineSpacing,
        columnSpacing,
      });
      get().addToHistory();
    }
  },

  deletePreset: (id) => {
    const state = get();
    const newPresets = state.presets.filter((p) => p.id !== id);
    set({ presets: newPresets });
    localStorage.setItem("barcode-presets", JSON.stringify(newPresets));
  },

  loadPresetsFromStorage: () => {
    const stored = localStorage.getItem("barcode-presets");
    if (stored) {
      try {
        const presets = JSON.parse(stored);
        set({ presets });
      } catch (e) {
        console.error("Failed to load presets:", e);
      }
    }
  },

  // Configuration preset actions
  saveConfigPreset: (name) => {
    const state = get();
    const configPreset: ConfigPreset = {
      id: `config-preset-${Date.now()}`,
      name,
      timestamp: Date.now(),
      config: {
        // Grid configuration
        columns: state.config.columns,
        rows: state.config.rows,
        pageFormat: state.config.pageFormat,
        margin: state.config.margin,
        
        // Colors
        lineColors: Array.from(state.lineColors.values()),
        columnColors: Array.from(state.columnColors.values()),
        cellColors: Array.from(state.cellColors.values()),
        
        // Spacing
        lineSpacing: Array.from(state.lineSpacing.entries()).map(([afterLineIndex, spacing]) => ({
          afterLineIndex,
          spacing,
        })),
        columnSpacing: Array.from(state.columnSpacing.entries()).map(([afterColumnIndex, spacing]) => ({
          afterColumnIndex,
          spacing,
        })),
        
        // Global settings
        globalSettings: state.config.globalSettings,
      },
    };

    const newConfigPresets = [...state.configPresets, configPreset];
    set({ configPresets: newConfigPresets });
    localStorage.setItem("barcode-config-presets", JSON.stringify(newConfigPresets));
  },

  loadConfigPreset: (id) => {
    const state = get();
    const configPreset = state.configPresets.find((p) => p.id === id);
    if (configPreset) {
      const lineColors = new Map(configPreset.config.lineColors.map((c) => [c.lineIndex, c]));
      const columnColors = new Map(configPreset.config.columnColors.map((c) => [c.columnIndex, c]));
      const cellColors = new Map(
        configPreset.config.cellColors.map((c) => [`${c.row}-${c.col}`, c])
      );
      const lineSpacing = new Map(configPreset.config.lineSpacing.map((s) => [s.afterLineIndex, s.spacing]));
      const columnSpacing = new Map(
        configPreset.config.columnSpacing.map((s) => [s.afterColumnIndex, s.spacing])
      );

      set({
        // Keep existing data, only update configuration
        config: {
          columns: configPreset.config.columns,
          rows: configPreset.config.rows,
          pageFormat: configPreset.config.pageFormat,
          margin: configPreset.config.margin,
          globalSettings: configPreset.config.globalSettings,
        },
        
        // Colors
        lineColors,
        columnColors,
        cellColors,
        
        // Spacing
        lineSpacing,
        columnSpacing,
      });
      get().addToHistory();
    }
  },

  deleteConfigPreset: (id) => {
    const state = get();
    const newConfigPresets = state.configPresets.filter((p) => p.id !== id);
    set({ configPresets: newConfigPresets });
    localStorage.setItem("barcode-config-presets", JSON.stringify(newConfigPresets));
  },

  loadConfigPresetsFromStorage: async () => {
    try {
      // Load from localStorage first
      const stored = localStorage.getItem("barcode-config-presets");
      let configPresets: ConfigPreset[] = [];
      
      if (stored) {
        try {
          configPresets = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to load config presets from localStorage:", e);
        }
      }

      // Load default configurations from public folder
      try {
        const response = await fetch('/configurations/');
        if (response.ok) {
          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const links = doc.querySelectorAll('a[href$=".json"]');
          
          const defaultConfigs: ConfigPreset[] = [];
          const linksArray = Array.from(links);
          for (const link of linksArray) {
            const filename = link.getAttribute('href');
            if (filename) {
              try {
                const configResponse = await fetch(`/configurations/${filename}`);
                if (configResponse.ok) {
                  const config = await configResponse.json();
                  defaultConfigs.push(config);
                }
              } catch (e) {
                console.error(`Failed to load config ${filename}:`, e);
              }
            }
          }
          
          // Merge with localStorage configs, avoiding duplicates
          const existingIds = new Set(configPresets.map(p => p.id));
          const newConfigs = defaultConfigs.filter(c => !existingIds.has(c.id));
          configPresets = [...configPresets, ...newConfigs];
        }
      } catch (e) {
        console.error("Failed to load default configurations:", e);
      }

      set({ configPresets });
    } catch (e) {
      console.error("Failed to load config presets:", e);
    }
  },
}));
