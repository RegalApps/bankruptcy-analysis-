
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ActivityPage } from "./pages/ActivityPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ConBrandingPage } from "./pages/ConBrandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CRMPage } from "./pages/CRMPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/con-branding" element={<ConBrandingPage />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <SonnerToaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
