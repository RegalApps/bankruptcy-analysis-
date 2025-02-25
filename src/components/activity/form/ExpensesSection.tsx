
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ExpensesSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (value: string) => void;
  previousMonthData?: IncomeExpenseData;
}

const ExpenseField = ({ 
  id, 
  label, 
  currentValue, 
  previousValue,
  onChange,
  required = true
}: {
  id: string;
  label: string;
  currentValue: string;
  previousValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
}) => {
  const hasSignificantChange = previousValue && Math.abs(
    ((parseFloat(currentValue || '0') - parseFloat(previousValue)) / parseFloat(previousValue)) * 100
  ) > 20;

  return (
    <div className="space-y-2">
      <NumberInput
        id={id}
        name={id}
        label={label}
        value={currentValue}
        onChange={onChange}
        required={required}
      />
      {previousValue && (
        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">Previous: ${parseFloat(previousValue).toFixed(2)}</span>
          {hasSignificantChange && (
            <Alert variant="destructive" className="py-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {parseFloat(currentValue || '0') > parseFloat(previousValue) 
                  ? 'Significant increase'
                  : 'Significant decrease'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export const ExpensesSection = ({ 
  formData, 
  onChange, 
  onFrequencyChange,
  previousMonthData 
}: ExpensesSectionProps) => {
  const expenseFields = [
    { id: "rent_mortgage", label: "Rent/Mortgage" },
    { id: "utilities", label: "Utilities" },
    { id: "food", label: "Food" },
    { id: "transportation", label: "Transportation" },
    { id: "insurance", label: "Insurance" },
    { id: "medical_expenses", label: "Medical Expenses" },
    { id: "other_expenses", label: "Other Expenses", required: false }
  ];

  const calculateTotalExpenses = (data: IncomeExpenseData) => {
    return expenseFields.reduce((total, field) => {
      const value = parseFloat(data[field.id as keyof IncomeExpenseData] as string) || 0;
      return total + value;
    }, 0);
  };

  const currentTotal = calculateTotalExpenses(formData);
  const previousTotal = previousMonthData ? calculateTotalExpenses(previousMonthData) : null;
  const totalChange = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Enter your regular monthly expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenseFields.map((field) => (
            <ExpenseField
              key={field.id}
              id={field.id}
              label={field.label}
              currentValue={formData[field.id as keyof IncomeExpenseData] as string}
              previousValue={previousMonthData?.[field.id as keyof IncomeExpenseData] as string}
              onChange={onChange}
              required={field.required}
            />
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Current Total: ${currentTotal.toFixed(2)}</h4>
              {previousTotal && (
                <p className="text-sm text-muted-foreground">
                  Previous Total: ${previousTotal.toFixed(2)}
                  {totalChange && (
                    <span className={`ml-2 ${totalChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ({totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}%)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
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
