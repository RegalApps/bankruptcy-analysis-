
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DocumentsPage from "./pages/DocumentsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import NewSupportTicket from "./pages/NewSupportTicket";
import DocumentViewerPage from "./pages/DocumentViewerPage";
import { ActivityPage } from "./pages/ActivityPage";
import { NotificationsPage as AnalyticsPage } from "./pages/NotificationsPage"; // Temporary placeholder
import ClientViewerPage from "./pages/ClientViewerPage";
import CRMPage from "./pages/CRMPage";
import { NotificationsPage as SettingsPage } from "./pages/NotificationsPage"; // Temporary placeholder
import { NotificationsPage as ProfilePage } from "./pages/NotificationsPage"; // Temporary placeholder
import { NotificationsPage as AuthPage } from "./pages/NotificationsPage"; // Temporary placeholder
import NotFound from "./pages/NotFound";
import SupportPage from "./pages/SupportPage";
import MeetingsPage from "./pages/MeetingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/new" element={<NewSupportTicket />} />
        <Route path="/viewer/:documentId" element={<DocumentViewerPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/client/:clientId" element={<ClientViewerPage />} />
        <Route path="/client-viewer/:clientId" element={<ClientViewerPage />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/meetings/*" element={<MeetingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
