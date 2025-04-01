
import { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ClientIntakeDialog } from "@/components/crm/intake-dialog/ClientIntakeDialog";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { CRMTabs } from "@/components/crm/page/CRMTabs";
import { CRMHeader } from "@/components/crm/page/CRMHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useClientIntake } from "@/components/crm/hooks/useClientIntake";
import { MainLayout } from "@/components/layout/MainLayout";

export const CRMPage = () => {
  const [view, setView] = useState<"overview" | "client-detail" | "dashboard">("overview");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {
    isClientDialogOpen,
    setIsClientDialogOpen,
    currentStep,
    setCurrentStep,
    formProgress,
    formData,
    openClientDialog,
    handleInputChange,
    handleSelectChange,
    handleEmploymentTypeChange,
    handleSubmitForm
  } = useClientIntake();

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setView("client-detail");
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedClientId(null);
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedClientId(null);
  };

  const handleClientCreated = () => {
    // After client creation, we would typically:
    // 1. Get the new client ID from the creation response
    // 2. Set that as the selected client
    // 3. Switch to client detail view
    // For now, we'll just go back to overview
    setView("overview");
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-8">
        {view === "overview" ? (
          <>
            <CRMHeader openClientDialog={openClientDialog} onDashboardView={handleBackToDashboard} />
            <ClientDashboard 
              onSelectClient={handleClientSelect} 
            />
          </>
        ) : view === "client-detail" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleBackToOverview} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Client List
                </Button>
                <h1 className="text-2xl font-bold">Client Profile</h1>
              </div>
              <Button 
                onClick={handleBackToDashboard}
                variant="default"
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Return to CRM Dashboard
              </Button>
            </div>
            <CRMTabs />
          </>
        ) : (
          <>
            <div className="text-center mb-10 mt-8">
              <h1 className="text-4xl font-bold mb-4">CRM Dashboard</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Welcome to your centralized client relationship management dashboard.
                Access all your client data and tools from this hub.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div 
                className="p-8 border rounded-lg shadow-sm bg-card flex flex-col items-center cursor-pointer hover:shadow-md transition-all"
                onClick={handleBackToOverview}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Client Management</h2>
                <p className="text-center text-muted-foreground mb-4">
                  Manage client profiles, view activities, and track engagement
                </p>
                <Button className="mt-auto">View Clients</Button>
              </div>
              
              <div 
                className="p-8 border rounded-lg shadow-sm bg-card flex flex-col items-center cursor-pointer hover:shadow-md transition-all"
                onClick={openClientDialog}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ArrowLeft className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Add New Client</h2>
                <p className="text-center text-muted-foreground mb-4">
                  Create a new client profile and start managing their information
                </p>
                <Button className="mt-auto">Add Client</Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced AI-Powered Client Intake Dialog */}
      <ClientIntakeDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onSubmit={() => {
          handleSubmitForm();
          handleClientCreated();
        }}
        formData={formData}
        formProgress={formProgress}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleEmploymentTypeChange={handleEmploymentTypeChange}
      />
    </MainLayout>
  );
};

export default CRMPage;
