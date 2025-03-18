
import { useCallback, useState } from "react";
import { useDataFetching } from "./useDataFetching";
import { useRefreshing } from "./useRefreshing";
import { Client } from "../../types";
import { PredictiveData } from "./types";

export const usePredictiveData = (selectedClient: Client | null): PredictiveData => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const {
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
  } = useDataFetching(selectedClient, refreshTrigger);

  const { refetch } = useRefreshing(setLastRefreshed, setIsLoading);

  const handleRefetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    refetch();
  }, [refetch]);

  return {
    isLoading,
    processedData,
    metrics,
    lastRefreshed,
    financialRecords,
    categoryAnalysis,
    advancedRiskMetrics,
    refetch: handleRefetch
  };
};
