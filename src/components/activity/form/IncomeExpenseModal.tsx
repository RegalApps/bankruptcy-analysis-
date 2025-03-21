
import React, { useState, useEffect } from "react";
import { Client } from "../types";
import { FormTabs } from "./modal-sections/FormTabs";
import { AnalyticsSidebar } from "./modal-sections/AnalyticsSidebar";
import { useIncomeExpenseForm } from "../hooks/useIncomeExpenseForm";
import { initialFormData } from "../hooks/initialState";
import { ModalWrapper } from "./modal-sections/ModalWrapper";
import { useFormSubmission } from "./modal-sections/FormSubmissionHandler";
import { PeriodSelection } from "./PeriodSelection";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface IncomeExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: (clientId: string, clientName: string) => void;
}

export const IncomeExpenseModal = ({ 
  open, 
  onOpenChange,
  onClientCreated
}: IncomeExpenseModalProps) => {
  // Create a new client directly when the modal opens
  const [newClient] = useState<Client>(() => ({
    id: uuidv4(),
    name: "New Client",
    status: "active",
    last_activity: new Date().toISOString().split('T')[0]
  }));
  
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
  } = useIncomeExpenseForm(newClient);
  
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
  
  // When completing the form, notify the parent component about the new client
  const handleCompleteForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update the client name from the form data
      const updatedClientName = formData.full_name || "New Client";
      
      // Handle submission
      await handleFormSubmit(e);
      
      // Notify parent that a client was created
      if (onClientCreated) {
        onClientCreated(newClient.id, updatedClientName);
        
        toast.success(`Client "${updatedClientName}" created successfully`, {
          description: "You can now view this client in the dropdown"
        });
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    }
  };
  
  const modalTitle = '📝 New Income & Expense Form';
  
  return (
    <ModalWrapper 
      open={open} 
      onClose={handleCloseWithConfirmation} 
      title={modalTitle}
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleCompleteForm}>
            {selectedPeriod && (
              <div className="mb-6">
                <PeriodSelection
                  selectedPeriod={selectedPeriod}
                  handlePeriodChange={handlePeriodChange}
                />
              </div>
            )}
            
            <FormTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasUnsavedChanges={hasUnsavedChanges}
              formData={formData}
              previousMonthData={previousMonthData}
              historicalData={historicalData ? [historicalData] : []}
              onChange={handleChange}
              onFrequencyChange={(field: string, value: string) => {
                if (field === 'income') {
                  handleFrequencyChange('income')(value);
                } else if (field === 'expense') {
                  handleFrequencyChange('expense')(value);
                }
              }}
              handleSaveDraft={handleSaveDraft}
              handleDocumentSubmit={handleCompleteForm}
              isSubmitting={isSubmitting}
              handleFieldSelectChange={handleFieldSelectChange}
              isNewClientMode={true}
              newClient={newClient}
            />
          </form>
        </div>
        
        <AnalyticsSidebar
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData ? [historicalData] : []}
        />
      </div>
    </ModalWrapper>
  );
};
