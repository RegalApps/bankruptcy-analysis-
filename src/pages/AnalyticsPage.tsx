
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
    { name: "Total Leads", value: 400 },
    { name: "Marketing Qualified", value: 300 },
    { name: "Sales Qualified", value: 200 },
    { name: "Opportunities", value: 150 },
    { name: "Closed Won", value: 100 }
  ],
  featureUsage: [
    { name: "Document Management", value: 35 },
    { name: "Task Creation", value: 25 },
    { name: "Client Communication", value: 20 },
    { name: "Analytics", value: 20 }
  ],
  salesRepRevenue: [
    { name: "John Doe", revenue: 120000 },
    { name: "Jane Smith", revenue: 150000 },
    { name: "Bob Johnson", revenue: 90000 },
    { name: "Alice Brown", revenue: 180000 }
  ],
  churnRate: [
    { date: "Jan", rate: 2.1 },
    { date: "Feb", rate: 1.8 },
    { date: "Mar", rate: 2.2 },
    { date: "Apr", rate: 1.6 },
    { date: "May", rate: 1.4 }
  ],
  customerAcquisitionCost: [
    { period: "Q1", cost: 500 },
    { period: "Q2", cost: 450 },
    { period: "Q3", cost: 480 },
    { period: "Q4", cost: 420 }
  ],
  monthlyRevenue: [
    { date: "Jan", revenue: 50000, projected: 48000 },
    { date: "Feb", revenue: 55000, projected: 52000 },
    { date: "Mar", revenue: 58000, projected: 56000 },
    { date: "Apr", revenue: 62000, projected: 60000 }
  ],
  salesCycle: [
    { date: "Jan", days: 45 },
    { date: "Feb", days: 42 },
    { date: "Mar", days: 38 },
    { date: "Apr", days: 35 }
  ],
  npsScore: [
    { period: "Q1", score: 65 },
    { period: "Q2", score: 68 },
    { period: "Q3", score: 72 },
    { period: "Q4", score: 75 }
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
                salesRepRevenue={crmMetrics.salesRepRevenue}
                churnRate={crmMetrics.churnRate}
                customerAcquisitionCost={crmMetrics.customerAcquisitionCost}
                monthlyRevenue={crmMetrics.monthlyRevenue}
                salesCycle={crmMetrics.salesCycle}
                npsScore={crmMetrics.npsScore}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
