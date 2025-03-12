
import { useState, useEffect } from "react";
import { Client } from "../types";

interface PredictiveData {
  processedData: any[];
  metrics: {
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
    seasonalityScore: number | null;
  } | null;
  categoryAnalysis: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  isLoading: boolean;
  lastRefreshed: Date | null;
  financialRecords: any[];
  refetch: () => void;
}

export const usePredictiveData = (
  selectedClient: Client | null,
  refreshTrigger: number = 0
): PredictiveData => {
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [financialRecords, setFinancialRecords] = useState<any[]>([]);
  const [categoryAnalysis, setCategoryAnalysis] = useState<Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>>([]);

  const refetch = () => {
    // This will trigger a re-fetch via the effect
    console.log("Manually refreshing predictive data");
  };

  useEffect(() => {
    const fetchPredictiveData = async () => {
      if (!selectedClient) {
        setProcessedData([]);
        setMetrics(null);
        setCategoryAnalysis([]);
        return;
      }

      setIsLoading(true);

      try {
        console.log("Fetching predictive data for client:", selectedClient.id);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create mock historical data (5 months of past data + current month)
        const mockHistoricalData = [
          {
            submission_date: "2024-01-15",
            surplus_income: 3700,
            total_expenses: 4800,
            total_income: 8500,
            isForecast: false,
            isAnomaly: false
          },
          {
            submission_date: "2024-02-15",
            surplus_income: 3700,
            total_expenses: 4900,
            total_income: 8600,
            isForecast: false,
            isAnomaly: false
          },
          {
            submission_date: "2024-03-15",
            surplus_income: 3750,
            total_expenses: 4950,
            total_income: 8700,
            isForecast: false,
            isAnomaly: false
          },
          {
            submission_date: "2024-04-15",
            surplus_income: 3810,
            total_expenses: 4990,
            total_income: 8800,
            isForecast: false,
            isAnomaly: false
          },
          {
            submission_date: "2024-05-15",
            surplus_income: 3930,
            total_expenses: 5070,
            total_income: 9000,
            isForecast: false,
            isAnomaly: false
          }
        ];

        // Create mock forecast data for next 6 months
        const mockForecastData = [
          {
            submission_date: "2024-06-15",
            forecast: 3950,
            isForecast: true,
            isAnomaly: false
          },
          {
            submission_date: "2024-07-15",
            forecast: 4000,
            isForecast: true,
            isAnomaly: false
          },
          {
            submission_date: "2024-08-15",
            forecast: 4050,
            isForecast: true,
            isAnomaly: false
          },
          {
            submission_date: "2024-09-15",
            forecast: 4100,
            isForecast: true,
            isAnomaly: false
          },
          {
            submission_date: "2024-10-15",
            forecast: 4080,
            isForecast: true,
            isAnomaly: false
          },
          {
            submission_date: "2024-11-15",
            forecast: 4150,
            isForecast: true,
            isAnomaly: false
          }
        ];

        // Combine historical and forecast data
        const combinedData = [...mockHistoricalData, ...mockForecastData];

        // Mock metrics
        const mockMetrics = {
          currentSurplus: "3930.00",
          surplusPercentage: "43.7",
          monthlyTrend: "120.00",
          riskLevel: "Low",
          seasonalityScore: 24.5
        };

        // Mock category analysis
        const mockCategoryAnalysis = [
          { name: "Essential Expenses", value: 3600, percentage: 71.0, color: "#8884d8" },
          { name: "Discretionary Expenses", value: 500, percentage: 9.9, color: "#82ca9d" },
          { name: "Savings & Investments", value: 700, percentage: 13.8, color: "#ffc658" },
          { name: "Insurance", value: 270, percentage: 5.3, color: "#ff8042" }
        ];

        setProcessedData(combinedData);
        setMetrics(mockMetrics);
        setCategoryAnalysis(mockCategoryAnalysis);
        setFinancialRecords(mockHistoricalData);
        setLastRefreshed(new Date());

      } catch (error) {
        console.error("Error fetching predictive data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictiveData();
  }, [selectedClient, refreshTrigger]);

  return {
    processedData,
    metrics,
    categoryAnalysis,
    isLoading,
    lastRefreshed,
    financialRecords,
    refetch
  };
};
