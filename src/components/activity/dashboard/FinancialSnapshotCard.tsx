
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IncomeExpenseData } from "../types";

interface FinancialSnapshotCardProps {
  formData: IncomeExpenseData;
  currentSurplus: string;
}

export const FinancialSnapshotCard = ({
  formData,
  currentSurplus
}: FinancialSnapshotCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Income</h3>
          <p className="text-xl font-bold">
            ${(parseFloat(formData.total_monthly_income || "0") + 
                parseFloat(formData.spouse_total_monthly_income || "0")).toFixed(2)}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Essential Expenses</h3>
          <p className="text-xl font-bold">${parseFloat(formData.total_essential_expenses || "0").toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Discretionary Expenses</h3>
          <p className="text-xl font-bold">${parseFloat(formData.total_discretionary_expenses || "0").toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Savings & Insurance</h3>
          <p className="text-xl font-bold">
            ${(parseFloat(formData.total_savings || "0") + 
                parseFloat(formData.total_insurance || "0")).toFixed(2)}
          </p>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Surplus/Deficit</h3>
          <p className={`text-xl font-bold ${parseFloat(currentSurplus) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${parseFloat(currentSurplus).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
