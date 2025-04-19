
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "./components/layout/AppLayout";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentsPageProvider from "./pages/documents/DocumentsPageProvider";
import RecentlyAccessedPage from "./pages/RecentlyAccessedPage";
import DocumentManagementPage from "./pages/DocumentManagementPage";
import UploadDiagnosticsPage from "./pages/UploadDiagnosticsPage";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<RecentlyAccessedPage />} />
          <Route path="/documents" element={<DocumentsPageProvider />} />
          <Route path="/documents/browse" element={<DocumentsPage />} />
          <Route path="/documents/manage" element={<DocumentManagementPage />} />
          <Route path="/upload-diagnostics" element={<UploadDiagnosticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
