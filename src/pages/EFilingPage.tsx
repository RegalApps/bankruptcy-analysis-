
import { MainLayout } from "@/components/layout/MainLayout";
import { AuditTrailDashboard } from "@/components/e-filing/AuditTrail/AuditTrailDashboard";

export const EFilingPage = () => {
  return (
    <MainLayout>
      <div className="h-full">
        <AuditTrailDashboard />
      </div>
    </MainLayout>
  );
};

export default EFilingPage;
