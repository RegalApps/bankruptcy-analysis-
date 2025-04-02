import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import DocumentsPage from "@/pages/DocumentsPage";
import SupportPage from "@/pages/SupportPage";
import NewSupportTicket from "@/pages/NewSupportTicket";
import DocumentViewerPage from "@/pages/DocumentViewerPage";
import ActivityPage from "@/pages/ActivityPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ClientViewerPage from "@/pages/ClientViewerPage";
import CRMPage from "@/pages/CRMPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthPage from "@/pages/AuthPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/new" element={<NewSupportTicket />} />
        <Route path="/viewer/:documentId" element={<DocumentViewerPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/client/:clientId" element={<ClientViewerPage />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
