
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSelectionSection, TabContentComponents } from "./TabContentComponents";
import { IncomeExpenseData, Client } from "../../types";

interface FormTabsProps {
  selectedClient: Client | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasUnsavedChanges: boolean;
  enableClientCreation: boolean;
  isCreatingClient: boolean;
  handleClientSelect: (clientId: string) => void;
  setShowIntakeDialog: (show: boolean) => void;
  formData: IncomeExpenseData;
  previousMonthData: IncomeExpenseData;
  historicalData: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrequencyChange: (field: string, value: string) => void;
  handleSaveDraft: () => void;
  handleDocumentSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  handleFieldSelectChange: (field: string, value: string) => void;
}

export const FormTabs = ({
  selectedClient,
  activeTab,
  setActiveTab,
  hasUnsavedChanges,
  enableClientCreation,
  isCreatingClient,
  handleClientSelect,
  setShowIntakeDialog,
  formData,
  previousMonthData,
  historicalData,
  onChange,
  onFrequencyChange,
  handleSaveDraft,
  handleDocumentSubmit,
  isSubmitting,
  handleFieldSelectChange,
}: FormTabsProps) => {
  const handleConsentChange = (checked: boolean) => {
    const consentEvent = {
      target: {
        name: "consent_signature",
        value: checked ? "signed" : ""
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(consentEvent);
  };
  
  // If no client is selected, show client selection view
  if (!selectedClient) {
    return (
      <ClientSelectionSection 
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
        enableClientCreation={enableClientCreation}
        isCreatingClient={isCreatingClient}
        onOpenIntakeDialog={() => setShowIntakeDialog(true)}
      />
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-8">
        <TabsTrigger value="client">Client Profile</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="savings">Savings/Insurance</TabsTrigger>
        <TabsTrigger value="signature">Signature & Submit</TabsTrigger>
      </TabsList>
      
      <TabsContent value="client" className="space-y-6">
        <TabContentComponents.ClientProfileTabContent 
          selectedClient={selectedClient} 
          formData={formData}
          onChange={onChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="income" className="space-y-6">
        <TabContentComponents.IncomeTabContent 
          formData={formData} 
          previousMonthData={previousMonthData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="expenses" className="space-y-6">
        <TabContentComponents.ExpensesTabContent 
          formData={formData} 
          previousMonthData={previousMonthData}
          onChange={onChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="savings" className="space-y-6">
        <TabContentComponents.SavingsTabContent 
          formData={formData} 
          previousMonthData={previousMonthData}
          onChange={onChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="signature" className="space-y-6">
        <TabContentComponents.SignatureTabContent 
          formData={formData}
          onConsentChange={handleConsentChange}
          onChange={onChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
    </Tabs>
  );
};
