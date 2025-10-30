import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(element: HTMLElement, filename: string = "barcodes.pdf"): Promise<void> {
  try {
    // Capturer l'élément en tant qu'image
    const canvas = await html2canvas(element, {
      scale: 2, // Haute résolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Créer le PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Télécharger le PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

export async function generatePNG(element: HTMLElement, filename: string = "barcodes.png"): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Très haute résolution pour PNG
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (error) {
    console.error("Error generating PNG:", error);
    throw error;
  }
}
