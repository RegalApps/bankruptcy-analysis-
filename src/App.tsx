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

const SettingsPage = lazy(() => import("./pages/SettingsPage").catch(error => {
  console.error("Error loading SettingsPage:", error);
  return import("./pages/NotFound");
}));

const ProfilePage = lazy(() => import("./pages/ProfilePage").catch(error => {
  console.error("Error loading ProfilePage:", error);
  return import("./pages/NotFound");
}));

// Import NotFound directly without lazy loading to prevent circular dependency issues
import NotFoundPage from "./pages/NotFound";

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

const MeetingsPage = lazy(() => import("./pages/MeetingsPage").catch(error => {
  console.error("Error loading MeetingsPage:", error);
  return import("./pages/NotFound");
}));

const NotificationsPage = lazy(() => import("./pages/NotificationsPage").catch(error => {
  console.error("Error loading NotificationsPage:", error);
  return import("./pages/NotFound");
}));

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").catch(error => {
  console.error("Error loading PrivacyPolicy:", error);
  return import("./pages/NotFound");
}));

const TermsOfService = lazy(() => import("./pages/TermsOfService").catch(error => {
  console.error("Error loading TermsOfService:", error);
  return import("./pages/NotFound");
}));

const Support = lazy(() => import("./pages/Support").catch(error => {
  console.error("Error loading Support:", error);
  return import("./pages/NotFound");
}));

const NewSupportTicket = lazy(() => import("./pages/NewSupportTicket").catch(error => {
  console.error("Error loading NewSupportTicket:", error);
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
                  <Route path="/privacy-policy" element={
                    <PageTransition>
                      <PrivacyPolicy />
                    </PageTransition>
                  } />
                  <Route path="/terms-of-service" element={
                    <PageTransition>
                      <TermsOfService />
                    </PageTransition>
                  } />
                  <Route path="/support" element={
                    <PageTransition>
                      <Support />
                    </PageTransition>
                  } />
                  <Route path="/support/new" element={
                    <PageTransition>
                      <NewSupportTicket />
                    </PageTransition>
                  } />
                  <Route path="/notifications" element={
                    <PageTransition>
                      <NotificationsPage />
                    </PageTransition>
                  } />
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
                  <Route path="/meetings" element={
                    <PageTransition>
                      <MeetingsPage />
                    </PageTransition>
                  } />
                  <Route path="/settings" element={
                    <PageTransition>
                      <SettingsPage />
                    </PageTransition>
                  } />
                  <Route path="/profile" element={
                    <PageTransition>
                      <ProfilePage />
                    </PageTransition>
                  } />
                  <Route path="/client-viewer/:clientId" element={<ClientViewerPage />} />
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
