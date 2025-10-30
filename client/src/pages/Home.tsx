import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PreviewArea from "@/components/layout/PreviewArea";
import { useEffect } from "react";
import { useBarcodeStore } from "@/stores/useBarcodeStore";

export default function Home() {
  const { undo, redo } = useBarcodeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z pour annuler
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y pour refaire
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
      }
      // Ctrl+P pour imprimer
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        window.print();
      }
      // Ctrl+S pour sauvegarder
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        // Ouvrir le dialogue de preset
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <PreviewArea />
      </div>
    </div>
  );
}
