
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IncomeExpenseData } from "../types";
import { Client } from "../types";
import { Database } from "@/integrations/supabase/types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const useIncomeExpenseForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IncomeExpenseData>({
    monthly_income: "",
    employment_income: "",
    primary_salary: "",
    overtime_bonuses: "",
    other_income: "",
    freelance_income: "",
    investment_income: "",
    rental_income: "",
    income_frequency: "monthly",
    rent_mortgage: "",
    utilities: "",
    electricity: "",
    gas: "",
    water: "",
    internet: "",
    food: "",
    groceries: "",
    dining_out: "",
    transportation: "",
    fuel: "",
    vehicle_maintenance: "",
    insurance: "",
    medical_expenses: "",
    other_expenses: "",
    expense_frequency: "monthly",
    notes: "",
  });

  const [historicalData, setHistoricalData] = useState({
    currentPeriod: {
      totalIncome: 0,
      totalExpenses: 0,
      surplusIncome: 0,
    },
    previousPeriod: {
      totalIncome: 0,
      totalExpenses: 0,
      surplusIncome: 0,
    },
  });

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

  const handleClientSelect = (clientId: string) => {
    const client = {
      id: clientId,
      name: clientId === "1" ? "John Doe" : "Jane Smith",
      status: "active" as const,
      last_activity: "2024-03-10",
    };
    setSelectedClient(client);
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedClient) return;

      try {
        const { data: records, error } = await supabase
          .from("financial_records")
          .select("*")
          .eq("user_id", selectedClient.id)
          .order("submission_date", { ascending: false })
          .limit(2);

        if (error) throw error;

        if (records && records.length > 0) {
          setHistoricalData({
            currentPeriod: {
              totalIncome: records[0].total_income || 0,
              totalExpenses: records[0].total_expenses || 0,
              surplusIncome: records[0].surplus_income || 0,
            },
            previousPeriod: {
              totalIncome: records[1]?.total_income || 0,
              totalExpenses: records[1]?.total_expenses || 0,
              surplusIncome: records[1]?.surplus_income || 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
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
      const financialRecord: FinancialRecord = {
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
        submission_date: new Date().toISOString(),
        status: "pending_review",
      };

      const { data, error } = await supabase
        .from("financial_records")
        .insert([financialRecord])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCurrentRecordId(data.id);
      }

      toast({
        title: "Success",
        description: "Financial data submitted successfully",
      });

      setFormData({
        monthly_income: "",
        employment_income: "",
        primary_salary: "",
        overtime_bonuses: "",
        other_income: "",
        freelance_income: "",
        investment_income: "",
        rental_income: "",
        income_frequency: "monthly",
        rent_mortgage: "",
        utilities: "",
        electricity: "",
        gas: "",
        water: "",
        internet: "",
        food: "",
        groceries: "",
        dining_out: "",
        transportation: "",
        fuel: "",
        vehicle_maintenance: "",
        insurance: "",
        medical_expenses: "",
        other_expenses: "",
        expense_frequency: "monthly",
        notes: "",
      });
      setSelectedClient(null);
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
    handleChange,
    handleFrequencyChange,
    handleClientSelect,
    handleSubmit,
  };
};
