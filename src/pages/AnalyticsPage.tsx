
import { useState } from "react";
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
import { BarChart2, Book, Shield, FileText, TrendingUp, LineChart, Users, Activity, Map, Gauge } from "lucide-react";

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("client");

  // Mock data for DocumentAnalytics component
  const documentMockData = {
    taskVolume: [
      { month: "Jan", tasks: 120 },
      { month: "Feb", tasks: 150 },
      { month: "Mar", tasks: 180 },
      { month: "Apr", tasks: 170 },
      { month: "May", tasks: 190 },
      { month: "Jun", tasks: 210 }
    ],
    timeSaved: [
      { month: "Jan", hours: 45 },
      { month: "Feb", hours: 50 },
      { month: "Mar", hours: 65 },
      { month: "Apr", hours: 70 },
      { month: "May", hours: 85 },
      { month: "Jun", hours: 95 }
    ],
    errorReduction: [
      { month: "Jan", errors: 30 },
      { month: "Feb", errors: 25 },
      { month: "Mar", errors: 20 },
      { month: "Apr", errors: 15 },
      { month: "May", errors: 12 },
      { month: "Jun", errors: 8 }
    ]
  };

  const analyticsModules = [
    { id: "client", name: "Client & Case Metrics", icon: Users, component: ClientManagementAnalytics },
    { id: "operations", name: "Operational Efficiency", icon: BarChart2, component: OperationalEfficiencyAnalytics },
    { id: "compliance", name: "Compliance & Risk", icon: Shield, component: ComplianceAnalytics },
    { id: "documents", name: "Document Management", icon: Book, component: DocumentAnalytics, data: documentMockData },
    { id: "marketing", name: "Marketing & Leads", icon: TrendingUp, component: MarketingAnalytics },
    { id: "predictive", name: "Predictive Analytics", icon: LineChart, component: PredictiveAnalytics },
    { id: "trustees", name: "Trustee Performance", icon: Activity, component: TrusteePerformanceAnalytics },
    { id: "usage", name: "System Usage", icon: FileText, component: SystemUsageAnalytics },
    { id: "geographic", name: "Geographic Analysis", icon: Map, component: GeographicAnalytics },
    { id: "health", name: "System Health", icon: Gauge, component: SystemHealthAnalytics }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your trustee practice with detailed insights across all operational areas
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border/50 p-5 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-4 bg-muted/50">
                {analyticsModules.map((module) => (
                  <TabsTrigger 
                    key={module.id} 
                    value={module.id}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <module.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{module.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {analyticsModules.map((module) => (
                <TabsContent key={module.id} value={module.id} className="px-1 py-2 mt-0">
                  <div className="border-b border-border/50 pb-4 mb-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <module.icon className="h-6 w-6 text-primary" />
                      {module.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {getTabDescription(module.id)}
                    </p>
                  </div>
                  {module.id === "documents" ? (
                    <module.component 
                      taskVolume={documentMockData.taskVolume}
                      timeSaved={documentMockData.timeSaved}
                      errorReduction={documentMockData.errorReduction}
                    />
                  ) : (
                    <module.component />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const getTabDescription = (tabId: string): string => {
  switch (tabId) {
    case "client":
      return "Insights into client acquisition, retention, and case progression metrics";
    case "operations":
      return "Analytics on staff productivity, workflow efficiency, and process performance";
    case "compliance":
      return "Tracking regulatory compliance, risk assessments, and audit performance";
    case "documents":
      return "Document processing metrics, accuracy rates, and management performance";
    case "marketing":
      return "Lead generation analytics, conversion rates, and channel effectiveness";
    case "predictive":
      return "AI-powered forecasting for future trends and proactive decision making";
    case "trustees":
      return "Performance metrics for trustees and staff members";
    case "usage":
      return "Platform usage patterns, feature adoption, and user engagement";
    case "geographic":
      return "Regional performance metrics and location-based analysis";
    case "health":
      return "System reliability, performance metrics, and technical diagnostics";
    default:
      return "";
  }
};

export default AnalyticsPage;
