
import { useEffect } from "react";
import { Client } from "../types";
import { initialFormData } from "./initialState";
import { useFormDataHandling } from "./useFormDataHandling";
import { usePeriodDataManagement } from "./usePeriodDataManagement";
import { useHistoricalDataManagement } from "./useHistoricalDataManagement";
import { useIncomeExpenseSubmission } from "./useIncomeExpenseSubmission";
import { useClientDataLoading } from "./useClientDataLoading";

export const useIncomeExpenseForm = (selectedClient: Client | null) => {
  // Form data handling
  const {
    formData,
    setFormData,
    currentRecordId,
    setCurrentRecordId,
    handleChange,
    handleFieldSelectChange,
    handleFrequencyChange
  } = useFormDataHandling();

  // Period management
  const {
    selectedPeriod,
    periodsData,
    setPeriodsData,
    handlePeriodChange: basePeriodChange
  } = usePeriodDataManagement();

  // Historical data management
  const {
    historicalData,
    setHistoricalData,
    previousMonthData,
    setPreviousMonthData,
    updateHistoricalData
  } = useHistoricalDataManagement();

  // Client data loading
  const { isDataLoading } = useClientDataLoading(
    selectedClient, 
    setFormData, 
    setCurrentRecordId, 
    setPreviousMonthData, 
    setHistoricalData, 
    setPeriodsData,
    selectedPeriod
  );

  // Form submission
  const { isSubmitting, handleSubmit } = useIncomeExpenseSubmission({
    formData,
    selectedClient,
    selectedPeriod,
    currentRecordId,
    updateHistoricalData,
    setPeriodsData
  });

  // Wrapper for period change to include current form data
  const handlePeriodChange = (period: 'current' | 'previous') => {
    basePeriodChange(period, formData);
    
    // Set timeout to ensure state update has completed
    setTimeout(() => {
      // Load the data for the new period
      setFormData(periodsData[period]);
      setCurrentRecordId(periodsData[period].id || null);
    }, 10);
  };

  // Effect to update form data when period data changes
  useEffect(() => {
    if (selectedPeriod && periodsData[selectedPeriod]) {
      setFormData(periodsData[selectedPeriod]);
    }
  }, [selectedPeriod, periodsData, setFormData]);

  return {
    formData,
    isSubmitting,
    currentRecordId,
    historicalData,
    previousMonthData, // Make sure we're returning this property
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleFieldSelectChange,
    handleSubmit,
    handlePeriodChange,
  };
};
