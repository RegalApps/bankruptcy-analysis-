import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData } from "./initialState";
import { IncomeExpenseData, Client } from "../types";

export const useIncomeExpenseForm = (selectedClient: Client | null) => {
  const [formData, setFormData] = useState<IncomeExpenseData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [previousMonthData, setPreviousMonthData] = useState<any>(null);
  
  // Initialize historical comparison data
  const [historicalData, setHistoricalData] = useState({
    currentPeriod: {
      totalIncome: 0,
      totalExpenses: 0,
      surplusIncome: 0
    },
    previousPeriod: {
      totalIncome: 0,
      totalExpenses: 0,
      surplusIncome: 0
    }
  });

  // Keep track of both periods' data
  const [periodsData, setPeriodsData] = useState<{
    current: IncomeExpenseData & { id?: string };
    previous: IncomeExpenseData & { id?: string };
  }>({
    current: initialFormData,
    previous: initialFormData
  });

  // Load existing data when client changes
  useEffect(() => {
    const loadClientData = async () => {
      if (!selectedClient) return;
      
      setIsDataLoading(true);
      
      try {
        console.log("Loading financial data for client:", selectedClient.id);
        
        // Generate sample data for both periods
        const currentPeriodData = {
          ...initialFormData,
          full_name: selectedClient.name,
          
          // Monthly Income
          employment_income: "3800",
          pension_annuities: "800",
          government_benefits: "500",
          rental_income: "700",
          spouse_employment_income: "3200",
          total_monthly_income: "5800",
          spouse_total_monthly_income: "3200",
          
          // Essential Expenses
          mortgage_rent: "1500",
          utilities: "350",
          groceries: "600",
          child_care: "400",
          transportation: "300",
          debt_repayments: "450",
          total_essential_expenses: "3600",
          
          // Discretionary Expenses
          dining_out: "200",
          entertainment: "150",
          subscriptions: "50",
          clothing: "100",
          total_discretionary_expenses: "500",
          
          // Savings
          emergency_savings: "300",
          retirement_savings: "400",
          total_savings: "700",
          
          // Insurance
          vehicle_insurance: "120",
          home_insurance: "90",
          life_insurance: "60",
          total_insurance: "270",
          
          id: `current-${Date.now()}`
        };

        const previousPeriodData = {
          ...initialFormData,
          full_name: selectedClient.name,
          
          // Monthly Income
          employment_income: "3700",
          pension_annuities: "800",
          government_benefits: "500",
          rental_income: "700",
          spouse_employment_income: "3100",
          total_monthly_income: "5700",
          spouse_total_monthly_income: "3100",
          
          // Essential Expenses
          mortgage_rent: "1500",
          utilities: "340",
          groceries: "580",
          child_care: "400",
          transportation: "280",
          debt_repayments: "450",
          total_essential_expenses: "3550",
          
          // Discretionary Expenses
          dining_out: "180",
          entertainment: "150",
          subscriptions: "50",
          clothing: "90",
          total_discretionary_expenses: "470",
          
          // Savings
          emergency_savings: "300",
          retirement_savings: "400",
          total_savings: "700",
          
          // Insurance
          vehicle_insurance: "120",
          home_insurance: "90",
          life_insurance: "60",
          total_insurance: "270",
          
          id: `previous-${Date.now()}`
        };
        
        // Store periods data
        setPeriodsData({
          current: currentPeriodData,
          previous: previousPeriodData
        });
        
        // Set the current form data based on selected period
        if (selectedPeriod === 'current') {
          setFormData(currentPeriodData);
          setCurrentRecordId(currentPeriodData.id || null);
        } else {
          setFormData(previousPeriodData);
          setCurrentRecordId(previousPeriodData.id || null);
        }
        
        // Set previous month data for reference
        setPreviousMonthData(previousPeriodData);
        
        // Set historical data
        setHistoricalData({
          currentPeriod: {
            totalIncome: 9000,
            totalExpenses: 5070,
            surplusIncome: 3930
          },
          previousPeriod: {
            totalIncome: 8800,
            totalExpenses: 4990,
            surplusIncome: 3810
          }
        });
        
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadClientData();
  }, [selectedClient]);
  
  // Handle form input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for numeric fields that aren't text inputs
    if (
      !name.includes('description') && 
      name !== 'notes' && 
      name !== 'full_name' && 
      name !== 'residential_address' && 
      name !== 'phone_home' && 
      name !== 'occupation' && 
      name !== 'employer_name' && 
      name !== 'work_phone' && 
      name !== 'spouse_name' && 
      name !== 'submission_date' && 
      isNaN(Number(value)) && 
      value !== ''
    ) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update the periods data to keep track of changes
    setPeriodsData(prev => ({
      ...prev,
      [selectedPeriod]: {
        ...prev[selectedPeriod],
        [name]: value
      }
    }));
  }, [selectedPeriod]);
  
  // Handle select field changes (for dropdowns)
  const handleFieldSelectChange = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Update the periods data
    setPeriodsData(prev => ({
      ...prev,
      [selectedPeriod]: {
        ...prev[selectedPeriod],
        [fieldName]: value
      }
    }));
  }, [selectedPeriod]);
  
  // Handle frequency selection changes
  const handleFrequencyChange = useCallback((type: 'income' | 'expense') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_frequency`]: value as any
    }));
    
    // Update the periods data
    setPeriodsData(prev => ({
      ...prev,
      [selectedPeriod]: {
        ...prev[selectedPeriod],
        [`${type}_frequency`]: value as any
      }
    }));
  }, [selectedPeriod]);
  
  // Handle period selection change
  const handlePeriodChange = useCallback((period: 'current' | 'previous') => {
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
    
    // Set timeout to ensure state update has completed
    setTimeout(() => {
      // Load the data for the new period
      setFormData(prev => {
        console.log(`Loading ${period} period data:`, periodsData[period]);
        return periodsData[period];
      });
      setCurrentRecordId(periodsData[period].id || null);
    }, 10);
    
    console.log(`Switched to ${period} period data:`, periodsData[period]);
  }, [selectedPeriod, formData, periodsData]);
  
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
      setHistoricalData(prev => ({
        ...prev,
        [selectedPeriod === 'current' ? 'currentPeriod' : 'previousPeriod']: {
          totalIncome,
          totalExpenses,
          surplusIncome
        }
      }));
      
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
  }, [formData, selectedClient, selectedPeriod, currentRecordId]);
  
  return {
    formData,
    isSubmitting,
    currentRecordId,
    historicalData,
    previousMonthData,
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleFieldSelectChange,
    handleSubmit,
    handlePeriodChange,
  };
};
