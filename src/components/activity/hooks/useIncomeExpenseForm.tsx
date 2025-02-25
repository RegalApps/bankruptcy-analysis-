
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IncomeExpenseData, Client } from "../types";
import { UseIncomeExpenseFormReturn, PeriodType } from "./types";
import { initialFormData, initialHistoricalData } from "./initialState";
import { 
  fetchPreviousMonthData, 
  submitFinancialRecord,
  fetchHistoricalData 
} from "./financialDataService";

export const useIncomeExpenseForm = (): UseIncomeExpenseFormReturn => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [previousMonthData, setPreviousMonthData] = useState<IncomeExpenseData | null>(null);
  const [formData, setFormData] = useState<IncomeExpenseData>(initialFormData);
  const [historicalData, setHistoricalData] = useState(initialHistoricalData);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('current');

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
  };

  const handleClientSelect = async (clientId: string) => {
    const client = {
      id: clientId,
      name: clientId === "1" ? "John Doe" : "Jane Smith",
      status: "active" as const,
      last_activity: "2024-03-10",
    };
    setSelectedClient(client);
    const previousData = await fetchPreviousMonthData(clientId);
    setPreviousMonthData(previousData);
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

      setFormData(initialFormData);
      setSelectedClient(null);
      setSelectedPeriod('current');
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
    handleChange,
    handleFrequencyChange,
    handleClientSelect,
    handleSubmit,
    handlePeriodChange,
  };
};
