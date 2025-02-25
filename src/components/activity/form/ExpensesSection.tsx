
import { NumberInput } from "./NumberInput";
import { IncomeExpenseData } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpensesSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (value: string) => void;
}

export const ExpensesSection = ({ formData, onChange, onFrequencyChange }: ExpensesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Enter your regular monthly expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            id="rent_mortgage"
            name="rent_mortgage"
            label="Rent/Mortgage"
            value={formData.rent_mortgage}
            onChange={onChange}
            required
          />
          <NumberInput
            id="utilities"
            name="utilities"
            label="Utilities"
            value={formData.utilities}
            onChange={onChange}
            required
          />
          <NumberInput
            id="food"
            name="food"
            label="Food"
            value={formData.food}
            onChange={onChange}
            required
          />
          <NumberInput
            id="transportation"
            name="transportation"
            label="Transportation"
            value={formData.transportation}
            onChange={onChange}
            required
          />
          <NumberInput
            id="insurance"
            name="insurance"
            label="Insurance"
            value={formData.insurance}
            onChange={onChange}
            required
          />
          <NumberInput
            id="medical_expenses"
            name="medical_expenses"
            label="Medical Expenses"
            value={formData.medical_expenses}
            onChange={onChange}
            required
          />
          <NumberInput
            id="other_expenses"
            name="other_expenses"
            label="Other Expenses"
            value={formData.other_expenses}
            onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Expense Frequency</Label>
          <Select onValueChange={onFrequencyChange} value={formData.expense_frequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="bi-monthly">Bi-Monthly</SelectItem>
              <SelectItem value="one-time">One-Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add any relevant notes or comments"
            value={formData.notes}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
