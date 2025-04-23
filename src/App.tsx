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
import Support from "./pages/Support";
import Index from "./pages/Index";
// Keep both document viewer implementations
import DocumentViewerPage from "./pages/DocumentViewerPage";
import { ViewDocumentPage } from "./pages/ViewDocumentPage";
import ClientViewerPage from "./pages/ClientViewerPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ConBrandingPage from "./pages/ConBrandingPage";
import "./App.css";
import { useEffect } from "react";
import { clearDocumentStorage } from "./utils/clearStorage";
import { clearCache } from './utils/clearCache';
import logger from './utils/logger';
import { initializeOpenAI } from '@/config/openaiConfig';
import { DocumentProvider } from './contexts/DocumentContext';
import CustomAnalysisPage from "@/pages/CustomAnalysisPage";

function App() {
  // Clear stale document references from localStorage on application startup
  useEffect(() => {
    // Clear any stale document references from storage
    clearDocumentStorage();
    
    // Also add an event listener to clear storage when the page is unloaded
    // This helps prevent stale references on refresh
    const handleBeforeUnload = () => {
      clearDocumentStorage();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Clear cache on application startup
  useEffect(() => {
    // Clear all application cache to ensure a clean state
    clearCache();
    logger.info('Application started with a clean cache');
  }, []);

  // Initialize OpenAI API key on application startup
  useEffect(() => {
    const setupOpenAI = async () => {
      try {
        const success = await initializeOpenAI();
        if (success) {
          logger.info('OpenAI API key initialized successfully');
        } else {
          logger.warn('Failed to initialize OpenAI API key');
        }
      } catch (error) {
        logger.error('Error initializing OpenAI API key:', error);
      }
    };
    
    setupOpenAI();
  }, []);

  return (
    <DocumentProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        {/* Keep both document viewer routes */}
        <Route path="/document-viewer/:documentId" element={<DocumentViewerPage />} />
        <Route path="/document/:documentId" element={<ViewDocumentPage />} />
        <Route path="/client-viewer/:clientId" element={<ClientViewerPage />} />
        <Route path="/meetings/*" element={<MeetingsPage />} />
        <Route path="/calendar-fullscreen" element={<CalendarFullscreenPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/e-filing" element={<EFilingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/SAFA" element={<ConBrandingPage />} />
        <Route path="/custom-analysis" element={<CustomAnalysisPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DocumentProvider>
  );
}

export default App;
