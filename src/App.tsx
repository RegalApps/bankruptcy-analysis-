
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuditTrailPage } from '@/pages/AuditTrailPage';

// Define placeholder components for missing pages
const DashboardPage = () => <div>Dashboard Page</div>;
const ClientViewerPage = () => <div>Client Viewer Page</div>;
const EFilingPage = () => <div>E-Filing Page</div>;
const DocumentReviewPage = () => <div>Document Review Page</div>;
const CrmPage = () => <div>CRM Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const NotificationPreferencesPage = () => <div>Notification Preferences Page</div>;
const BillingPage = () => <div>Billing Page</div>;
const SupportPage = () => <div>Support Page</div>;
const NotFoundPage = () => <div>Not Found Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients/:clientId" element={<ClientViewerPage />} />
        <Route path="/e-filing" element={<EFilingPage />} />
        <Route path="/document-review" element={<DocumentReviewPage />} />
        <Route path="/crm" element={<CrmPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/e-filing/audit-trail" element={<AuditTrailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
