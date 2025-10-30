import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, Grid3x3, Palette, Space, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/data/FileUpload";
import DataGenerator from "@/components/data/DataGenerator";
import GridControls from "@/components/controls/GridControls";
import StyleControls from "@/components/controls/StyleControls";
import ColorControls from "@/components/controls/ColorControls";
import SpacingControls from "@/components/controls/SpacingControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("import");

  const sections = [
    { id: "import", label: "Import", icon: Upload },
    { id: "grid", label: "Grille", icon: Grid3x3 },
    { id: "colors", label: "Couleurs", icon: Palette },
    { id: "spacing", label: "Espacement", icon: Space },
    { id: "styles", label: "Styles", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "import":
        return (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Importer</TabsTrigger>
              <TabsTrigger value="generate">Générer</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <FileUpload />
            </TabsContent>
            <TabsContent value="generate" className="mt-4">
              <DataGenerator />
            </TabsContent>
          </Tabs>
        );
      case "grid":
        return <GridControls />;
      case "styles":
        return <StyleControls />;
      case "colors":
        return <ColorControls />;
      case "spacing":
        return <SpacingControls />;
      default:
        return null;
    }
  };

  return (
    <aside
      className={cn(
        "border-r bg-background transition-all duration-300 flex flex-col print:hidden",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="font-semibold">Contrôles</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">{section.label}</span>}
            </Button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      )}
    </aside>
  );
}
