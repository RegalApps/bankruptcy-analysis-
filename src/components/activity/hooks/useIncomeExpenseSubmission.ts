
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { IncomeExpenseData } from "../types";
import { Client } from "../types";

interface UseIncomeExpenseSubmissionProps {
  formData: IncomeExpenseData;
  selectedClient: Client | null;
  selectedPeriod: 'current' | 'previous';
  currentRecordId: string | null;
  updateHistoricalData: (
    period: 'currentPeriod' | 'previousPeriod',
    totalIncome: number,
    totalExpenses: number,
    surplusIncome: number
  ) => void;
  setPeriodsData: React.Dispatch<React.SetStateAction<{
    current: IncomeExpenseData & { id?: string };
    previous: IncomeExpenseData & { id?: string };
  }>>;
}

export const useIncomeExpenseSubmission = ({
  formData,
  selectedClient,
  selectedPeriod,
  currentRecordId,
  updateHistoricalData,
  setPeriodsData
}: UseIncomeExpenseSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast.error('Please select a client first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate totals
      const totalMonthlyIncome = parseFloat(formData.total_monthly_income || '0');
      const spouseTotalMonthlyIncome = parseFloat(formData.spouse_total_monthly_income || '0');
      const totalEssentialExpenses = parseFloat(formData.total_essential_expenses || '0');
      const totalDiscretionaryExpenses = parseFloat(formData.total_discretionary_expenses || '0');
      const totalSavings = parseFloat(formData.total_savings || '0');
      const totalInsurance = parseFloat(formData.total_insurance || '0');
      
      const totalIncome = totalMonthlyIncome + spouseTotalMonthlyIncome;
      const totalExpenses = totalEssentialExpenses + totalDiscretionaryExpenses + totalSavings + totalInsurance;
      const surplusIncome = totalIncome - totalExpenses;
      
      // Update historical data
      updateHistoricalData(
        selectedPeriod === 'current' ? 'currentPeriod' : 'previousPeriod',
        totalIncome,
        totalExpenses,
        surplusIncome
      );
      
      toast.success(`Financial data ${currentRecordId ? 'updated' : 'saved'} successfully (simulated)`);
      
      // Update periods data
      setPeriodsData(prev => ({
        ...prev,
        [selectedPeriod]: {
          ...prev[selectedPeriod],
          ...formData
        }
      }));
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save financial data');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedClient, selectedPeriod, currentRecordId, updateHistoricalData, setPeriodsData]);
  
  return {
    isSubmitting,
    handleSubmit
  };
};
