
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IncomeExpenseData, Client } from "../types";
import { UseIncomeExpenseFormReturn, PeriodType } from "./types";
import { initialFormData, initialHistoricalData } from "./initialState";
import { 
  fetchPreviousMonthData, 
  submitFinancialRecord,
  fetchHistoricalData,
  fetchLatestExcelData 
} from "./financialDataService";
import { toast as sonnerToast } from "sonner";

export const useIncomeExpenseForm = (): UseIncomeExpenseFormReturn => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [previousMonthData, setPreviousMonthData] = useState<IncomeExpenseData | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<IncomeExpenseData | null>(null);
  const [formData, setFormData] = useState<IncomeExpenseData>(initialFormData);
  const [historicalData, setHistoricalData] = useState(initialHistoricalData);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('current');
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFrequencyChange = (type: 'income' | 'expense') => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}_frequency`]: value,
    }));
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    
    // When switching periods, load the appropriate data into the form
    if (period === 'previous' && previousMonthData) {
      setFormData(previousMonthData);
      sonnerToast.info("Previous Month Data Loaded", {
        description: "The form has been updated with data from the previous month",
        duration: 3000
      });
    } else if (period === 'current' && currentMonthData) {
      setFormData(currentMonthData);
      sonnerToast.info("Current Month Data Loaded", {
        description: "The form has been updated with data for the current month",
        duration: 3000
      });
    } else if (period === 'current' && !currentMonthData && selectedClient) {
      // If we don't have current month data, but we have a client selected,
      // try to load Excel data as current month data
      fetchLatestExcelData(selectedClient.id)
        .then(data => {
          if (data) {
            setFormData(data);
            setCurrentMonthData(data);
            sonnerToast.success("Excel Data Loaded for Current Month", {
              description: "The form has been updated with the latest Excel data",
              duration: 3000
            });
          }
        })
        .catch(error => {
          console.error("Error loading Excel data:", error);
        });
    }
  };

  const handleClientSelect = async (clientId: string) => {
    setIsDataLoading(true);
    try {
      // Define client
      const client = {
        id: clientId,
        name: clientId === "1" ? "John Doe" : "Reginald Dickerson",
        status: "active" as const,
        last_activity: "2024-03-10",
      };
      setSelectedClient(client);
      
      // First, check for Excel data from uploaded files for this client
      const excelData = await fetchLatestExcelData(clientId);
      
      if (excelData) {
        console.log("Found Excel data for client", client.name, excelData);
        setFormData(excelData);
        setCurrentMonthData(excelData);
        
        // Show a toast notification to inform the user that data has been loaded from Excel
        sonnerToast.success("Excel Data Loaded", {
          description: `Financial data loaded from the uploaded Excel file for ${client.name}`,
          duration: 5000,
        });
        
        // Also fetch previous month data for comparison
        const previousData = await fetchPreviousMonthData(clientId);
        setPreviousMonthData(previousData);
      } else {
        // If no Excel data, fallback to previous month data
        console.log("No Excel data found, loading previous month data");
        const previousData = await fetchPreviousMonthData(clientId);
        setPreviousMonthData(previousData);
        
        // If we have previous month data, make a modified copy for current month
        if (previousData) {
          // Create a modified version of previous month data with slight adjustments
          const currentData = {...previousData};
          // Adjust some values for current month (for demo purposes)
          const adjustFields = ['monthly_income', 'rent_mortgage', 'utilities', 'food'];
          adjustFields.forEach(field => {
            const value = parseFloat(previousData[field as keyof IncomeExpenseData] as string) || 0;
            // Add or subtract a small percentage to create some variation
            const adjustment = value * (Math.random() * 0.1 - 0.05); // +/- 5%
            currentData[field as keyof IncomeExpenseData] = (value + adjustment).toFixed(2) as any;
          });
          setCurrentMonthData(currentData);
          
          // Set form data to whichever period is selected
          if (selectedPeriod === 'current') {
            setFormData(currentData);
          } else {
            setFormData(previousData);
          }
        }
      }
      
      // Load historical data regardless of source
      const historicalDataResult = await fetchHistoricalData(clientId);
      if (historicalDataResult) {
        setHistoricalData(historicalDataResult);
      }
    } catch (error) {
      console.error("Error loading client data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load client financial data",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!selectedClient) return;
      const data = await fetchHistoricalData(selectedClient.id);
      if (data) {
        setHistoricalData(data);
      }
    };

    loadHistoricalData();
  }, [selectedClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a client before submitting",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate submission date based on selected period
      const submissionDate = new Date();
      if (selectedPeriod === 'previous') {
        submissionDate.setMonth(submissionDate.getMonth() - 1);
      }

      // Calculate total income and expenses for better analytics
      const monthlyIncome = parseFloat(formData.monthly_income || "0");
      
      const expenses = [
        "rent_mortgage", "utilities", "food", "transportation", 
        "insurance", "medical_expenses", "other_expenses"
      ].reduce((total, field) => {
        return total + (parseFloat(formData[field as keyof IncomeExpenseData] as string) || 0);
      }, 0);

      const surplusIncome = monthlyIncome - expenses;

      const financialRecord = {
        user_id: selectedClient.id,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
        employment_income: formData.employment_income ? parseFloat(formData.employment_income) : null,
        other_income: formData.other_income ? parseFloat(formData.other_income) : null,
        rent_mortgage: formData.rent_mortgage ? parseFloat(formData.rent_mortgage) : null,
        utilities: formData.utilities ? parseFloat(formData.utilities) : null,
        food: formData.food ? parseFloat(formData.food) : null,
        transportation: formData.transportation ? parseFloat(formData.transportation) : null,
        insurance: formData.insurance ? parseFloat(formData.insurance) : null,
        medical_expenses: formData.medical_expenses ? parseFloat(formData.medical_expenses) : null,
        other_expenses: formData.other_expenses ? parseFloat(formData.other_expenses) : null,
        notes: formData.notes,
        submission_date: submissionDate.toISOString(),
        status: "pending_review",
        period_type: selectedPeriod,
        // Add calculated totals
        total_income: monthlyIncome,
        total_expenses: expenses,
        surplus_income: surplusIncome
      };

      const { data, error } = await submitFinancialRecord(financialRecord);

      if (error) throw error;

      if (data) {
        setCurrentRecordId(data.id);
      }

      toast({
        title: "Success",
        description: `Financial data submitted successfully for ${selectedPeriod} month`,
      });

      // Update the stored data for the period that was just submitted
      if (selectedPeriod === 'current') {
        setCurrentMonthData(formData);
      } else {
        setPreviousMonthData(formData);
      }
      
      // Clear form after submission
      setFormData(initialFormData);
      setSelectedClient(null);
      setSelectedPeriod('current');
      
      // Refresh historical data for the client after submission
      const updatedHistoricalData = await fetchHistoricalData(selectedClient.id);
      if (updatedHistoricalData) {
        setHistoricalData(updatedHistoricalData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit financial data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    selectedClient,
    currentRecordId,
    historicalData,
    previousMonthData,
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleClientSelect,
    handleSubmit,
    handlePeriodChange,
  };
};
