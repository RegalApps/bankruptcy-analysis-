
import React, { useState, useEffect } from "react";
import { X, Save, Upload, Printer, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeExpenseData, Client } from "../types";
import { ClientSelector } from "./ClientSelector";
import { ClientProfileSection } from "./ClientProfileSection";
import { EnhancedIncomeSection } from "./EnhancedIncomeSection";
import { EssentialExpensesSection } from "./EssentialExpensesSection";
import { DiscretionaryExpensesSection } from "./DiscretionaryExpensesSection";
import { SavingsInsuranceSection } from "./SavingsInsuranceSection";
import { SignatureConsentSection } from "./SignatureConsentSection";
import { PrintButton } from "./PrintButton";
import { SmartCreateDocumentButton } from "./SmartCreateDocumentButton";
import { useIncomeExpenseForm } from "../hooks/useIncomeExpenseForm";
import { initialFormData } from "../hooks/initialState";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HistoricalComparison } from "../components/HistoricalComparison";
import { RealTimeAnalyticsPanel } from "../components/RealTimeAnalyticsPanel";

interface IncomeExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClient?: Client | null;
  onClientSelect?: (clientId: string) => void;
}

export const IncomeExpenseModal = ({ 
  open, 
  onOpenChange, 
  selectedClient: initialClient = null,
  onClientSelect
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
    handleSubmit,
    handlePeriodChange,
    handleFieldSelectChange,
  } = useIncomeExpenseForm(selectedClient);
  
  // Track form changes
  useEffect(() => {
    if (formData !== initialFormData) {
      setHasUnsavedChanges(true);
    }
  }, [formData]);
  
  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    if (hasUnsavedChanges) {
      // Ask for confirmation before switching clients
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch clients?")) {
        return;
      }
    }
    
    // Handle client selection
    setSelectedClient({ 
      id: clientId, 
      name: "Loading...", 
      status: "active"
    });
    
    // If external handler is provided, call it
    if (onClientSelect) {
      onClientSelect(clientId);
    }
    
    // Move to the next tab
    setActiveTab("income");
  };
  
  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e as React.SyntheticEvent<HTMLFormElement>);
      toast.success("Form submitted successfully!");
      setHasUnsavedChanges(false);
      setTimeout(() => onOpenChange(false), 1500); // Close modal after success
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };
  
  // Handle closing the modal with unsaved changes
  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };
  
  // Handle saving as draft
  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
    setHasUnsavedChanges(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleCloseWithConfirmation}>
      <DialogContent className="max-w-[80vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              📝 New Income & Expense Form
            </DialogTitle>
            <DialogClose className="h-4 w-4" onClick={handleCloseWithConfirmation} />
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main Form Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedClient ? (
              <div className="space-y-6">
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    Please select a client to begin creating an income and expense form
                  </AlertDescription>
                </Alert>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">🔍 Select Client</h3>
                  <ClientSelector
                    selectedClient={selectedClient}
                    onClientSelect={handleClientSelect}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="client">Client Info</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="savings">Savings & Insurance</TabsTrigger>
                    <TabsTrigger value="signature">Signature</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="client" className="space-y-6">
                    <HistoricalComparison
                      currentPeriod={historicalData.currentPeriod}
                      previousPeriod={historicalData.previousPeriod}
                    />
                    
                    <ClientProfileSection 
                      formData={formData} 
                      onChange={handleChange}
                      onMaritalStatusChange={(value) => handleFieldSelectChange('marital_status', value)}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleSaveDraft}>
                        <Save className="h-4 w-4 mr-2" /> Save Draft
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("income")}>
                        Next: Income Details
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="income" className="space-y-6">
                    <EnhancedIncomeSection 
                      formData={formData} 
                      previousMonthData={previousMonthData}
                      onChange={handleChange}
                      onFrequencyChange={handleFrequencyChange('income')}
                    />
                    
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("client")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleSaveDraft}>
                          <Save className="h-4 w-4 mr-2" /> Save Draft
                        </Button>
                        <Button type="button" onClick={() => setActiveTab("expenses")}>
                          Next: Expenses
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="expenses" className="space-y-6">
                    <EssentialExpensesSection 
                      formData={formData} 
                      previousMonthData={previousMonthData}
                      onChange={handleChange}
                    />
                    
                    <DiscretionaryExpensesSection 
                      formData={formData} 
                      previousMonthData={previousMonthData}
                      onChange={handleChange}
                    />
                    
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("income")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleSaveDraft}>
                          <Save className="h-4 w-4 mr-2" /> Save Draft
                        </Button>
                        <Button type="button" onClick={() => setActiveTab("savings")}>
                          Next: Savings & Insurance
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="savings" className="space-y-6">
                    <SavingsInsuranceSection 
                      formData={formData} 
                      previousMonthData={previousMonthData}
                      onChange={handleChange}
                    />
                    
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("expenses")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleSaveDraft}>
                          <Save className="h-4 w-4 mr-2" /> Save Draft
                        </Button>
                        <Button type="button" onClick={() => setActiveTab("signature")}>
                          Next: Signature & Consent
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signature" className="space-y-6">
                    <SignatureConsentSection
                      formData={formData}
                      onChange={handleChange}
                      onConsentChange={(checked) => {
                        const consentEvent = {
                          target: {
                            name: 'consent_data_use',
                            value: checked ? 'true' : 'false'
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        
                        handleChange(consentEvent);
                        
                        // If consent is given, set the consent date to today
                        if (checked) {
                          const todayDate = new Date().toISOString().split('T')[0];
                          const dateEvent = {
                            target: {
                              name: 'consent_date',
                              value: todayDate
                            }
                          } as React.ChangeEvent<HTMLInputElement>;
                          
                          handleChange(dateEvent);
                        }
                      }}
                    />
                    
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("savings")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleSaveDraft}>
                          <Save className="h-4 w-4 mr-2" /> Save Draft
                        </Button>
                        <PrintButton formData={formData} />
                        <SmartCreateDocumentButton 
                          formData={formData}
                          selectedClient={selectedClient}
                          isSubmitting={isSubmitting}
                          onSubmit={(e) => handleFormSubmit(e)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            )}
          </div>
          
          {/* Right Sidebar - Real-time Analytics */}
          {selectedClient && (
            <div className="w-1/4 border-l p-4 overflow-y-auto bg-slate-50">
              <h3 className="text-lg font-medium mb-4">📈 Real-time Analysis</h3>
              <RealTimeAnalyticsPanel 
                formData={formData}
                previousMonthData={previousMonthData}
                historicalData={historicalData}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
