import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useBarcodeStore } from "./stores/useBarcodeStore";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const loadPresetsFromStorage = useBarcodeStore((state) => state.loadPresetsFromStorage);
  const loadConfigPresetsFromStorage = useBarcodeStore((state) => state.loadConfigPresetsFromStorage);

  useEffect(() => {
    loadPresetsFromStorage();
    loadConfigPresetsFromStorage();
  }, [loadPresetsFromStorage, loadConfigPresetsFromStorage]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
