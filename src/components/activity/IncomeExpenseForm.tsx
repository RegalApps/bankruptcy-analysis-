
import { Button } from "@/components/ui/button";
import { IncomeSection } from "./form/IncomeSection";
import { ExpensesSection } from "./form/ExpensesSection";
import { ClientSelector } from "./form/ClientSelector";
import { HistoricalComparison } from "./components/HistoricalComparison";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { useIncomeExpenseForm } from "./hooks/useIncomeExpenseForm";

export const IncomeExpenseForm = () => {
  const {
    formData,
    isSubmitting,
    selectedClient,
    currentRecordId,
    historicalData,
    handleChange,
    handleFrequencyChange,
    handleClientSelect,
    handleSubmit,
  } = useIncomeExpenseForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientSelector 
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
      />
      
      {selectedClient && (
        <HistoricalComparison
          currentPeriod={historicalData.currentPeriod}
          previousPeriod={historicalData.previousPeriod}
        />
      )}
      
      <IncomeSection 
        formData={formData} 
        onChange={handleChange}
        onFrequencyChange={handleFrequencyChange('income')}
      />
      
      <ExpensesSection 
        formData={formData} 
        onChange={handleChange}
        onFrequencyChange={handleFrequencyChange('expense')}
      />
      
      <DocumentUploadSection financialRecordId={currentRecordId} />
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Financial Data"}
      </Button>
    </form>
  );
};
