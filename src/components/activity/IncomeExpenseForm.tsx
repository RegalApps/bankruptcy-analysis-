
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { IncomeExpenseData } from "./types";
import { IncomeSection } from "./form/IncomeSection";
import { ExpensesSection } from "./form/ExpensesSection";
import { ClientSelector } from "./form/ClientSelector";
import { Client } from "./types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const IncomeExpenseForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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
    // In a real application, you would fetch the client details from your backend
    const client = {
      id: clientId,
      name: clientId === "1" ? "John Doe" : "Jane Smith",
      status: "active" as const,
      last_activity: "2024-03-10",
    };
    setSelectedClient(client);
  };

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
        user_id: selectedClient.id, // Changed from client_id to user_id
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

      // Reset form
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientSelector 
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
      />
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
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Financial Data"}
      </Button>
    </form>
  );
};
