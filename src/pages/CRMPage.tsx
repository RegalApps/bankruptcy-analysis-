
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ClientIntakeDialog } from "@/components/crm/intake-dialog/ClientIntakeDialog";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { useClientIntake } from "@/components/crm/hooks/useClientIntake";
import { CRMHeader } from "@/components/crm/page/CRMHeader";

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
          {/* CRM Header with Add New Client button */}
          <CRMHeader openClientDialog={openClientDialog} />
          
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
