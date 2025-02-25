
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeExpenseForm } from "@/components/activity/IncomeExpenseForm";
import { ActivityDashboard } from "@/components/activity/ActivityDashboard";
import { DocumentUploadSection } from "@/components/activity/DocumentUploadSection";
import { PredictiveAnalysis } from "@/components/activity/PredictiveAnalysis";

export const ActivityPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Smart Income & Expense Management</h1>
            </div>
            
            <Tabs defaultValue="form" className="space-y-4">
              <TabsList>
                <TabsTrigger value="form">Income & Expense Form</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-4">
                <IncomeExpenseForm />
              </TabsContent>

              <TabsContent value="dashboard">
                <ActivityDashboard />
              </TabsContent>

              <TabsContent value="predictive">
                <PredictiveAnalysis />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentUploadSection />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
