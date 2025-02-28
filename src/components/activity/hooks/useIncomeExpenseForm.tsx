
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

  // Load existing data when client changes
  useEffect(() => {
    const loadClientData = async () => {
      if (!selectedClient) return;
      
      setIsDataLoading(true);
      
      try {
        console.log("Loading financial data for client:", selectedClient.id);
        
        // Load existing data for the current period
        const { data: currentData, error: currentError } = await supabase
          .from('financial_records')
          .select('*')
          .eq('user_id', selectedClient.id)
          .eq('period_type', 'current')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (currentError) {
          console.error("Error loading client data:", currentError);
          throw currentError;
        }
        
        console.log("Current period data:", currentData);
        
        // Load data for the previous period
        const { data: previousData, error: previousError } = await supabase
          .from('financial_records')
          .select('*')
          .eq('user_id', selectedClient.id)
          .eq('period_type', 'previous')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (previousError) {
          console.error("Error loading previous period data:", previousError);
          throw previousError;
        }
        
        console.log("Previous period data:", previousData);
        
        // Update form state if we have current period data
        if (currentData && currentData.length > 0) {
          const record = currentData[0];
          setCurrentRecordId(record.id);
          
          const newFormData = {
            ...initialFormData,
            monthly_income: String(record.monthly_income || ''),
            employment_income: String(record.employment_income || ''),
            other_income: String(record.other_income || ''),
            rent_mortgage: String(record.rent_mortgage || ''),
            utilities: String(record.utilities || ''),
            food: String(record.food || ''),
            transportation: String(record.transportation || ''),
            insurance: String(record.insurance || ''),
            medical_expenses: String(record.medical_expenses || ''),
            other_expenses: String(record.other_expenses || ''),
            notes: record.notes || ''
          };
          
          setFormData(newFormData);
        } else {
          // Reset form if no data
          setFormData(initialFormData);
          setCurrentRecordId(null);
        }
        
        // Set historical comparison data
        const historicalCurrent = currentData && currentData.length > 0 ? {
          totalIncome: currentData[0].total_income || currentData[0].monthly_income || 0,
          totalExpenses: currentData[0].total_expenses || 0,
          surplusIncome: currentData[0].surplus_income || 0
        } : {
          totalIncome: 0,
          totalExpenses: 0,
          surplusIncome: 0
        };
        
        const historicalPrevious = previousData && previousData.length > 0 ? {
          totalIncome: previousData[0].total_income || previousData[0].monthly_income || 0,
          totalExpenses: previousData[0].total_expenses || 0,
          surplusIncome: previousData[0].surplus_income || 0
        } : {
          totalIncome: 0,
          totalExpenses: 0,
          surplusIncome: 0
        };
        
        setHistoricalData({
          currentPeriod: historicalCurrent,
          previousPeriod: historicalPrevious
        });
        
        // Store previous month data for reference
        if (previousData && previousData.length > 0) {
          setPreviousMonthData(previousData[0]);
        } else {
          setPreviousMonthData(null);
        }
        
      } catch (error) {
        console.error('Error loading client data:', error);
        toast.error('Failed to load client data');
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadClientData();
  }, [selectedClient, selectedPeriod]);
  
  // Handle form input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for numeric fields
    if (name !== 'notes' && isNaN(Number(value)) && value !== '') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Handle frequency selection changes
  const handleFrequencyChange = useCallback((type: 'income' | 'expense') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_frequency`]: value as any
    }));
  }, []);
  
  // Handle period selection change
  const handlePeriodChange = useCallback((period: 'current' | 'previous') => {
    setSelectedPeriod(period);
    
    // Reset form to prevent mixing data
    setFormData(initialFormData);
    setCurrentRecordId(null);
  }, []);
  
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
      const employmentIncome = Number(formData.employment_income) || 0;
      const otherIncome = Number(formData.other_income) || 0;
      
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
      
      // Insert or update record
      const recordData = {
        user_id: selectedClient.id,
        period_type: selectedPeriod,
        monthly_income: monthlyIncome,
        employment_income: employmentIncome,
        other_income: otherIncome,
        rent_mortgage: rentMortgage,
        utilities: utilities,
        food: food,
        transportation: transportation,
        insurance: insurance,
        medical_expenses: medicalExpenses,
        other_expenses: otherExpenses,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        surplus_income: surplusIncome,
        notes: formData.notes
      };
      
      let response;
      
      if (currentRecordId) {
        // Update existing record
        response = await supabase
          .from('financial_records')
          .update(recordData)
          .eq('id', currentRecordId)
          .select();
      } else {
        // Insert new record
        response = await supabase
          .from('financial_records')
          .insert([recordData])
          .select();
      }
      
      if (response.error) {
        throw response.error;
      }
      
      // Set the current record ID for document uploads
      if (response.data && response.data.length > 0) {
        setCurrentRecordId(response.data[0].id);
      }
      
      // Update historical data
      setHistoricalData(prev => ({
        ...prev,
        [selectedPeriod === 'current' ? 'currentPeriod' : 'previousPeriod']: {
          totalIncome,
          totalExpenses,
          surplusIncome
        }
      }));
      
      toast.success(`Financial data ${currentRecordId ? 'updated' : 'saved'} successfully`);
      
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
