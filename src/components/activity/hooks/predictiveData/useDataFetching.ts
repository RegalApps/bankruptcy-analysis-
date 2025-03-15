
import { useState, useEffect } from "react";
import { Client } from "../../types";
import { 
  generateMockHistoricalData, 
  generateMockForecastData, 
  generateMockMetrics, 
  generateMockCategoryAnalysis 
} from "./mockDataGenerator";
import { toast } from "sonner";

export const useDataFetching = (
  selectedClient: Client | null,
  refreshTrigger: number = 0
) => {
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

        // Get mock historical data
        const mockHistoricalData = generateMockHistoricalData();
        
        // Get the last date from historical data
        const lastRecord = mockHistoricalData[mockHistoricalData.length - 1];
        const lastDate = new Date(lastRecord.submission_date);
        
        // Get mock forecast data based on last date
        const mockForecastData = generateMockForecastData(lastDate);

        // Mock metrics and category analysis
        const mockMetrics = generateMockMetrics();
        const mockCategoryAnalysis = generateMockCategoryAnalysis();

        // Combine historical and forecast data
        const combinedData = [...mockHistoricalData, ...mockForecastData];

        setProcessedData(combinedData);
        setMetrics(mockMetrics);
        setCategoryAnalysis(mockCategoryAnalysis);
        setFinancialRecords(mockHistoricalData);
        setLastRefreshed(new Date());

      } catch (error) {
        console.error("Error fetching predictive data:", error);
        toast.error("Failed to fetch predictive data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictiveData();
  }, [selectedClient, refreshTrigger]);

  return {
    isLoading,
    processedData,
    metrics,
    lastRefreshed,
    financialRecords,
    categoryAnalysis,
    setProcessedData,
    setMetrics,
    setLastRefreshed,
    setCategoryAnalysis,
    setFinancialRecords
  };
};
