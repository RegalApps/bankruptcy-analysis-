
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientManagementAnalytics } from "@/components/analytics/client/ClientManagementAnalytics";
import { OperationalEfficiencyAnalytics } from "@/components/analytics/operational/OperationalEfficiencyAnalytics";
import { ComplianceAnalytics } from "@/components/analytics/compliance/ComplianceAnalytics";
import { DocumentAnalytics } from "@/components/analytics/documents/DocumentAnalytics";
import { MarketingAnalytics } from "@/components/analytics/marketing/MarketingAnalytics";
import { PredictiveAnalytics } from "@/components/analytics/predictive/PredictiveAnalytics";
import { TrusteePerformanceAnalytics } from "@/components/analytics/performance/TrusteePerformanceAnalytics";
import { SystemUsageAnalytics } from "@/components/analytics/system/SystemUsageAnalytics";
import { GeographicAnalytics } from "@/components/analytics/geographic/GeographicAnalytics";
import { SystemHealthAnalytics } from "@/components/analytics/health/SystemHealthAnalytics";

export const AnalyticsPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Comprehensive Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your trustee practice with detailed insights across all operational areas
            </p>
          </div>

          <Tabs defaultValue="client" className="space-y-4">
            <TabsList className="flex flex-wrap h-auto p-1 mb-2">
              <TabsTrigger value="client">Client & Case Metrics</TabsTrigger>
              <TabsTrigger value="operations">Operational Efficiency</TabsTrigger>
              <TabsTrigger value="compliance">Compliance & Risk</TabsTrigger>
              <TabsTrigger value="documents">Document Management</TabsTrigger>
              <TabsTrigger value="marketing">Marketing & Leads</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
              <TabsTrigger value="trustees">Trustee Performance</TabsTrigger>
              <TabsTrigger value="usage">System Usage</TabsTrigger>
              <TabsTrigger value="geographic">Geographic Analysis</TabsTrigger>
              <TabsTrigger value="health">System Health</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <ClientManagementAnalytics />
            </TabsContent>

            <TabsContent value="operations">
              <OperationalEfficiencyAnalytics />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceAnalytics />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentAnalytics 
                taskVolume={[
                  { month: "Jan", tasks: 65 },
                  { month: "Feb", tasks: 75 },
                  { month: "Mar", tasks: 85 },
                  { month: "Apr", tasks: 95 },
                ]}
                timeSaved={[
                  { month: "Jan", hours: 12 },
                  { month: "Feb", hours: 18 },
                  { month: "Mar", hours: 25 },
                  { month: "Apr", hours: 32 },
                ]}
                errorReduction={[
                  { month: "Jan", errors: 15 },
                  { month: "Feb", errors: 12 },
                  { month: "Mar", errors: 8 },
                  { month: "Apr", errors: 5 },
                ]}
              />
            </TabsContent>

            <TabsContent value="marketing">
              <MarketingAnalytics />
            </TabsContent>

            <TabsContent value="predictive">
              <PredictiveAnalytics />
            </TabsContent>

            <TabsContent value="trustees">
              <TrusteePerformanceAnalytics />
            </TabsContent>

            <TabsContent value="usage">
              <SystemUsageAnalytics />
            </TabsContent>

            <TabsContent value="geographic">
              <GeographicAnalytics />
            </TabsContent>

            <TabsContent value="health">
              <SystemHealthAnalytics />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

// Add default export
export default AnalyticsPage;
