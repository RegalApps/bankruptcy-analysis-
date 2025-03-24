
import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Simple inline loading component for faster initial render
const LoadingPlaceholder = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

// Directly import DocumentsPage to avoid dynamic import issues
import DocumentsPage from "./pages/DocumentsPage";
// Directly import EFilingPage to avoid the dynamic import error
import EFilingPage from "./pages/EFilingPage";

// Lazy load pages with prefetching for better UX
const Index = lazy(() => import("./pages/Index"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ConBrandingPage = lazy(() => import("./pages/ConBrandingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CRMPage = lazy(() => import("./pages/CRMPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PerformancePage = lazy(() => import("./pages/PerformancePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Support = lazy(() => import("./pages/Support"));
const NewSupportTicket = lazy(() => import("./pages/NewSupportTicket"));
const SupportTicketDetail = lazy(() => import("./pages/SupportTicketDetail"));

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      gcTime: 10 * 60 * 1000, // 10 minutes (replacing cacheTime)
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingPlaceholder />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/SAFA" element={<ConBrandingPage />} />
                <Route path="/crm" element={<CRMPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/e-filing" element={<EFilingPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/support" element={<Support />} />
                <Route path="/support/new" element={<NewSupportTicket />} />
                <Route path="/support/ticket/:id" element={<SupportTicketDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <SonnerToaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
