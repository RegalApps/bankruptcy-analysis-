
import { Routes, Route } from "react-router-dom";
import CRMPage from "./pages/CRMPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import NotFound from "./pages/NotFound";
import MeetingsPage from "./pages/MeetingsPage";
import CalendarFullscreenPage from "./pages/CalendarFullscreenPage";
import ActivityPage from "./pages/ActivityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import EFilingPage from "./pages/EFilingPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CRMPage />} />
      <Route path="/crm" element={<CRMPage />} />
      <Route path="/documents/*" element={<DocumentsPage />} />
      <Route path="/meetings/*" element={<MeetingsPage />} />
      <Route path="/calendar-fullscreen" element={<CalendarFullscreenPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/e-filing" element={<EFilingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
