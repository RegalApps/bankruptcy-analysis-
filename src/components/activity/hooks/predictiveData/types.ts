
export interface ClientInsightData {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  complianceStatus: 'compliant' | 'issues' | 'critical';
  caseProgress: number;
  pendingTasks: {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  missingDocuments: string[];
  recentActivities: {
    id: string;
    type: string;
    action: string;
    timestamp: string;
  }[];
  aiSuggestions: {
    id: string;
    type: 'urgent' | 'warning' | 'info';
    message: string;
    action?: string;
  }[];
  // New fields for enhanced client profile
  clientProfile?: {
    email: string;
    phone: string;
    website?: string;
    company?: string;
    role?: string;
    assignedAgent?: string;
    avatarUrl?: string;
    tags?: string[];
  };
  clientNotes?: {
    title: string;
    content: string;
    timestamp: string;
    attachments?: string[];
  }[];
  milestones?: {
    name: string;
    completed: boolean;
  }[];
  // Adding upcomingDeadlines field to fix the error
  upcomingDeadlines: {
    id: string;
    title: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface InsightDataResponse {
  status: string;
  data: ClientInsightData;
}

// Adding missing AdvancedRiskMetrics type
export interface AdvancedRiskMetrics {
  riskLevel: 'low' | 'medium' | 'high';
  overallRiskScore: number;
  primaryRiskFactor: string;
  detailedRiskScores: {
    creditUtilization: number;
    debtToIncome: number;
    emergencyFund: number;
    incomeStability: number;
    expenseVolatility: number;
  };
  scenarioAnalysis: {
    bestCase: {
      surplusIncrease: string;
      debtReduction: string;
      timeFrame: string;
    };
    worstCase: {
      surplusDecrease: string;
      debtIncrease: string;
      recoveryTime: string;
    };
  };
  improvementSuggestions: string[];
  opportunities: {
    id: string;
    type: 'saving' | 'growth';
    title: string;
    description: string;
    potentialSavings?: string;
    potentialGains?: string;
    confidence: string;
  }[];
}

// Adding missing PredictiveData interface
export interface PredictiveData {
  isLoading: boolean;
  processedData: any[];
  metrics: any;
  lastRefreshed: Date | null;
  financialRecords: any[];
  categoryAnalysis: any[];
  advancedRiskMetrics: AdvancedRiskMetrics | null;
  refetch: () => void;
}
