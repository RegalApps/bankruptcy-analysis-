
import { Routes, Route } from "react-router-dom";
import CRMPage from "./pages/CRMPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import NotFound from "./pages/NotFound";
import CalendarFullscreenPage from "./pages/CalendarFullscreenPage";
import Index from "./pages/Index";
import EFilingPage from "./pages/EFilingPage";
import ActivityPage from "./pages/ActivityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ClientViewerPage from "./pages/ClientViewerPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/index" element={<Index />} />
      <Route path="/crm" element={<CRMPage />} />
      <Route path="/documents/*" element={<DocumentsPage />} />
      <Route path="/calendar-fullscreen" element={<CalendarFullscreenPage />} />
      <Route path="/e-filing" element={<EFilingPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/client-viewer/:clientId" element={<ClientViewerPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
