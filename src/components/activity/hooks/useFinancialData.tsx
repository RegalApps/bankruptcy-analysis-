
import { useState, useEffect, useCallback } from "react";
import { Client } from "../types";

interface Metrics {
  currentSurplus: string;
  surplusPercentage: string;
  monthlyTrend: string;
  riskLevel: string;
}

interface UseFinancialDataReturn {
  metrics: Metrics | null;
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
  excelDocuments: Array<{
    id: string;
    name: string;
    date: string;
  }>;
  isLoading: boolean;
  refetch: () => void;
}

export const useFinancialData = (selectedClient: Client | null): UseFinancialDataReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [chartData, setChartData] = useState<Array<{
    date: string;
    Income: number;
    Expenses: number;
    Surplus: number;
  }>>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);
  const [excelDocuments, setExcelDocuments] = useState<Array<{
    id: string;
    name: string;
    date: string;
  }>>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClient) {
        setMetrics(null);
        setChartData([]);
        setExpenseBreakdown([]);
        setExcelDocuments([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log("Fetching financial data for client:", selectedClient.id);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock metrics data
        const mockMetrics = {
          currentSurplus: "3930.00",
          surplusPercentage: "43.7",
          monthlyTrend: "120.00",
          riskLevel: "Low"
        };
        
        // Mock chart data - 6 months
        const mockChartData = [
          { date: "Jan 2024", Income: 8500, Expenses: 4800, Surplus: 3700 },
          { date: "Feb 2024", Income: 8600, Expenses: 4900, Surplus: 3700 },
          { date: "Mar 2024", Income: 8700, Expenses: 4950, Surplus: 3750 },
          { date: "Apr 2024", Income: 8800, Expenses: 4990, Surplus: 3810 },
          { date: "May 2024", Income: 9000, Expenses: 5070, Surplus: 3930 },
          { date: "Jun 2024", Income: 9000, Expenses: 5070, Surplus: 3930 }
        ];
        
        // Mock expense breakdown data
        const mockExpenseBreakdown = [
          { name: "Essential Expenses", value: 3600, color: "#8884d8" },
          { name: "Discretionary Expenses", value: 500, color: "#82ca9d" },
          { name: "Savings & Investments", value: 700, color: "#ffc658" },
          { name: "Insurance", value: 270, color: "#ff8042" }
        ];
        
        // Mock Excel documents
        const mockExcelDocuments = [
          { id: "doc1", name: "Bank Statement - May 2024", date: "2024-05-15" },
          { id: "doc2", name: "Credit Card Statement - May 2024", date: "2024-05-10" }
        ];
        
        setMetrics(mockMetrics);
        setChartData(mockChartData);
        setExpenseBreakdown(mockExpenseBreakdown);
        setExcelDocuments(mockExcelDocuments);
        
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedClient, refetchTrigger]);
  
  return {
    metrics,
    chartData,
    expenseBreakdown,
    excelDocuments,
    isLoading,
    refetch
  };
};
