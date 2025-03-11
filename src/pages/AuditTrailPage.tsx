
import { MainLayout } from "@/components/layout/MainLayout";
import { AuditTrail } from "@/components/audit-trail/AuditTrail";
import { AuditTrailHeader } from "@/components/audit-trail/AuditTrailHeader";
import { Metadata } from "@/components/ui/metadata";

export const AuditTrailPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <AuditTrailHeader />
        <AuditTrail />
        
        {/* Secure footer - Could be a component in a real implementation */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>SecureFiles AI Audit Trail System v1.2.3 • ISO 27001 Certified • SOC 2 Compliant • GDPR Ready</p>
          <p className="mt-1">Data encrypted at rest with AES-256 • All transmissions protected with TLS 1.3</p>
          <p className="mt-1">© 2025 SecureFiles AI • All actions are immutably logged and blockchain verified</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuditTrailPage;
