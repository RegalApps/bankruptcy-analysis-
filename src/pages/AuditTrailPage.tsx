
import { MainLayout } from "@/components/layout/MainLayout";
import { AuditTrail } from "@/components/audit-trail/AuditTrail";
import { AuditTrailHeader } from "@/components/audit-trail/AuditTrailHeader";

export const AuditTrailPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <AuditTrailHeader />
        <AuditTrail />
      </div>
    </MainLayout>
  );
};

export default AuditTrailPage;
