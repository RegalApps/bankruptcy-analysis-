
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

interface IncomeExpenseData {
  monthlyIncome: string;
  employmentIncome: string;
  otherIncome: string;
  rentMortgage: string;
  utilities: string;
  food: string;
  transportation: string;
  insurance: string;
  medicalExpenses: string;
  otherExpenses: string;
  notes: string;
}

export const IncomeExpenseForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IncomeExpenseData>({
    monthlyIncome: "",
    employmentIncome: "",
    otherIncome: "",
    rentMortgage: "",
    utilities: "",
    food: "",
    transportation: "",
    insurance: "",
    medicalExpenses: "",
    otherExpenses: "",
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
      const { error } = await supabase
        .from("financial_records")
        .insert([
          {
            ...formData,
            submission_date: new Date().toISOString(),
            status: "pending_review",
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Financial data submitted successfully",
      });

      // Reset form
      setFormData({
        monthlyIncome: "",
        employmentIncome: "",
        otherIncome: "",
        rentMortgage: "",
        utilities: "",
        food: "",
        transportation: "",
        insurance: "",
        medicalExpenses: "",
        otherExpenses: "",
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
              <Label htmlFor="monthlyIncome">Total Monthly Income</Label>
              <Input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                placeholder="0.00"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentIncome">Employment Income</Label>
              <Input
                id="employmentIncome"
                name="employmentIncome"
                type="number"
                placeholder="0.00"
                value={formData.employmentIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherIncome">Other Income</Label>
              <Input
                id="otherIncome"
                name="otherIncome"
                type="number"
                placeholder="0.00"
                value={formData.otherIncome}
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
              <Label htmlFor="rentMortgage">Rent/Mortgage</Label>
              <Input
                id="rentMortgage"
                name="rentMortgage"
                type="number"
                placeholder="0.00"
                value={formData.rentMortgage}
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
              <Label htmlFor="medicalExpenses">Medical Expenses</Label>
              <Input
                id="medicalExpenses"
                name="medicalExpenses"
                type="number"
                placeholder="0.00"
                value={formData.medicalExpenses}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherExpenses">Other Expenses</Label>
              <Input
                id="otherExpenses"
                name="otherExpenses"
                type="number"
                placeholder="0.00"
                value={formData.otherExpenses}
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
