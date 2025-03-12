
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuditTrailPage } from '@/pages/AuditTrailPage';
import { EFilingPage } from '@/pages/EFilingPage'; 
import { MainLayout } from '@/components/layout/MainLayout';

// Define placeholder components for missing pages
const DashboardPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
      <p className="mt-4">This is the dashboard page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const ClientViewerPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Client Viewer Page</h1>
      <p className="mt-4">This is the client viewer page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const DocumentReviewPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Document Review Page</h1>
      <p className="mt-4">This is the document review page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const CrmPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">CRM Page</h1>
      <p className="mt-4">This is the CRM page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const SettingsPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Settings Page</h1>
      <p className="mt-4">This is the settings page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const NotificationPreferencesPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Notification Preferences Page</h1>
      <p className="mt-4">This is the notification preferences page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const BillingPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Billing Page</h1>
      <p className="mt-4">This is the billing page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const SupportPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Support Page</h1>
      <p className="mt-4">This is the support page. Content coming soon.</p>
    </div>
  </MainLayout>
);

const NotFoundPage = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Not Found</h1>
      <p className="mt-4">The page you're looking for doesn't exist.</p>
      <button 
        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        onClick={() => window.location.href = '/'}
      >
        Go Home
      </button>
    </div>
  </MainLayout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/e-filing" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
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
