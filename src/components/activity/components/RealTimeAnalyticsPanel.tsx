import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IncomeExpenseData } from "../types";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

interface RealTimeAnalyticsPanelProps {
  formData: IncomeExpenseData;
  previousMonthData: any;
  historicalData: any;
}

export const RealTimeAnalyticsPanel = ({
  formData,
  previousMonthData,
  historicalData
}: RealTimeAnalyticsPanelProps) => {
  // Memoize calculations to prevent unnecessary recalculations
  const analytics = useMemo(() => {
    if (!formData || !previousMonthData) {
      return null;
    }

    // Calculate total income
    const currentTotalIncome = 
      parseFloat(formData.total_monthly_income || "0") + 
      parseFloat(formData.spouse_total_monthly_income || "0");
    
    const previousTotalIncome = 
      parseFloat(previousMonthData.total_monthly_income || "0") + 
      parseFloat(previousMonthData.spouse_total_monthly_income || "0");

    // Calculate total expenses
    const currentTotalExpenses = 
      parseFloat(formData.total_essential_expenses || "0") + 
      parseFloat(formData.total_discretionary_expenses || "0") +
      parseFloat(formData.total_savings || "0") +
      parseFloat(formData.total_insurance || "0");
    
    const previousTotalExpenses = 
      parseFloat(previousMonthData.total_essential_expenses || "0") + 
      parseFloat(previousMonthData.total_discretionary_expenses || "0") +
      parseFloat(previousMonthData.total_savings || "0") +
      parseFloat(previousMonthData.total_insurance || "0");

    // Calculate surplus
    const currentSurplus = currentTotalIncome - currentTotalExpenses;
    const previousSurplus = previousTotalIncome - previousTotalExpenses;
    
    // Calculate percent changes
    const incomeChange = previousTotalIncome ? 
      ((currentTotalIncome - previousTotalIncome) / previousTotalIncome) * 100 : 0;
    
    const expenseChange = previousTotalExpenses ? 
      ((currentTotalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100 : 0;
    
    const surplusChange = previousSurplus ? 
      ((currentSurplus - previousSurplus) / Math.abs(previousSurplus)) * 100 : 0;

    return {
      currentTotalIncome,
      previousTotalIncome,
      incomeChange,
      
      currentTotalExpenses,
      previousTotalExpenses,
      expenseChange,
      
      currentSurplus,
      previousSurplus,
      surplusChange,
      
      // Determine status
      incomeStatus: incomeChange >= 0 ? "positive" : "negative",
      expenseStatus: expenseChange <= 0 ? "positive" : "negative",
      surplusStatus: surplusChange >= 0 ? "positive" : "negative",
      
      // Format amounts for display
      formattedIncome: currentTotalIncome.toFixed(2),
      formattedExpenses: currentTotalExpenses.toFixed(2),
      formattedSurplus: currentSurplus.toFixed(2)
    };
  }, [formData, previousMonthData]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Income Analysis */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Income</span>
            {analytics.incomeStatus === "positive" ? (
              <div className="flex items-center text-green-600 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+{Math.abs(analytics.incomeChange).toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                <span>-{Math.abs(analytics.incomeChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center font-semibold text-lg">
            <DollarSign className="w-4 h-4 mr-1" />
            {analytics.formattedIncome}
          </div>
        </div>
        
        {/* Expenses Analysis */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Expenses</span>
            {analytics.expenseStatus === "positive" ? (
              <div className="flex items-center text-green-600 text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                <span>-{Math.abs(analytics.expenseChange).toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+{Math.abs(analytics.expenseChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center font-semibold text-lg">
            <DollarSign className="w-4 h-4 mr-1" />
            {analytics.formattedExpenses}
          </div>
        </div>
        
        {/* Surplus Analysis */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monthly Surplus</span>
            {analytics.surplusStatus === "positive" ? (
              <div className="flex items-center text-green-600 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+{Math.abs(analytics.surplusChange).toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                <span>-{Math.abs(analytics.surplusChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center font-semibold text-lg">
            <DollarSign className="w-4 h-4 mr-1" />
            {analytics.formattedSurplus}
          </div>
          
          {/* Warning for negative surplus */}
          {analytics.currentSurplus < 0 && (
            <div className="flex items-center text-amber-600 text-xs mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Negative cash flow detected</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
