
import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then(module => ({ default: module.default || module })));
const ActivityPage = lazy(() => import("./pages/ActivityPage").then(module => ({ default: module.default || module })));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage").then(module => ({ default: module.default || module })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").then(module => ({ default: module.default || module })));
const ConBrandingPage = lazy(() => import("./pages/ConBrandingPage").then(module => ({ default: module.default || module })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(module => ({ default: module.default || module })));
const CRMPage = lazy(() => import("./pages/CRMPage").then(module => ({ default: module.default || module })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(module => ({ default: module.default || module })));
const EFilingPage = lazy(() => import("./pages/EFilingPage").then(module => ({ default: module.default || module })));
const NotFound = lazy(() => import("./pages/NotFound").then(module => ({ default: module.default || module })));

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      // Remove the suspense property as it's not supported in this version
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><LoadingSpinner size="large" /></div>}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <SonnerToaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
