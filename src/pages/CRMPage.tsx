
import { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ClientIntakeDialog } from "@/components/crm/intake-dialog/ClientIntakeDialog";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { useClientIntake } from "@/components/crm/hooks/useClientIntake";
import { CRMTabs } from "@/components/crm/page/CRMTabs";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const CRMPage = () => {
  const [view, setView] = useState<"overview" | "client-detail">("overview");
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

  const handleClientCreated = () => {
    // After client creation, we would typically:
    // 1. Get the new client ID from the creation response
    // 2. Set that as the selected client
    // 3. Switch to client detail view
    // For now, we'll just go back to overview
    setView("overview");
  };

  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <MainHeader />
        <div className="container mx-auto p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {view === "overview" ? "Client Management" : "Client Profile"}
            </h1>
            <Button onClick={openClientDialog} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add New Client
            </Button>
          </div>

          {view === "overview" ? (
            <ClientDashboard 
              onSelectClient={handleClientSelect} 
            />
          ) : (
            <CRMTabs onBack={handleBackToOverview} />
          )}
        </div>
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
    </div>
  );
};

export default CRMPage;
