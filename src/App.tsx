
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuditTrailPage } from '@/pages/AuditTrailPage';
import { EFilingPage } from '@/pages/EFilingPage'; 

// Define placeholder components for missing pages
const DashboardPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Dashboard Page</h1></div>;
const ClientViewerPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Client Viewer Page</h1></div>;
const DocumentReviewPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Document Review Page</h1></div>;
const CrmPage = () => <div className="p-8"><h1 className="text-2xl font-bold">CRM Page</h1></div>;
const SettingsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Settings Page</h1></div>;
const NotificationPreferencesPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Notification Preferences Page</h1></div>;
const BillingPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Billing Page</h1></div>;
const SupportPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Support Page</h1></div>;
const NotFoundPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Not Found Page</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/e-filing" replace />} />
        <Route path="/clients/:clientId" element={<ClientViewerPage />} />
        <Route path="/e-filing" element={<EFilingPage />} />
        <Route path="/document-review" element={<DocumentReviewPage />} />
        <Route path="/crm" element={<CrmPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/e-filing/audit-trail" element={<AuditTrailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
