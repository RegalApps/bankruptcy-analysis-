
import { Client } from "../../types";

export interface PredictiveData {
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
