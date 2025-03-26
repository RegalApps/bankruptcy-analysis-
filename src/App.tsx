
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { TrackingProvider } from "./providers/TrackingProvider";
import { initPerformanceMonitoring } from "./utils/performanceMonitor";
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext";

// Lazy loaded pages
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TrackingProvider>
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<AnalyticsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
              </Suspense>
            </Router>
            <Toaster position="top-right" />
          </TrackingProvider>
        </QueryClientProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
