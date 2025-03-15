
import { useState } from "react";
import { Client } from "../../types";
import { useDataFetching } from "./useDataFetching";
import { useRefreshing } from "./useRefreshing";
import { PredictiveData } from "./types";

export const usePredictiveData = (
  selectedClient: Client | null,
  refreshTrigger: number = 0
): PredictiveData => {
  const {
    isLoading,
    processedData,
    metrics,
    lastRefreshed,
    financialRecords,
    categoryAnalysis,
    setIsLoading,
    setLastRefreshed
  } = useDataFetching(selectedClient, refreshTrigger);

  const { refetch } = useRefreshing(setLastRefreshed, setIsLoading);

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

export * from "./types";
