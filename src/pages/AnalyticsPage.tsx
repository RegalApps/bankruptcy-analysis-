
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";
import { getAnalyticsCategories } from "@/components/analytics/analyticsCategories";
import { getMockDocumentData } from "@/components/analytics/utils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { showPerformanceToast } from "@/utils/performance";

const AnalyticsPage = () => {
  const [activeCategory, setActiveCategory] = useState("business");
  const [activeModule, setActiveModule] = useState("client");
  const analytics = useAnalytics("AnalyticsDashboard");

  // Get categories
  const categories = getAnalyticsCategories();
  
  // Get mock data for DocumentAnalytics component
  const documentMockData = getMockDocumentData();

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Track the category change
    analytics.trackInteraction("AnalyticsSidebar", "CategoryChange", { categoryId });
    
    // Set the first module of the category as active
    const firstModuleId = categories.find(c => c.id === categoryId)?.modules[0]?.id || "";
    setActiveModule(firstModuleId);
  };

  useEffect(() => {
    // Show performance toast when dashboard loads
    showPerformanceToast("Analytics Dashboard");
  }, []);

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
              <AnalyticsSidebar 
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Main content area */}
            <div className="col-span-12 md:col-span-9">
              <AnalyticsContent 
                categories={categories}
                activeCategory={activeCategory}
                activeModule={activeModule}
                setActiveModule={(moduleId) => {
                  setActiveModule(moduleId);
                  analytics.trackInteraction("AnalyticsContent", "ModuleChange", { moduleId });
                }}
                documentMockData={documentMockData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
