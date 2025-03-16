
import { useState, useCallback } from "react";
import { IncomeExpenseData } from "../types";

export const useFormDataHandling = () => {
  const [formData, setFormData] = useState<IncomeExpenseData>({} as IncomeExpenseData);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
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
  }, []);
  
  // Handle select field changes (for dropdowns)
  const handleFieldSelectChange = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);
  
  // Handle frequency selection changes
  const handleFrequencyChange = useCallback((type: 'income' | 'expense') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_frequency`]: value as any
    }));
  }, []);

  return {
    formData,
    setFormData,
    currentRecordId,
    setCurrentRecordId,
    handleChange,
    handleFieldSelectChange,
    handleFrequencyChange
  };
};
