import { BarcodeData } from "@/types/barcode.types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateBarcodeData(data: BarcodeData[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data.length === 0) {
    errors.push("Aucune donnée à valider");
    return { isValid: false, errors, warnings };
  }

  data.forEach((item, index) => {
    // Vérifier que la valeur n'est pas vide
    if (!item.value || item.value.trim() === "") {
      errors.push(`Ligne ${index + 1}: La valeur du code-barres est vide`);
    }

    // Vérifier que la valeur contient uniquement des caractères ASCII
    if (item.value && !/^[\x00-\x7F]+$/.test(item.value)) {
      errors.push(`Ligne ${index + 1}: Le code-barres contient des caractères non-ASCII`);
    }

    // Vérifier la longueur
    if (item.value && item.value.length > 100) {
      warnings.push(`Ligne ${index + 1}: Le code-barres est très long (${item.value.length} caractères)`);
    }

    // Vérifier les doublons
    const duplicates = data.filter((d, i) => i !== index && d.value === item.value);
    if (duplicates.length > 0) {
      warnings.push(`Ligne ${index + 1}: Le code-barres "${item.value}" est en double`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateGridConfiguration(
  columns: number,
  rows: number,
  dataLength: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (columns < 1 || columns > 10) {
    errors.push("Le nombre de colonnes doit être entre 1 et 10");
  }

  if (rows < 1 || rows > 50) {
    errors.push("Le nombre de lignes doit être entre 1 et 50");
  }

  const totalCells = columns * rows;
  if (dataLength > totalCells) {
    warnings.push(
      `Vous avez ${dataLength} codes-barres mais seulement ${totalCells} cellules. Certains codes ne seront pas affichés.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
