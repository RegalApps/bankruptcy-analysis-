
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

// Custom Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="space-y-4 text-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Using React.lazy with explicit chunk names for better debugging
const IndexPage = lazy(() => import("./pages/Index").catch(error => {
  console.error("Error loading IndexPage:", error);
  return import("./pages/NotFound");
}));

const DocumentsPage = lazy(() => import("./pages/DocumentsPage").catch(error => {
  console.error("Error loading DocumentsPage:", error);
  return import("./pages/NotFound");
}));

const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").catch(error => {
  console.error("Error loading AnalyticsPage:", error);
  return import("./pages/NotFound");
}));

const NotFoundPage = lazy(() => import("./pages/NotFound").catch(error => {
  console.error("Error loading NotFoundPage:", error);
  return { default: () => <div>Page not found</div> };
}));

// Add missing page imports
const SAFAPage = lazy(() => import("./pages/ConBrandingPage").catch(error => {
  console.error("Error loading SAFAPage:", error);
  return import("./pages/NotFound");
}));

const CRMPage = lazy(() => import("./pages/CRMPage").catch(error => {
  console.error("Error loading CRMPage:", error);
  return import("./pages/NotFound");
}));

const ActivityPage = lazy(() => import("./pages/ActivityPage").catch(error => {
  console.error("Error loading ActivityPage:", error);
  return import("./pages/NotFound");
}));

const EFilingPage = lazy(() => import("./pages/EFilingPage").catch(error => {
  console.error("Error loading EFilingPage:", error);
  return import("./pages/NotFound");
}));

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

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Preload main pages on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload with error handling
        import("./pages/Index").catch(err => console.error("Preloading error:", err));
        import("./pages/DocumentsPage").catch(err => console.error("Preloading error:", err));
      });
    } else {
      setTimeout(() => {
        import("./pages/Index").catch(err => console.error("Preloading error:", err));
        import("./pages/DocumentsPage").catch(err => console.error("Preloading error:", err));
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
                  {/* Add missing routes */}
                  <Route path="/SAFA" element={
                    <PageTransition>
                      <SAFAPage />
                    </PageTransition>
                  } />
                  <Route path="/crm" element={
                    <PageTransition>
                      <CRMPage />
                    </PageTransition>
                  } />
                  <Route path="/activity" element={
                    <PageTransition>
                      <ActivityPage />
                    </PageTransition>
                  } />
                  <Route path="/e-filing" element={
                    <PageTransition>
                      <EFilingPage />
                    </PageTransition>
                  } />
                  <Route path="*" element={
                    <PageTransition>
                      <NotFoundPage />
                    </PageTransition>
                  } />
                </Routes>
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
