
import { useState, useEffect } from "react";
import { Client } from "../../types";
import { 
  generateMockHistoricalData, 
  generateMockForecastData, 
  generateMockMetrics, 
  generateMockCategoryAnalysis,
  generateAdvancedRiskMetrics
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
  const [advancedRiskMetrics, setAdvancedRiskMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchPredictiveData = async () => {
      if (!selectedClient) {
        setProcessedData([]);
        setMetrics(null);
        setCategoryAnalysis([]);
        setAdvancedRiskMetrics(null);
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
        const mockAdvancedRiskMetrics = generateAdvancedRiskMetrics(selectedClient.name);

        // Combine historical and forecast data
        const combinedData = [...mockHistoricalData, ...mockForecastData];

        setProcessedData(combinedData);
        setMetrics(mockMetrics);
        setCategoryAnalysis(mockCategoryAnalysis);
        setFinancialRecords(mockHistoricalData);
        setAdvancedRiskMetrics(mockAdvancedRiskMetrics);
        setLastRefreshed(new Date());

        // Show toast notification for high risk alerts
        if (mockAdvancedRiskMetrics.riskLevel === 'high') {
          toast.error(`High Financial Risk Alert for ${selectedClient.name}: ${mockAdvancedRiskMetrics.primaryRiskFactor}`, {
            duration: 6000,
          });
        } else if (mockAdvancedRiskMetrics.opportunities.length > 0) {
          toast.info(`Financial Opportunity Detected: ${mockAdvancedRiskMetrics.opportunities[0].title}`, {
            duration: 5000,
          });
        }

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
    advancedRiskMetrics,
    setProcessedData,
    setMetrics,
    setLastRefreshed,
    setCategoryAnalysis,
    setFinancialRecords,
    setIsLoading
  };
};
