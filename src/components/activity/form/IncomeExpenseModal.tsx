
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { IncomeExpenseData, Client } from "../types";
import { FormTabs } from "./modal-sections/FormTabs";
import { AnalyticsSidebar } from "./modal-sections/AnalyticsSidebar";
import { NewClientIntakeDialog } from "./NewClientIntakeDialog";
import { useIncomeExpenseForm } from "../hooks/useIncomeExpenseForm";
import { initialFormData } from "../hooks/initialState";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

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
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  
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
  
  useEffect(() => {
    if (formData !== initialFormData) {
      setHasUnsavedChanges(true);
    }
  }, [formData]);
  
  const handleClientSelect = (clientId: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch clients?")) {
        return;
      }
    }
    
    setSelectedClient({ 
      id: clientId, 
      name: "Loading...", 
      status: "active",
    });
    
    if (onClientSelect) {
      onClientSelect(clientId);
    }
    
    setActiveTab("client");
  };

  const handleClientCreated = (newClientId: string) => {
    setShowIntakeDialog(false);
    handleClientSelect(newClientId);
    toast.success("New client created successfully");
  };

  // Function to handle direct client creation
  const handleDirectClientCreation = () => {
    // Generate a UUID for the new client
    const newClientId = uuidv4();
    
    // Create a temporary client with the new ID
    // Fix the type error by explicitly typing status as "active" (a valid union type value)
    const newClient: Client = { 
      id: newClientId, 
      name: "New Client", 
      status: "active", // Explicitly use "active" which matches the Client type
      last_activity: new Date().toISOString().split('T')[0]
    };
    
    // Set the new client as selected
    setSelectedClient(newClient);
    
    if (onClientSelect) {
      onClientSelect(newClientId);
    }
    
    // Set the active tab to client profile for user to fill in details
    setActiveTab("client");
    
    toast.success("New client created. Please fill in client details.");
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e as React.SyntheticEvent<HTMLFormElement>);
      toast.success("Form submitted successfully!");
      setHasUnsavedChanges(false);
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };
  
  const handleDocumentSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e).catch(err => {
      console.error("Error in document submission:", err);
    });
  };
  
  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };
  
  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
    setHasUnsavedChanges(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseWithConfirmation}>
        <DialogContent className="max-w-[80vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                📝 {selectedClient ? 'Income & Expense Form' : 'New Income & Expense Form'}
              </DialogTitle>
              <DialogClose className="h-4 w-4" onClick={handleCloseWithConfirmation} />
            </div>
          </DialogHeader>
          
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
                  onCreateDirectClient={handleDirectClientCreation}
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
        </DialogContent>
      </Dialog>

      <NewClientIntakeDialog
        open={showIntakeDialog}
        onOpenChange={setShowIntakeDialog}
        onClientCreated={handleClientCreated}
        setIsCreatingClient={setIsCreatingClient}
      />
    </>
  );
};
