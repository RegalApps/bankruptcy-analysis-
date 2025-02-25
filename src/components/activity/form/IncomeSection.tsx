
import { NumberInput } from "./NumberInput";
import { IncomeExpenseData } from "../types";
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
import { Label } from "@/components/ui/label";

interface IncomeSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (value: string) => void;
}

export const IncomeSection = ({ formData, onChange, onFrequencyChange }: IncomeSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Information</CardTitle>
        <CardDescription>
          Provide comprehensive details of all income sources to ensure accurate financial assessment
          and predictive analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <NumberInput
            id="monthly_income"
            name="monthly_income"
            label="Total Monthly Income"
            value={formData.monthly_income}
            onChange={onChange}
            required
            tooltip="Sum of all your income sources"
            placeholder="e.g., 0.00"
          />

          <div className="space-y-4">
            <Label>Employment Income</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              <NumberInput
                id="primary_salary"
                name="primary_salary"
                label="Primary Salary"
                value={formData.primary_salary}
                onChange={onChange}
                required
                tooltip="Enter your base salary"
                placeholder="e.g., 0.00"
              />
              <NumberInput
                id="overtime_bonuses"
                name="overtime_bonuses"
                label="Overtime/Bonuses"
                value={formData.overtime_bonuses}
                onChange={onChange}
                tooltip="Include overtime, bonuses, or additional compensation"
                placeholder="e.g., 0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Other Income</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
              <NumberInput
                id="freelance_income"
                name="freelance_income"
                label="Freelance/Contract Work"
                value={formData.freelance_income}
                onChange={onChange}
                tooltip="Income from freelance projects or contract work"
                placeholder="e.g., 0.00"
              />
              <NumberInput
                id="investment_income"
                name="investment_income"
                label="Investments & Dividends"
                value={formData.investment_income}
                onChange={onChange}
                tooltip="Returns from investments, dividends, or interest"
                placeholder="e.g., 0.00"
              />
              <NumberInput
                id="rental_income"
                name="rental_income"
                label="Rental Income"
                value={formData.rental_income}
                onChange={onChange}
                tooltip="Income earned from renting properties"
                placeholder="e.g., 0.00"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Income Frequency</Label>
          <Select onValueChange={onFrequencyChange} value={formData.income_frequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
