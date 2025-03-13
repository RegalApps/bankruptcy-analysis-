import React, { useEffect } from "react";
import { IncomeExpenseData } from "../types";
import { ComparisonField } from "./ComparisonField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EnhancedIncomeSectionProps {
  formData: IncomeExpenseData;
  previousMonthData?: IncomeExpenseData | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFrequencyChange: (value: string) => void;
}

export const EnhancedIncomeSection = ({ 
  formData, 
  previousMonthData, 
  onChange, 
  onFrequencyChange 
}: EnhancedIncomeSectionProps) => {
  // Income source fields with labels
  const incomeFields = [
    { id: "employment_income", label: "Employment Income" },
    { id: "pension_annuities", label: "Pension/Annuities" },
    { id: "child_spousal_support", label: "Child/Spousal Support" },
    { id: "self_employment_income", label: "Self-Employment Income" },
    { id: "government_benefits", label: "Government Benefits" },
    { id: "rental_income", label: "Rental Income" },
    { id: "other_income", label: "Other (specify)" }
  ];
  
  // Calculate totals
  const calculateDebtorTotal = () => {
    let total = 0;
    incomeFields.forEach(field => {
      total += parseFloat(formData[field.id as keyof IncomeExpenseData] as string || '0');
    });
    return total.toFixed(2);
  };
  
  const calculateSpouseTotal = () => {
    let total = 0;
    incomeFields.forEach(field => {
      const fieldId = `spouse_${field.id}` as keyof IncomeExpenseData;
      total += parseFloat(formData[fieldId] as string || '0');
    });
    return total.toFixed(2);
  };
  
  // Update totals when values change
  const handleTotalsUpdate = () => {
    const debtorTotal = calculateDebtorTotal();
    const spouseTotal = calculateSpouseTotal();
    
    // Only update if the values are different to prevent infinite loops
    if (formData.total_monthly_income !== debtorTotal) {
      const e = {
        target: {
          name: 'total_monthly_income',
          value: debtorTotal
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(e);
    }
    
    if (formData.spouse_total_monthly_income !== spouseTotal) {
      const e = {
        target: {
          name: 'spouse_total_monthly_income',
          value: spouseTotal
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(e);
    }
  };
  
  // Call the update function whenever the component renders
  useEffect(() => {
    handleTotalsUpdate();
  }, [formData, onChange]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income Details</CardTitle>
        <CardDescription>
          Record all sources of income for the debtor and spouse/partner if applicable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Source of Income</TableHead>
              <TableHead>Debtor Amount</TableHead>
              <TableHead>Spouse Amount</TableHead>
              <TableHead className="text-right">Previous Month</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomeFields.map(field => (
              <TableRow key={field.id}>
                <TableCell>{field.label}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name={field.id}
                    value={formData[field.id as keyof IncomeExpenseData] as string}
                    onChange={onChange}
                    step="0.01"
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name={`spouse_${field.id}`}
                    value={formData[`spouse_${field.id}` as keyof IncomeExpenseData] as string}
                    onChange={onChange}
                    step="0.01"
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell className="text-right">
                  {previousMonthData ? 
                    `$${parseFloat(previousMonthData[field.id as keyof IncomeExpenseData] as string || '0').toFixed(2)}` : 
                    'N/A'}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Other income description field */}
            <TableRow>
              <TableCell colSpan={2}>
                <div className="space-y-1">
                  <Label htmlFor="other_income_description">Specify Other Income</Label>
                  <Input
                    id="other_income_description"
                    name="other_income_description"
                    value={formData.other_income_description}
                    onChange={onChange}
                    placeholder="Describe other income sources"
                  />
                </div>
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
            
            {/* Total Row */}
            <TableRow className="font-bold">
              <TableCell>Total Monthly Net Income</TableCell>
              <TableCell>
                ${calculateDebtorTotal()}
              </TableCell>
              <TableCell>
                ${calculateSpouseTotal()}
              </TableCell>
              <TableCell className="text-right">
                {previousMonthData ? 
                  `$${parseFloat(previousMonthData.total_monthly_income || '0').toFixed(2)}` : 
                  'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="space-y-2">
          <Label>Income Frequency</Label>
          <Select onValueChange={onFrequencyChange} value={formData.income_frequency || 'monthly'}>
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
