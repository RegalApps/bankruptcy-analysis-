
import { Client } from "../../types";

export interface PredictiveData {
  processedData: any[];
  metrics: {
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
    seasonalityScore?: number | null;
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

export interface ClientInsightData {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  complianceStatus: 'compliant' | 'issues' | 'critical';
  pendingTasks: number;
  missingDocuments: number;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  recentActivities: Array<{
    id: string;
    action: string;
    timestamp: string;
    type: 'document' | 'meeting' | 'payment' | 'communication';
  }>;
  aiSuggestions: Array<{
    id: string;
    message: string;
    type: 'urgent' | 'warning' | 'info';
    action?: string;
  }>;
  caseProgress: number;
  financialHealth: {
    score: number;
    status: 'improving' | 'stable' | 'declining';
    trend: number;
  };
}
