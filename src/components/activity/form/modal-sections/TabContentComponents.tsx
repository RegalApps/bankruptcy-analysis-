
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
import { IncomeExpenseData } from "../../types";

interface TabContentProps {
  formData: IncomeExpenseData;
  previousMonthData: any;
  historicalData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (type: 'income' | 'expense') => (value: string) => void;
  onSaveDraft: () => void;
  setActiveTab: (tab: string) => void;
  handleDocumentSubmit: (e: React.FormEvent) => void;
  selectedClient: { id: string; name: string } | null;
  isSubmitting: boolean;
  onMaritalStatusChange?: (value: string) => void;
  onConsentChange?: (checked: boolean) => void;
}

export const ClientProfileTabContent = ({ 
  formData, 
  historicalData, 
  onChange, 
  onSaveDraft, 
  setActiveTab,
  onMaritalStatusChange 
}: TabContentProps) => (
  <div className="space-y-6">
    <HistoricalComparison
      currentPeriod={historicalData.currentPeriod}
      previousPeriod={historicalData.previousPeriod}
    />
    
    <ClientProfileSection 
      formData={formData} 
      onChange={onChange}
      onMaritalStatusChange={onMaritalStatusChange || (() => {})}
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
);

export const IncomeTabContent = ({ 
  formData, 
  previousMonthData, 
  onChange, 
  onFrequencyChange, 
  onSaveDraft, 
  setActiveTab 
}: TabContentProps) => (
  <div className="space-y-6">
    <EnhancedIncomeSection 
      formData={formData} 
      previousMonthData={previousMonthData}
      onChange={onChange}
      onFrequencyChange={onFrequencyChange('income')}
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
);

export const ExpensesTabContent = ({ 
  formData, 
  previousMonthData, 
  onChange, 
  onSaveDraft, 
  setActiveTab 
}: TabContentProps) => (
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
);

export const SavingsTabContent = ({ 
  formData, 
  previousMonthData, 
  onChange, 
  onSaveDraft, 
  setActiveTab 
}: TabContentProps) => (
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
);

export const SignatureTabContent = ({ 
  formData, 
  onChange, 
  onSaveDraft, 
  setActiveTab, 
  handleDocumentSubmit,
  selectedClient,
  isSubmitting,
  onConsentChange
}: TabContentProps) => (
  <div className="space-y-6">
    <SignatureConsentSection
      formData={formData}
      onChange={onChange}
      onConsentChange={onConsentChange || (() => {})}
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
);
