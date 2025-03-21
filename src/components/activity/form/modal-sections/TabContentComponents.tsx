
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ClientProfileSection } from "../ClientProfileSection";
import { EnhancedIncomeSection } from "../EnhancedIncomeSection";
import { EssentialExpensesSection } from "../EssentialExpensesSection";
import { DiscretionaryExpensesSection } from "../DiscretionaryExpensesSection";
import { SavingsInsuranceSection } from "../SavingsInsuranceSection";
import { SignatureConsentSection } from "../SignatureConsentSection";
import { PrintButton } from "../PrintButton";
import { SmartCreateDocumentButton } from "../SmartCreateDocumentButton";
import { HistoricalComparison } from "../../components/HistoricalComparison";
import { IncomeExpenseData, Client } from "../../types";
import { ClientSelectionSection as ClientSelectionSectionComponent } from "../ClientSelectionSection";

// Export ClientSelectionSection for use in FormTabs
export const ClientSelectionSection = ClientSelectionSectionComponent;

// Create the TabContentComponents object with all components
export const TabContentComponents = {
  ClientProfileTabContent: ({ 
    formData, 
    onChange, 
    onSaveDraft, 
    setActiveTab 
  }: any) => (
    <div className="space-y-6">
      <ClientProfileSection 
        formData={formData} 
        onChange={onChange}
        onMaritalStatusChange={() => {}}
      />
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" /> Save Draft
        </Button>
        <Button type="button" onClick={() => setActiveTab("income")}>
          Next: Income Details
        </Button>
      </div>
    </div>
  ),

  IncomeTabContent: ({ 
    formData, 
    previousMonthData, 
    onChange, 
    onFrequencyChange, 
    onSaveDraft, 
    setActiveTab 
  }: any) => (
    <div className="space-y-6">
      <EnhancedIncomeSection 
        formData={formData} 
        previousMonthData={previousMonthData}
        onChange={onChange}
        onFrequencyChange={onFrequencyChange}
      />
      
      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={() => setActiveTab("client")}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button type="button" onClick={() => setActiveTab("expenses")}>
            Next: Expenses
          </Button>
        </div>
      </div>
    </div>
  ),

  ExpensesTabContent: ({ 
    formData, 
    previousMonthData, 
    onChange, 
    onSaveDraft, 
    setActiveTab 
  }: any) => (
    <div className="space-y-6">
      <EssentialExpensesSection 
        formData={formData} 
        previousMonthData={previousMonthData}
        onChange={onChange}
      />
      
      <DiscretionaryExpensesSection 
        formData={formData} 
        previousMonthData={previousMonthData}
        onChange={onChange}
      />
      
      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={() => setActiveTab("income")}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button type="button" onClick={() => setActiveTab("savings")}>
            Next: Savings & Insurance
          </Button>
        </div>
      </div>
    </div>
  ),

  SavingsTabContent: ({ 
    formData, 
    previousMonthData, 
    onChange, 
    onSaveDraft, 
    setActiveTab 
  }: any) => (
    <div className="space-y-6">
      <SavingsInsuranceSection 
        formData={formData} 
        previousMonthData={previousMonthData}
        onChange={onChange}
      />
      
      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={() => setActiveTab("expenses")}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button type="button" onClick={() => setActiveTab("signature")}>
            Next: Signature & Consent
          </Button>
        </div>
      </div>
    </div>
  ),

  SignatureTabContent: ({ 
    formData, 
    onChange,
    onConsentChange, 
    onSaveDraft, 
    setActiveTab, 
    handleDocumentSubmit,
    selectedClient,
    isSubmitting
  }: any) => (
    <div className="space-y-6">
      <SignatureConsentSection
        formData={formData}
        onChange={onChange}
        onConsentChange={onConsentChange}
      />
      
      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={() => setActiveTab("savings")}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <PrintButton formData={formData} />
          <SmartCreateDocumentButton 
            formData={formData}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
            onSubmit={handleDocumentSubmit}
          />
        </div>
      </div>
    </div>
  )
};
