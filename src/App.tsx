
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { ClerkProvider } from "@clerk/clerk-react";
import DashboardPage from "@/pages/DashboardPage";
import DocumentsPage from "@/pages/DocumentsPage";
import DocumentsPageProvider from "@/pages/documents/DocumentsPageProvider";
import RecentlyAccessedPage from "@/pages/RecentlyAccessedPage";
import DocumentManagementPage from "@/pages/DocumentManagementPage";
import UploadDiagnosticsPage from "@/pages/UploadDiagnosticsPage";

// Check if we're in a Lovable environment
const isLovableEnv = 
  typeof window !== "undefined" && 
  window.location.hostname.includes("lovableproject.com");

function App() {
  return (
    <ClerkProvider publishableKey={isLovableEnv ? "pk_test_ZnVuLWdvYXQtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA" : ""}>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<RecentlyAccessedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPageProvider />} />
          <Route path="/documents/browse" element={<DocumentsPage />} />
          <Route path="/documents/manage" element={<DocumentManagementPage />} />
          <Route path="/upload-diagnostics" element={<UploadDiagnosticsPage />} />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

export default App;
