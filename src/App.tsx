
import { Routes, Route } from "react-router-dom";
import CRMPage from "./pages/CRMPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import NotFound from "./pages/NotFound";
import MeetingsPage from "./pages/MeetingsPage";
import CalendarFullscreenPage from "./pages/CalendarFullscreenPage";
import Index from "./pages/Index";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/index" element={<Index />} />
      <Route path="/crm" element={<CRMPage />} />
      <Route path="/documents/*" element={<DocumentsPage />} />
      <Route path="/meetings/*" element={<MeetingsPage />} />
      <Route path="/calendar-fullscreen" element={<CalendarFullscreenPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
