
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalytics } from "@/components/analytics/documents/DocumentAnalytics";
import { CrmAnalytics } from "@/components/analytics/crm/CrmAnalytics";

// Mock data - replace with real data from your backend
const documentMetrics = {
  taskVolume: [
    { month: "Jan", tasks: 65 },
    { month: "Feb", tasks: 75 },
    { month: "Mar", tasks: 85 },
    { month: "Apr", tasks: 95 },
  ],
  timeSaved: [
    { month: "Jan", hours: 12 },
    { month: "Feb", hours: 18 },
    { month: "Mar", hours: 25 },
    { month: "Apr", hours: 32 },
  ],
  errorReduction: [
    { month: "Jan", errors: 15 },
    { month: "Feb", errors: 12 },
    { month: "Mar", errors: 8 },
    { month: "Apr", errors: 5 },
  ]
};

const crmMetrics = {
  leadConversion: [
    { name: "Leads", value: 400 },
    { name: "Qualified", value: 300 },
    { name: "Proposals", value: 200 },
    { name: "Closed", value: 100 },
  ],
  featureUsage: [
    { name: "Document Management", value: 35 },
    { name: "Task Creation", value: 25 },
    { name: "Collaboration", value: 20 },
    { name: "Analytics", value: 20 },
  ]
};

export const AnalyticsPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your document management and CRM performance metrics
            </p>
          </div>

          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Document Management Analytics</TabsTrigger>
              <TabsTrigger value="crm">CRM Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <DocumentAnalytics 
                taskVolume={documentMetrics.taskVolume}
                timeSaved={documentMetrics.timeSaved}
                errorReduction={documentMetrics.errorReduction}
              />
            </TabsContent>

            <TabsContent value="crm">
              <CrmAnalytics 
                leadConversion={crmMetrics.leadConversion}
                featureUsage={crmMetrics.featureUsage}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
