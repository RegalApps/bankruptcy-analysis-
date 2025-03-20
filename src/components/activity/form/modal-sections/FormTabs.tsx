import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClientProfileTabContent, 
  IncomeTabContent, 
  ExpensesTabContent, 
  SavingsTabContent, 
  SignatureTabContent 
} from "./TabContentComponents";
import { ClientSelectionSection } from "./ClientSelectionSection";
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
  previousMonthData: any;
  historicalData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (type: 'income' | 'expense') => (value: string) => void;
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
        name: 'consent_data_use',
        value: checked ? 'true' : 'false'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(consentEvent);
    
    if (checked) {
      const todayDate = new Date().toISOString().split('T')[0];
      const dateEvent = {
        target: {
          name: 'consent_date',
          value: todayDate
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(dateEvent);
    }
  };

  const handleMaritalStatusChange = (value: string) => {
    handleFieldSelectChange('marital_status', value);
  };

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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="client">Client Info</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="savings">Savings & Insurance</TabsTrigger>
        <TabsTrigger value="signature">Signature</TabsTrigger>
      </TabsList>
      
      <TabsContent value="client">
        <ClientProfileTabContent 
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
          onMaritalStatusChange={handleMaritalStatusChange}
        />
      </TabsContent>
      
      <TabsContent value="income">
        <IncomeTabContent 
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
      
      <TabsContent value="expenses">
        <ExpensesTabContent 
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
      
      <TabsContent value="savings">
        <SavingsTabContent 
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
      
      <TabsContent value="signature">
        <SignatureTabContent 
          formData={formData}
          previousMonthData={previousMonthData}
          historicalData={historicalData}
          onChange={onChange}
          onFrequencyChange={onFrequencyChange}
          onSaveDraft={handleSaveDraft}
          setActiveTab={setActiveTab}
          handleDocumentSubmit={handleDocumentSubmit}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
          onConsentChange={handleConsentChange}
        />
      </TabsContent>
    </Tabs>
  );
};
