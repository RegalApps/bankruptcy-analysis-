import { useState, useCallback } from "react";
import { IncomeExpenseData } from "../types";
import { initialFormData } from "./initialState";

export const usePeriodDataManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');
  
  // Keep track of both periods' data
  const [periodsData, setPeriodsData] = useState<{
    current: IncomeExpenseData & { id?: string };
    previous: IncomeExpenseData & { id?: string };
  }>({
    current: initialFormData,
    previous: initialFormData
  });

  // Handle period selection change
  const handlePeriodChange = useCallback((period: 'current' | 'previous', formData: IncomeExpenseData) => {
    // Save current form data to the periods data
    setPeriodsData(prev => {
      const updated = {
        ...prev,
        [selectedPeriod]: {
          ...prev[selectedPeriod],
          ...formData
        }
      };
      
      console.log("Updated periods data:", updated);
      return updated;
    });
    
    // Switch to the new period
    setSelectedPeriod(period);
  }, [selectedPeriod]);

  return {
    selectedPeriod,
    periodsData,
    setPeriodsData,
    handlePeriodChange
  };
};
