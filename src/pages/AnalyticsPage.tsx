
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
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsPage = () => {
  const [activeCategory, setActiveCategory] = useState("business");
  const [activeModule, setActiveModule] = useState("client");

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

  // Group analytics modules into categories
  const categories = [
    { 
      id: "business",
      name: "Business Insights",
      modules: [
        { id: "client", name: "Client & Case Metrics", icon: Users, component: ClientManagementAnalytics },
        { id: "operations", name: "Operational Efficiency", icon: BarChart2, component: OperationalEfficiencyAnalytics },
        { id: "marketing", name: "Marketing & Leads", icon: TrendingUp, component: MarketingAnalytics },
        { id: "trustees", name: "Trustee Performance", icon: Activity, component: TrusteePerformanceAnalytics }
      ]
    },
    { 
      id: "documents",
      name: "Document Analytics",
      modules: [
        { id: "documents", name: "Document Management", icon: Book, component: DocumentAnalytics, data: documentMockData }
      ]
    },
    { 
      id: "compliance",
      name: "Compliance & Risk",
      modules: [
        { id: "compliance", name: "Compliance & Risk", icon: Shield, component: ComplianceAnalytics }
      ]
    },
    { 
      id: "system",
      name: "System & Infrastructure",
      modules: [
        { id: "usage", name: "System Usage", icon: FileText, component: SystemUsageAnalytics },
        { id: "geographic", name: "Geographic Analysis", icon: Map, component: GeographicAnalytics },
        { id: "health", name: "System Health", icon: Gauge, component: SystemHealthAnalytics },
        { id: "predictive", name: "Predictive Analytics", icon: LineChart, component: PredictiveAnalytics }
      ]
    }
  ];

  // Find the active module data
  const activeModuleData = categories
    .flatMap(category => category.modules)
    .find(module => module.id === activeModule);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Set the first module of the category as active
    const firstModuleId = categories.find(c => c.id === categoryId)?.modules[0]?.id || "";
    setActiveModule(firstModuleId);
  };

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

          <div className="grid grid-cols-12 gap-6">
            {/* Categories sidebar */}
            <div className="col-span-12 md:col-span-3">
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <h2 className="font-medium text-lg mb-3">Analytics Categories</h2>
                  <nav className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                          activeCategory === category.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted transition-colors"
                        }`}
                      >
                        {category.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {category.modules.length}
                        </span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="col-span-12 md:col-span-9">
              <Card className="border border-border/50 shadow-sm">
                <CardContent className="p-5">
                  {/* Module tabs for the selected category */}
                  <div className="mb-6">
                    <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-4">
                      <TabsList className="h-auto p-1 bg-muted/50 mb-2">
                        {categories
                          .find(c => c.id === activeCategory)
                          ?.modules.map((module) => (
                            <TabsTrigger 
                              key={module.id} 
                              value={module.id}
                              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                              <module.icon className="h-4 w-4" />
                              <span>{module.name}</span>
                            </TabsTrigger>
                          ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Module title and description */}
                  {activeModuleData && (
                    <div className="border-b border-border/50 pb-4 mb-6">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <activeModuleData.icon className="h-6 w-6 text-primary" />
                        {activeModuleData.name}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        {getTabDescription(activeModuleData.id)}
                      </p>
                    </div>
                  )}

                  {/* Module content */}
                  {categories.map(category => (
                    category.modules.map(module => (
                      <div key={module.id} className={activeModule === module.id ? "block" : "hidden"}>
                        {module.id === "documents" ? (
                          <DocumentAnalytics 
                            taskVolume={documentMockData.taskVolume}
                            timeSaved={documentMockData.timeSaved}
                            errorReduction={documentMockData.errorReduction}
                          />
                        ) : (
                          <module.component />
                        )}
                      </div>
                    ))
                  ))}
                </CardContent>
              </Card>
            </div>
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
