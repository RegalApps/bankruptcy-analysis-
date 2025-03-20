
import React, { useState, useEffect } from "react";
import { Client } from "../types";
import { FormTabs } from "./modal-sections/FormTabs";
import { AnalyticsSidebar } from "./modal-sections/AnalyticsSidebar";
import { useIncomeExpenseForm } from "../hooks/useIncomeExpenseForm";
import { initialFormData } from "../hooks/initialState";
import { ModalWrapper } from "./modal-sections/ModalWrapper";
import { 
  useClientCreation, 
  ClientCreationDialogWrapper 
} from "./modal-sections/ClientCreationHandler";
import { useFormSubmission } from "./modal-sections/FormSubmissionHandler";

interface IncomeExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClient?: Client | null;
  onClientSelect?: (clientId: string) => void;
  enableClientCreation?: boolean;
}

export const IncomeExpenseModal = ({ 
  open, 
  onOpenChange, 
  selectedClient: initialClient = null,
  onClientSelect,
  enableClientCreation = true
}: IncomeExpenseModalProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient);
  const [activeTab, setActiveTab] = useState<string>("client");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const {
    formData,
    isSubmitting,
    currentRecordId,
    historicalData,
    previousMonthData,
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleFieldSelectChange,
    handleSubmit,
    handlePeriodChange,
  } = useIncomeExpenseForm(selectedClient);
  
  // Client creation hooks
  const {
    showIntakeDialog,
    setShowIntakeDialog,
    isCreatingClient,
    setIsCreatingClient,
    handleClientCreated,
    handleClientSelect
  } = useClientCreation(
    (clientId: string) => {
      setSelectedClient({ 
        id: clientId, 
        name: "New Client", 
        status: "active",
        last_activity: new Date().toISOString().split('T')[0]
      });
      
      if (onClientSelect) {
        onClientSelect(clientId);
      }
      
      setActiveTab("client");
    },
    hasUnsavedChanges
  );
  
  // Form submission hooks
  const {
    handleFormSubmit,
    handleDocumentSubmit,
    handleCloseWithConfirmation,
    handleSaveDraft
  } = useFormSubmission(
    handleSubmit,
    setHasUnsavedChanges,
    onOpenChange
  );
  
  useEffect(() => {
    if (formData !== initialFormData) {
      setHasUnsavedChanges(true);
    }
  }, [formData]);
  
  const modalTitle = selectedClient ? '📝 Income & Expense Form' : '📝 New Income & Expense Form';
  
  return (
    <>
      <ModalWrapper 
        open={open} 
        onClose={handleCloseWithConfirmation} 
        title={modalTitle}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleFormSubmit}>
              <FormTabs
                selectedClient={selectedClient}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hasUnsavedChanges={hasUnsavedChanges}
                enableClientCreation={enableClientCreation}
                isCreatingClient={isCreatingClient}
                handleClientSelect={handleClientSelect}
                setShowIntakeDialog={setShowIntakeDialog}
                formData={formData}
                previousMonthData={previousMonthData}
                historicalData={historicalData}
                onChange={handleChange}
                onFrequencyChange={handleFrequencyChange}
                handleSaveDraft={handleSaveDraft}
                handleDocumentSubmit={handleDocumentSubmit}
                isSubmitting={isSubmitting}
                handleFieldSelectChange={handleFieldSelectChange}
              />
            </form>
          </div>
          
          {selectedClient && (
            <AnalyticsSidebar
              formData={formData}
              previousMonthData={previousMonthData}
              historicalData={historicalData}
            />
          )}
        </div>
      </ModalWrapper>

      {/* This is the dialog that should appear when "Add Client With Details" is clicked */}
      <NewClientIntakeDialog
        open={showIntakeDialog}
        onOpenChange={setShowIntakeDialog}
        onClientCreated={handleClientCreated}
        setIsCreatingClient={setIsCreatingClient}
      />
    </>
  );
};
