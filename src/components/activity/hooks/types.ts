
export interface HistoricalData {
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
