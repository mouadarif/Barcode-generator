import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText, Columns } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import { BarcodeData } from "@/types/barcode.types";
import { toast } from "sonner";

interface ColumnData {
  headers: string[];
  data: any[];
}

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [columnData, setColumnData] = useState<ColumnData | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const setData = useBarcodeStore((state) => state.setData);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const findDefaultColumn = (headers: string[]): string => {
    // Look for Location or Locations column (case-insensitive)
    const locationColumn = headers.find(h => 
      h.toLowerCase() === 'location' || 
      h.toLowerCase() === 'locations'
    );
    if (locationColumn) return locationColumn;
    
    // Fallback to first column
    return headers[0] || "";
  };

  const processSelectedColumn = () => {
    if (!columnData || !selectedColumn) {
      toast.error("Veuillez sélectionner une colonne");
      return;
    }

    const barcodeData: BarcodeData[] = columnData.data
      .map((row: any, index: number) => {
        const value = row[selectedColumn];
        if (!value || value.toString().trim() === "") return null;
        
        return {
          id: `barcode-${Date.now()}-${index}`,
          value: value.toString(),
          text: value.toString(),
        };
      })
      .filter(Boolean) as BarcodeData[];

    if (barcodeData.length === 0) {
      toast.error("Aucune donnée valide trouvée dans la colonne sélectionnée");
      return;
    }

    setData(barcodeData);
    toast.success(`${barcodeData.length} codes-barres importés depuis la colonne "${selectedColumn}"`);
    setShowColumnSelector(false);
    setColumnData(null);
    setSelectedColumn("");
  };

  const processCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.data.length === 0) {
            toast.error("Aucune donnée trouvée dans le fichier");
            setIsProcessing(false);
            return;
          }

          const headers = Object.keys(results.data[0] as any);
          if (headers.length === 0) {
            toast.error("Aucune colonne trouvée dans le fichier");
            setIsProcessing(false);
            return;
          }

          // Store the data and headers
          setColumnData({
            headers,
            data: results.data as any[]
          });

          // Set default column
          const defaultCol = findDefaultColumn(headers);
          setSelectedColumn(defaultCol);
          
          // Show column selector
          setShowColumnSelector(true);
          setIsProcessing(false);
          
          toast.info(`${headers.length} colonnes trouvées. Sélectionnez celle pour les codes-barres.`);
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.error("Erreur lors du traitement du fichier CSV");
          setIsProcessing(false);
        }
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        toast.error("Erreur lors de la lecture du fichier CSV");
        setIsProcessing(false);
      },
    });
  };

  const processExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          toast.error("Aucune donnée trouvée dans le fichier");
          setIsProcessing(false);
          return;
        }

        const headers = Object.keys(jsonData[0] as any);
        if (headers.length === 0) {
          toast.error("Aucune colonne trouvée dans le fichier");
          setIsProcessing(false);
          return;
        }

        // Store the data and headers
        setColumnData({
          headers,
          data: jsonData as any[]
        });

        // Set default column
        const defaultCol = findDefaultColumn(headers);
        setSelectedColumn(defaultCol);
        
        // Show column selector
        setShowColumnSelector(true);
        setIsProcessing(false);
        
        toast.info(`${headers.length} colonnes trouvées. Sélectionnez celle pour les codes-barres.`);
      } catch (error) {
        console.error("Error processing Excel:", error);
        toast.error("Erreur lors du traitement du fichier Excel");
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      processCSV(file);
    } else if (["xlsx", "xls"].includes(fileExtension || "")) {
      processExcel(file);
    } else {
      toast.error("Format de fichier non supporté. Utilisez CSV ou Excel.");
      setIsProcessing(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!showColumnSelector ? (
        <>
          <div>
            <h3 className="font-medium mb-2">Importer des données</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Importez un fichier CSV ou Excel contenant vos codes-barres
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            onClick={handleFileSelect}
            disabled={isProcessing}
            className="w-full"
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? "Traitement en cours..." : "Sélectionner un fichier"}
          </Button>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>CSV:</strong> Fichier texte avec colonnes séparées par des virgules
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Excel:</strong> Fichier .xlsx ou .xls
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Colonnes prioritaires:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Par défaut: "Location" ou "Locations"</li>
              <li>Sinon: première colonne disponible</li>
              <li>Vous pourrez choisir après l'import</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="font-medium mb-2">Sélectionner la colonne</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choisissez la colonne à utiliser pour générer les codes-barres
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Columns className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {columnData?.headers.length} colonnes trouvées
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <RadioGroup value={selectedColumn} onValueChange={setSelectedColumn}>
                {columnData?.headers.map((header) => {
                  const sampleValues = columnData.data
                    .slice(0, 3)
                    .map(row => row[header])
                    .filter(val => val !== undefined && val !== null && val !== "");
                  
                  return (
                    <div key={header} className="flex items-start space-x-2 p-2 rounded hover:bg-muted">
                      <RadioGroupItem value={header} id={header} className="mt-0.5" />
                      <Label htmlFor={header} className="flex-1 cursor-pointer">
                        <div>
                          <span className="font-medium">{header}</span>
                          {header.toLowerCase() === 'location' || header.toLowerCase() === 'locations' ? (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Par défaut
                            </span>
                          ) : null}
                        </div>
                        {sampleValues.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Exemples: {sampleValues.slice(0, 3).join(", ")}
                            {sampleValues.length > 3 && "..."}
                          </div>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowColumnSelector(false);
                  setColumnData(null);
                  setSelectedColumn("");
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={processSelectedColumn}
                disabled={!selectedColumn}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
