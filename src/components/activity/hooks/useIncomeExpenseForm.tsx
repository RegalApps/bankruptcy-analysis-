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
          monthly_income: "5800",
          primary_salary: "5500",
          overtime_bonuses: "300",
          freelance_income: "200",
          investment_income: "100",
          rental_income: "200",
          rent_mortgage: "1500",
          utilities: "350",
          food: "800",
          transportation: "400",
          insurance: "300",
          medical_expenses: "200",
          other_expenses: "250",
          id: `current-${Date.now()}`
        };

        const previousPeriodData = {
          ...initialFormData,
          monthly_income: "5700",
          primary_salary: "5400",
          overtime_bonuses: "300",
          freelance_income: "180",
          investment_income: "90",
          rental_income: "230",
          rent_mortgage: "1500",
          utilities: "340",
          food: "780",
          transportation: "380",
          insurance: "300",
          medical_expenses: "150",
          other_expenses: "250",
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
            totalIncome: 5800,
            totalExpenses: 3800,
            surplusIncome: 2000
          },
          previousPeriod: {
            totalIncome: 5700,
            totalExpenses: 3700,
            surplusIncome: 2000
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
    
    // Only allow numbers for numeric fields
    if (name !== 'notes' && isNaN(Number(value)) && value !== '') {
      return;
    }
    
    // Special case for primary_salary and overtime_bonuses - update monthly_income
    if (name === 'primary_salary' || name === 'overtime_bonuses') {
      setFormData(prev => {
        const primarySalary = name === 'primary_salary' ? Number(value) || 0 : Number(prev.primary_salary) || 0;
        const overtimeBonuses = name === 'overtime_bonuses' ? Number(value) || 0 : Number(prev.overtime_bonuses) || 0;
        const monthlyIncome = primarySalary + overtimeBonuses;
        
        return {
          ...prev,
          [name]: value,
          monthly_income: String(monthlyIncome)
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Update the periods data to keep track of changes
    setPeriodsData(prev => ({
      ...prev,
      [selectedPeriod]: {
        ...prev[selectedPeriod],
        [name]: value
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
      const monthlyIncome = Number(formData.monthly_income) || 0;
      const primarySalary = Number(formData.primary_salary) || 0;
      const overtimeBonuses = Number(formData.overtime_bonuses) || 0;
      const freelanceIncome = Number(formData.freelance_income) || 0;
      const investmentIncome = Number(formData.investment_income) || 0;
      const rentalIncome = Number(formData.rental_income) || 0;
      
      const rentMortgage = Number(formData.rent_mortgage) || 0;
      const utilities = Number(formData.utilities) || 0;
      const food = Number(formData.food) || 0;
      const transportation = Number(formData.transportation) || 0;
      const insurance = Number(formData.insurance) || 0;
      const medicalExpenses = Number(formData.medical_expenses) || 0;
      const otherExpenses = Number(formData.other_expenses) || 0;
      
      const totalIncome = monthlyIncome;
      const totalExpenses = rentMortgage + utilities + food + transportation + insurance + medicalExpenses + otherExpenses;
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
    handleSubmit,
    handlePeriodChange,
  };
};
