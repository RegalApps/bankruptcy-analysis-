
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

interface EssentialExpensesSectionProps {
  formData: IncomeExpenseData;
  previousMonthData?: IncomeExpenseData | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EssentialExpensesSection = ({ 
  formData, 
  previousMonthData, 
  onChange 
}: EssentialExpensesSectionProps) => {
  // Essential expense fields with labels
  const expenseFields = [
    { id: "mortgage_rent", label: "Mortgage/Rent" },
    { id: "utilities", label: "Utilities (Electricity, Gas, Water)" },
    { id: "groceries", label: "Groceries" },
    { id: "child_care", label: "Child Care" },
    { id: "medical_dental", label: "Medical/Dental Expenses" },
    { id: "transportation", label: "Transportation (Car, Public Transit)" },
    { id: "education_tuition", label: "Education/Tuition" },
    { id: "debt_repayments", label: "Debt Repayments" },
    { id: "misc_essential_expenses", label: "Miscellaneous Essential Expenses" }
  ];
  
  // Calculate total essential expenses
  const calculateTotal = () => {
    let total = 0;
    expenseFields.forEach(field => {
      total += parseFloat(formData[field.id as keyof IncomeExpenseData] as string || '0');
    });
    return total.toFixed(2);
  };
  
  // Update total when values change
  useEffect(() => {
    const total = calculateTotal();
    if (formData.total_essential_expenses !== total) {
      const e = {
        target: {
          name: 'total_essential_expenses',
          value: total
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(e);
    }
  }, [formData, onChange]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Essential Monthly Expenses</CardTitle>
        <CardDescription>
          Record all necessary monthly expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Expense Category</TableHead>
              <TableHead>Amount ($)</TableHead>
              <TableHead className="text-right">Previous Month</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseFields.map(field => (
              <TableRow key={field.id}>
                <TableCell>{field.label}</TableCell>
                <TableCell>
                  <ComparisonField
                    id={field.id}
                    name={field.id}
                    label=""
                    value={formData[field.id as keyof IncomeExpenseData] as string}
                    previousValue={previousMonthData ? previousMonthData[field.id as keyof IncomeExpenseData] as string : undefined}
                    onChange={onChange}
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
            
            {/* Total Row */}
            <TableRow className="font-bold">
              <TableCell>Total Non-Discretionary Expenses</TableCell>
              <TableCell>
                ${calculateTotal()}
              </TableCell>
              <TableCell className="text-right">
                {previousMonthData ? 
                  `$${parseFloat(previousMonthData.total_essential_expenses || '0').toFixed(2)}` : 
                  'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
