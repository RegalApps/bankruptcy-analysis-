
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
      
      // Reset form data first to avoid old data displayed for a moment
      setFormData(initialFormData);
      
      // First, check for Excel data from uploaded files for this client
      const excelData = await fetchLatestExcelData(clientId);
      
      if (excelData) {
        console.log("Found Excel data for client", client.name, excelData);
        
        // Ensure all required form fields are populated from Excel data
        const completeExcelData: IncomeExpenseData = {
          ...initialFormData, // Start with all fields initialized
          ...excelData, // Apply Excel data
          // Ensure frequencies are set if missing
          income_frequency: excelData.income_frequency || 'monthly',
          expense_frequency: excelData.expense_frequency || 'monthly',
        };
        
        setFormData(completeExcelData);
        setCurrentMonthData(completeExcelData);
        
        // Show a toast notification to inform the user that data has been loaded from Excel
        sonnerToast.success("Excel Data Loaded", {
          description: `Financial data loaded from the uploaded Excel file for ${client.name}`,
          duration: 5000,
        });
        
        // Also fetch previous month data for comparison
        const previousData = await fetchPreviousMonthData(clientId);
        
        if (previousData) {
          // Ensure previous month data has all needed fields as well
          const completePreviousData: IncomeExpenseData = {
            ...initialFormData,
            ...previousData,
            income_frequency: previousData.income_frequency || 'monthly',
            expense_frequency: previousData.expense_frequency || 'monthly',
          };
          
          setPreviousMonthData(completePreviousData);
        } else {
          // Create simulated previous month data with slight differences
          const simulatedPrevious = { ...completeExcelData };
          
          // Adjust values to simulate previous month (slightly lower values)
          Object.keys(simulatedPrevious).forEach(key => {
            const field = key as keyof IncomeExpenseData;
            const valueStr = simulatedPrevious[field] as string;
            
            if (typeof valueStr === 'string' && !isNaN(Number(valueStr))) {
              const value = parseFloat(valueStr);
              // Reduce value by 2-5% for previous month
              const adjustment = value * (0.02 + Math.random() * 0.03);
              simulatedPrevious[field] = (value - adjustment).toFixed(2) as any;
            }
          });
          
          // Add a note about simulation
          simulatedPrevious.notes = "Simulated previous month data based on current Excel data";
          
          setPreviousMonthData(simulatedPrevious);
        }
      } else {
        // If no Excel data, fallback to previous month data
        console.log("No Excel data found, loading previous month data");
        const previousData = await fetchPreviousMonthData(clientId);
        
        if (previousData) {
          // Ensure previous month data has all needed fields
          const completePreviousData: IncomeExpenseData = {
            ...initialFormData,
            ...previousData,
            income_frequency: previousData.income_frequency || 'monthly',
            expense_frequency: previousData.expense_frequency || 'monthly',
          };
          
          setPreviousMonthData(completePreviousData);
          
          // If we have previous month data, make a modified copy for current month
          // Create a modified version of previous month data with slight adjustments
          const currentData = {...completePreviousData};
          
          // Adjust some values for current month (for demo purposes)
          Object.keys(currentData).forEach(key => {
            const field = key as keyof IncomeExpenseData;
            const valueStr = currentData[field] as string;
            
            if (typeof valueStr === 'string' && !isNaN(Number(valueStr))) {
              const value = parseFloat(valueStr);
              // Add 2-8% for current month
              const adjustment = value * (0.02 + Math.random() * 0.06);
              currentData[field] = (value + adjustment).toFixed(2) as any;
            }
          });
          
          currentData.notes = "Estimated data based on previous month trends";
          
          setCurrentMonthData(currentData);
          
          // Set form data to whichever period is selected
          if (selectedPeriod === 'current') {
            setFormData(currentData);
          } else {
            setFormData(completePreviousData);
          }
        } else {
          // If no previous data either, create default data for the selected client
          const defaultData = generateDefaultClientData(clientId);
          setFormData(defaultData);
          setCurrentMonthData(defaultData);
          
          // Create slightly different data for previous month
          const defaultPreviousData = { ...defaultData };
          
          // Reduce values by 3-6% for previous month
          Object.keys(defaultPreviousData).forEach(key => {
            const field = key as keyof IncomeExpenseData;
            const valueStr = defaultPreviousData[field] as string;
            
            if (typeof valueStr === 'string' && !isNaN(Number(valueStr))) {
              const value = parseFloat(valueStr);
              const adjustment = value * (0.03 + Math.random() * 0.03);
              defaultPreviousData[field] = (value - adjustment).toFixed(2) as any;
            }
          });
          
          defaultPreviousData.notes = "Default data for previous month";
          setPreviousMonthData(defaultPreviousData);
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

  // Helper function to generate default data based on client ID
  const generateDefaultClientData = (clientId: string): IncomeExpenseData => {
    if (clientId === "2") { // Reginald Dickerson
      return {
        monthly_income: "5800.00",
        employment_income: "4500.00",
        primary_salary: "4500.00",
        overtime_bonuses: "300.00",
        other_income: "1000.00",
        freelance_income: "500.00",
        investment_income: "300.00",
        rental_income: "200.00",
        income_frequency: "monthly",
        rent_mortgage: "1600.00",
        utilities: "380.00",
        electricity: "150.00",
        gas: "80.00",
        water: "70.00",
        internet: "80.00",
        food: "750.00",
        groceries: "500.00",
        dining_out: "250.00",
        transportation: "420.00",
        fuel: "300.00",
        vehicle_maintenance: "120.00",
        insurance: "280.00",
        medical_expenses: "150.00",
        other_expenses: "200.00",
        expense_frequency: "monthly",
        notes: "Default financial data for Reginald Dickerson"
      };
    } else { // Default for John Doe or others
      return {
        monthly_income: "4200.00",
        employment_income: "3700.00",
        primary_salary: "3500.00",
        overtime_bonuses: "200.00",
        other_income: "500.00",
        freelance_income: "300.00",
        investment_income: "100.00",
        rental_income: "100.00",
        income_frequency: "monthly",
        rent_mortgage: "1200.00",
        utilities: "250.00",
        electricity: "100.00",
        gas: "50.00",
        water: "50.00",
        internet: "50.00",
        food: "600.00",
        groceries: "400.00",
        dining_out: "200.00",
        transportation: "300.00",
        fuel: "200.00",
        vehicle_maintenance: "100.00",
        insurance: "200.00",
        medical_expenses: "100.00",
        other_expenses: "150.00",
        expense_frequency: "monthly",
        notes: "Default financial data"
      };
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
