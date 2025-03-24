
import { useState, useEffect } from 'react';

interface ClientMetrics {
  activeClients: number;
  newClientsMonthly: number;
  previousMonthNewClients: number;
  avgCompletionDays: number;
  previousAvgCompletionDays: number; 
  satisfactionScore: number;
  churnRate: number;
}

interface CaseStatusData {
  name: string;
  value: number;
}

interface ClientAcquisitionData {
  month: string;
  clients: number;
  target: number;
}

interface CaseCompletionData {
  type: string;
  days: number;
  target: number;
}

interface SatisfactionData {
  month: string;
  nps: number;
  churn: number;
}

export const useClientManagementData = () => {
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics>({
    activeClients: 0,
    newClientsMonthly: 0,
    previousMonthNewClients: 0,
    avgCompletionDays: 0,
    previousAvgCompletionDays: 0,
    satisfactionScore: 0,
    churnRate: 0
  });

  const [casesByStatus, setCasesByStatus] = useState<CaseStatusData[]>([]);
  const [clientAcquisitionTrend, setClientAcquisitionTrend] = useState<ClientAcquisitionData[]>([]);
  const [caseCompletionTimes, setCaseCompletionTimes] = useState<CaseCompletionData[]>([]);
  const [clientChurnRate, setClientChurnRate] = useState<any[]>([]);
  const [satisfactionScores, setSatisfactionScores] = useState<SatisfactionData[]>([]);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Set client metrics
    setClientMetrics({
      activeClients: 487,
      newClientsMonthly: 42,
      previousMonthNewClients: 38,
      avgCompletionDays: 124,
      previousAvgCompletionDays: 131,
      satisfactionScore: 8.6,
      churnRate: 1.8
    });

    // Set cases by status
    setCasesByStatus([
      { name: 'Filed', value: 125 },
      { name: 'Pending', value: 184 },
      { name: 'In Progress', value: 93 },
      { name: 'Completed', value: 67 },
      { name: 'Discharged', value: 18 }
    ]);

    // Set client acquisition trend
    setClientAcquisitionTrend([
      { month: 'Jan', clients: 32, target: 30 },
      { month: 'Feb', clients: 28, target: 30 },
      { month: 'Mar', clients: 35, target: 30 },
      { month: 'Apr', clients: 39, target: 35 },
      { month: 'May', clients: 36, target: 35 },
      { month: 'Jun', clients: 33, target: 35 },
      { month: 'Jul', clients: 37, target: 35 },
      { month: 'Aug', clients: 41, target: 40 },
      { month: 'Sep', clients: 38, target: 40 },
      { month: 'Oct', clients: 43, target: 40 },
      { month: 'Nov', clients: 45, target: 40 },
      { month: 'Dec', clients: 42, target: 40 }
    ]);

    // Set case completion times
    setCaseCompletionTimes([
      { type: 'Bankruptcy', days: 180, target: 160 },
      { type: 'Consumer Proposal', days: 92, target: 90 },
      { type: 'Debt Counseling', days: 45, target: 40 },
      { type: 'Credit Rebuilding', days: 210, target: 200 }
    ]);

    // Set satisfaction scores and churn rates
    setSatisfactionScores([
      { month: 'Jul', nps: 8.2, churn: 2.1 },
      { month: 'Aug', nps: 8.3, churn: 2.0 },
      { month: 'Sep', nps: 8.4, churn: 1.9 },
      { month: 'Oct', nps: 8.5, churn: 1.8 },
      { month: 'Nov', nps: 8.6, churn: 1.7 },
      { month: 'Dec', nps: 8.7, churn: 1.6 }
    ]);

  }, []);

  return {
    clientMetrics,
    casesByStatus,
    clientAcquisitionTrend,
    caseCompletionTimes,
    clientChurnRate,
    satisfactionScores
  };
};
