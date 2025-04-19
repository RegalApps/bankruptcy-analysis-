
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DocumentsPage from "@/pages/DocumentsPage";
import DocumentsPageProvider from "@/pages/documents/DocumentsPageProvider";
import RecentlyAccessedPage from "@/pages/RecentlyAccessedPage";
import DocumentManagementPage from "@/pages/DocumentManagementPage";
import UploadDiagnosticsPage from "@/pages/UploadDiagnosticsPage";
import DocumentViewerPage from "@/pages/DocumentViewerPage";
import Index from "@/pages/Index";
import SAFAPage from "@/pages/SAFA";
import CRMPage from "@/pages/CRMPage";
import ActivityPage from "@/pages/ActivityPage";
import EFilingPage from "@/pages/EFilingPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPageProvider />} />
          <Route path="/documents/browse" element={<DocumentsPage />} />
          <Route path="/documents/manage" element={<DocumentManagementPage />} />
          <Route path="/upload-diagnostics" element={<UploadDiagnosticsPage />} />
          <Route path="/document-viewer/:documentId" element={<DocumentViewerPage />} />
          <Route path="/SAFA" element={<SAFAPage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/e-filing" element={<EFilingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
