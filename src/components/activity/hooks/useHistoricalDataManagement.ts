
import { useState } from "react";
import { HistoricalData } from "./types";
import { initialHistoricalData } from "./initialState";

export const useHistoricalDataManagement = () => {
  // Initialize historical comparison data
  const [historicalData, setHistoricalData] = useState<HistoricalData>(initialHistoricalData);
  const [previousMonthData, setPreviousMonthData] = useState<any>(null);

  const updateHistoricalData = (
    period: 'currentPeriod' | 'previousPeriod',
    totalIncome: number,
    totalExpenses: number,
    surplusIncome: number
  ) => {
    setHistoricalData(prev => ({
      ...prev,
      [period]: {
        totalIncome,
        totalExpenses,
        surplusIncome
      }
    }));
  };

  return {
    historicalData,
    setHistoricalData,
    previousMonthData,
    setPreviousMonthData,
    updateHistoricalData
  };
};
