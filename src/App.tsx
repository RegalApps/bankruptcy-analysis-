
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { TrackingProvider } from "./providers/TrackingProvider";
import { initPerformanceMonitoring, measureRouteChange } from "./utils/performanceMonitor";
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext";
import { PageTransition } from "./components/navigation/PageTransition";
import { AnimatePresence } from "framer-motion";

// Lazy loaded pages with preloading
const AnalyticsPage = lazy(() => {
  const modulePromise = import("./pages/AnalyticsPage");
  // Trigger preload on initial chunk load
  setTimeout(() => import("./pages/DocumentsPage"), 1000);
  return modulePromise;
});
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const IndexPage = lazy(() => import("./pages/Index"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Create a client for React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Route change tracker component
const RouteChangeTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    const prevPath = sessionStorage.getItem('prevPath') || '/';
    const currentPath = location.pathname;
    
    if (prevPath !== currentPath) {
      measureRouteChange(prevPath, currentPath);
      sessionStorage.setItem('prevPath', currentPath);
    }
  }, [location]);
  
  return null;
};

// Custom Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="space-y-4 text-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Preload main pages on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import("./pages/Index");
        import("./pages/DocumentsPage");
      });
    } else {
      setTimeout(() => {
        import("./pages/Index");
        import("./pages/DocumentsPage");
      }, 1000);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TrackingProvider>
            <Router>
              <RouteChangeTracker />
              <Suspense fallback={<PageLoader />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={
                      <PageTransition>
                        <IndexPage />
                      </PageTransition>
                    } />
                    <Route path="/index" element={
                      <PageTransition>
                        <IndexPage />
                      </PageTransition>
                    } />
                    <Route path="/analytics" element={
                      <PageTransition>
                        <AnalyticsPage />
                      </PageTransition>
                    } />
                    <Route path="/documents" element={
                      <PageTransition>
                        <DocumentsPage />
                      </PageTransition>
                    } />
                    <Route path="*" element={
                      <PageTransition>
                        <NotFoundPage />
                      </PageTransition>
                    } />
                  </Routes>
                </AnimatePresence>
              </Suspense>
              <Toaster position="top-right" />
            </Router>
          </TrackingProvider>
        </QueryClientProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
