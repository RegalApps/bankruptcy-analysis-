
import { NumberInput } from "./NumberInput";
import { IncomeExpenseData } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IncomeSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const IncomeSection = ({ formData, onChange }: IncomeSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Information</CardTitle>
        <CardDescription>Please provide your monthly income details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            id="monthly_income"
            name="monthly_income"
            label="Total Monthly Income"
            value={formData.monthly_income}
            onChange={onChange}
            required
          />
          <NumberInput
            id="employment_income"
            name="employment_income"
            label="Employment Income"
            value={formData.employment_income}
            onChange={onChange}
            required
          />
          <NumberInput
            id="other_income"
            name="other_income"
            label="Other Income"
            value={formData.other_income}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
