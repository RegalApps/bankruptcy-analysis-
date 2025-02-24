
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { IncomeExpenseData } from "./types";
import { IncomeSection } from "./form/IncomeSection";
import { ExpensesSection } from "./form/ExpensesSection";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

export const IncomeExpenseForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IncomeExpenseData>({
    monthly_income: "",
    employment_income: "",
    other_income: "",
    rent_mortgage: "",
    utilities: "",
    food: "",
    transportation: "",
    insurance: "",
    medical_expenses: "",
    other_expenses: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const financialRecord: FinancialRecord = {
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
        other_income: "",
        rent_mortgage: "",
        utilities: "",
        food: "",
        transportation: "",
        insurance: "",
        medical_expenses: "",
        other_expenses: "",
        notes: "",
      });
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
      <IncomeSection formData={formData} onChange={handleChange} />
      <ExpensesSection formData={formData} onChange={handleChange} />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Financial Data"}
      </Button>
    </form>
  );
};
