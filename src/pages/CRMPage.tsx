
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ClientIntakeDialog } from "@/components/crm/intake-dialog/ClientIntakeDialog";
import { CRMHeader } from "@/components/crm/page/CRMHeader";
import { ClientStats } from "@/components/crm/page/ClientStats";
import { CRMTabs } from "@/components/crm/page/CRMTabs";
import { useClientIntake } from "@/components/crm/hooks/useClientIntake";

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
          {/* Header Section */}
          <CRMHeader openClientDialog={openClientDialog} />

          {/* Quick Stats */}
          <ClientStats />

          {/* Main Content Tabs */}
          <CRMTabs />
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
