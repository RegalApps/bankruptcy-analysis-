
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Insert"];

interface IncomeExpenseData {
  monthly_income: string;
  employment_income: string;
  other_income: string;
  rent_mortgage: string;
  utilities: string;
  food: string;
  transportation: string;
  insurance: string;
  medical_expenses: string;
  other_expenses: string;
  notes: string;
}

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
      // Convert string values to numbers for the database
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

      // Reset form
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
      <Card>
        <CardHeader>
          <CardTitle>Income Information</CardTitle>
          <CardDescription>
            Please provide your monthly income details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_income">Total Monthly Income</Label>
              <Input
                id="monthly_income"
                name="monthly_income"
                type="number"
                placeholder="0.00"
                value={formData.monthly_income}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_income">Employment Income</Label>
              <Input
                id="employment_income"
                name="employment_income"
                type="number"
                placeholder="0.00"
                value={formData.employment_income}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_income">Other Income</Label>
              <Input
                id="other_income"
                name="other_income"
                type="number"
                placeholder="0.00"
                value={formData.other_income}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>
            Enter your regular monthly expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent_mortgage">Rent/Mortgage</Label>
              <Input
                id="rent_mortgage"
                name="rent_mortgage"
                type="number"
                placeholder="0.00"
                value={formData.rent_mortgage}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities</Label>
              <Input
                id="utilities"
                name="utilities"
                type="number"
                placeholder="0.00"
                value={formData.utilities}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="food">Food</Label>
              <Input
                id="food"
                name="food"
                type="number"
                placeholder="0.00"
                value={formData.food}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transportation">Transportation</Label>
              <Input
                id="transportation"
                name="transportation"
                type="number"
                placeholder="0.00"
                value={formData.transportation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                name="insurance"
                type="number"
                placeholder="0.00"
                value={formData.insurance}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medical_expenses">Medical Expenses</Label>
              <Input
                id="medical_expenses"
                name="medical_expenses"
                type="number"
                placeholder="0.00"
                value={formData.medical_expenses}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_expenses">Other Expenses</Label>
              <Input
                id="other_expenses"
                name="other_expenses"
                type="number"
                placeholder="0.00"
                value={formData.other_expenses}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any relevant notes or comments"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Financial Data"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
