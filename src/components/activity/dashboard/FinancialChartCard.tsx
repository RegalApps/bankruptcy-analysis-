
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FinancialChart } from "../components/FinancialChart";

interface FinancialChartCardProps {
  chartData: Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>;
  expenseBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  clientName: string;
}

export const FinancialChartCard = ({
  chartData,
  expenseBreakdown,
  clientName
}: FinancialChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expenses Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <FinancialChart
          chartData={chartData}
          expenseBreakdown={expenseBreakdown}
          clientName={clientName}
        />
      </CardContent>
    </Card>
  );
};
