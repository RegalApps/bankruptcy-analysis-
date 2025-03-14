
import { useState, useEffect } from "react";
import { Client, IncomeExpenseData } from "../types";

export const useDashboardData = (
  selectedClient: Client | null,
  formData: IncomeExpenseData,
  historicalData: {
    currentPeriod: {
      totalIncome: number;
      totalExpenses: number;
      surplusIncome: number;
    };
    previousPeriod: {
      totalIncome: number;
      totalExpenses: number;
      surplusIncome: number;
    };
  }
) => {
  const [metrics, setMetrics] = useState<{
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null>(null);

  // Mock data for components that need specific props
  const [mockChartData, setMockChartData] = useState<Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>>([]);

  const [mockExcelDocuments, setMockExcelDocuments] = useState<any[]>([]);
  const [seasonalityScore, setSeasonalityScore] = useState<string | null>("0.65");

  useEffect(() => {
    if (selectedClient) {
      // Calculate metrics from form data and historical data
      const currentSurplus = (
        parseFloat(formData.total_monthly_income || "0") +
        parseFloat(formData.spouse_total_monthly_income || "0") -
        parseFloat(formData.total_essential_expenses || "0") -
        parseFloat(formData.total_discretionary_expenses || "0") -
        parseFloat(formData.total_savings || "0") -
        parseFloat(formData.total_insurance || "0")
      ).toFixed(2);

      const totalIncome = parseFloat(formData.total_monthly_income || "0") +
                          parseFloat(formData.spouse_total_monthly_income || "0");
      
      const surplusPercentage = totalIncome > 0 
        ? ((parseFloat(currentSurplus) / totalIncome) * 100).toFixed(1)
        : "0";
      
      const monthlyTrend = (
        historicalData.currentPeriod.surplusIncome -
        historicalData.previousPeriod.surplusIncome
      ).toFixed(2);

      // Determine risk level
      let riskLevel = "Low";
      if (parseFloat(currentSurplus) < 0) {
        riskLevel = "High";
      } else if (parseFloat(surplusPercentage) < 10) {
        riskLevel = "Medium";
      }

      setMetrics({
        currentSurplus,
        surplusPercentage,
        monthlyTrend,
        riskLevel,
      });

      // Generate mock chart data
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      const chartData = lastSixMonths.map(month => {
        const income = totalIncome * (0.9 + Math.random() * 0.2);
        const expenses = 
          parseFloat(formData.total_essential_expenses || "0") +
          parseFloat(formData.total_discretionary_expenses || "0") +
          parseFloat(formData.total_savings || "0") +
          parseFloat(formData.total_insurance || "0");
        const randomExpenses = expenses * (0.9 + Math.random() * 0.2);
        
        return {
          date: month,
          Income: parseFloat(income.toFixed(2)),
          Expenses: parseFloat(randomExpenses.toFixed(2)),
          Surplus: parseFloat((income - randomExpenses).toFixed(2))
        };
      });
      
      setMockChartData(chartData);

      // Mock excel documents
      if (selectedClient.id) {
        setMockExcelDocuments([
          { id: '1', name: 'Income Statement.xlsx', date: '2024-03-01' },
          { id: '2', name: 'Budget Analysis.xlsx', date: '2024-02-15' }
        ]);
      }
    }
  }, [selectedClient, formData, historicalData]);

  // Generate expense breakdown for chart
  const expenseBreakdown = selectedClient ? [
    {
      name: 'Housing',
      value: parseFloat(formData.mortgage_rent || "0"),
      color: '#8884d8'
    },
    {
      name: 'Utilities',
      value: parseFloat(formData.utilities || "0"),
      color: '#82ca9d'
    },
    {
      name: 'Food',
      value: parseFloat(formData.groceries || "0"),
      color: '#ffc658'
    },
    {
      name: 'Transportation',
      value: parseFloat(formData.transportation || "0"),
      color: '#ff8042'
    },
    {
      name: 'Debt Payments',
      value: parseFloat(formData.debt_repayments || "0"),
      color: '#0088FE'
    },
    {
      name: 'Discretionary',
      value: parseFloat(formData.total_discretionary_expenses || "0"),
      color: '#FF8042'
    }
  ].filter(item => item.value > 0) : [];

  return {
    metrics,
    mockChartData,
    mockExcelDocuments,
    seasonalityScore,
    expenseBreakdown
  };
};
