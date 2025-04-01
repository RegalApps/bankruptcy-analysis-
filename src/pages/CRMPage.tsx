
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ClientIntakeDialog } from "@/components/crm/intake-dialog/ClientIntakeDialog";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { useClientIntake } from "@/components/crm/hooks/useClientIntake";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const CRMPage = () => {
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

  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <MainHeader />
        <div className="container mx-auto p-6 space-y-8">
          {/* Add New Client Button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Client Relationship Management</h1>
            <Button 
              onClick={openClientDialog}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add New Client
            </Button>
          </div>
          
          {/* Client Dashboard with improved navigation */}
          <ClientDashboard />
        </div>
      </div>

      {/* Enhanced AI-Powered Client Intake Dialog */}
      <ClientIntakeDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onSubmit={handleSubmitForm}
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
