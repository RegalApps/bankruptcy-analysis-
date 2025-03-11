import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientViewerPage } from '@/pages/ClientViewerPage';
import { EFilingPage } from '@/pages/EFilingPage';
import { DocumentReviewPage } from '@/pages/DocumentReviewPage';
import { CrmPage } from '@/pages/CrmPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationPreferencesPage } from '@/pages/NotificationPreferencesPage';
import { BillingPage } from '@/pages/BillingPage';
import { SupportPage } from '@/pages/SupportPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AuditTrailPage } from '@/pages/AuditTrailPage';

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
