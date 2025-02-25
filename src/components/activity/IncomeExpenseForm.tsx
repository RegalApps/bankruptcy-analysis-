import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { IncomeExpenseData } from "./types";
import { IncomeSection } from "./form/IncomeSection";
import { ExpensesSection } from "./form/ExpensesSection";
import { ClientSelector } from "./form/ClientSelector";
import { HistoricalComparison } from "./components/HistoricalComparison";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { Client } from "./types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const IncomeExpenseForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
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

  const calculateTotals = (data: IncomeExpenseData) => {
    const income = parseFloat(data.monthly_income) || 0 +
      parseFloat(data.employment_income) || 0 +
      parseFloat(data.other_income) || 0;

    const expenses = parseFloat(data.rent_mortgage) || 0 +
      parseFloat(data.utilities) || 0 +
      parseFloat(data.food) || 0 +
      parseFloat(data.transportation) || 0 +
      parseFloat(data.insurance) || 0 +
      parseFloat(data.medical_expenses) || 0 +
      parseFloat(data.other_expenses) || 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      surplusIncome: income - expenses,
    };
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

      const { error } = await supabase
        .from("financial_records")
        .insert([financialRecord]);

      if (error) throw error;

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
      setCurrentRecordId(financialRecord.id);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientSelector 
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
      />
      
      {selectedClient && (
        <HistoricalComparison
          currentPeriod={historicalData.currentPeriod}
          previousPeriod={historicalData.previousPeriod}
        />
      )}
      
      <IncomeSection 
        formData={formData} 
        onChange={handleChange}
        onFrequencyChange={handleFrequencyChange('income')}
      />
      
      <ExpensesSection 
        formData={formData} 
        onChange={handleChange}
        onFrequencyChange={handleFrequencyChange('expense')}
      />
      
      <DocumentUploadSection financialRecordId={currentRecordId} />
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Financial Data"}
      </Button>
    </form>
  );
};
