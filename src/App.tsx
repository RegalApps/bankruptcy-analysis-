
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ActivityPage } from "./pages/ActivityPage";
import { FoldersPage } from "./pages/FoldersPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ConBrandingPage } from "./pages/ConBrandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/con-branding" element={<ConBrandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
