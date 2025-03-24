
import { useState, useEffect } from 'react';

interface ComplianceMetrics {
  complianceRate: number;
  highRiskCases: number;
  previousHighRiskCases: number;
  auditsCompleted: number;
  auditTarget: number;
  avgResolutionDays: number;
  previousResolutionDays: number;
}

interface ComplianceHistory {
  month: string;
  rate: number;
  target: number;
}

interface RiskDistribution {
  name: string;
  value: number;
}

interface AuditData {
  date: string;
  type: string;
  issuesFound: number;
  status: string;
}

interface ComplianceBreach {
  month: string;
  documentation: number;
  deadlines: number;
  financials: number;
  other: number;
}

interface RiskTrend {
  month: string;
  high: number;
  medium: number;
  low: number;
}

export const useComplianceData = () => {
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics>({
    complianceRate: 0,
    highRiskCases: 0,
    previousHighRiskCases: 0,
    auditsCompleted: 0,
    auditTarget: 0,
    avgResolutionDays: 0,
    previousResolutionDays: 0
  });

  const [complianceRateHistory, setComplianceRateHistory] = useState<ComplianceHistory[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([]);
  const [auditData, setAuditData] = useState<AuditData[]>([]);
  const [complianceBreaches, setComplianceBreaches] = useState<ComplianceBreach[]>([]);
  const [riskTrends, setRiskTrends] = useState<RiskTrend[]>([]);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Set compliance metrics
    setComplianceMetrics({
      complianceRate: 93,
      highRiskCases: 18,
      previousHighRiskCases: 22,
      auditsCompleted: 12,
      auditTarget: 12,
      avgResolutionDays: 5,
      previousResolutionDays: 7
    });

    // Set compliance rate history
    setComplianceRateHistory([
      { month: 'Jan', rate: 88, target: 95 },
      { month: 'Feb', rate: 89, target: 95 },
      { month: 'Mar', rate: 90, target: 95 },
      { month: 'Apr', rate: 91, target: 95 },
      { month: 'May', rate: 92, target: 95 },
      { month: 'Jun', rate: 93, target: 95 },
      { month: 'Jul', rate: 93, target: 95 },
      { month: 'Aug', rate: 94, target: 95 },
      { month: 'Sep', rate: 94, target: 95 },
      { month: 'Oct', rate: 95, target: 95 },
      { month: 'Nov', rate: 95, target: 95 },
      { month: 'Dec', rate: 96, target: 95 }
    ]);

    // Set risk distribution
    setRiskDistribution([
      { name: 'Low Risk', value: 318 },
      { name: 'Medium Risk', value: 124 },
      { name: 'High Risk', value: 18 },
      { name: 'Critical', value: 3 }
    ]);

    // Set audit data
    setAuditData([
      { date: '2023-12-15', type: 'Document Compliance', issuesFound: 3, status: 'Completed' },
      { date: '2023-11-28', type: 'Financial Reporting', issuesFound: 1, status: 'Completed' },
      { date: '2023-11-10', type: 'Process Adherence', issuesFound: 5, status: 'Completed' },
      { date: '2023-10-22', type: 'Client Communication', issuesFound: 2, status: 'Completed' },
      { date: '2023-10-05', type: 'Regulatory Compliance', issuesFound: 4, status: 'Completed' },
      { date: '2023-09-18', type: 'Document Compliance', issuesFound: 3, status: 'Completed' }
    ]);

    // Set compliance breaches
    setComplianceBreaches([
      { month: 'Jul', documentation: 6, deadlines: 4, financials: 2, other: 1 },
      { month: 'Aug', documentation: 5, deadlines: 3, financials: 3, other: 2 },
      { month: 'Sep', documentation: 4, deadlines: 4, financials: 2, other: 1 },
      { month: 'Oct', documentation: 3, deadlines: 3, financials: 2, other: 1 },
      { month: 'Nov', documentation: 3, deadlines: 2, financials: 1, other: 1 },
      { month: 'Dec', documentation: 2, deadlines: 2, financials: 1, other: 0 }
    ]);

    // Set risk trends
    setRiskTrends([
      { month: 'Jan', high: 26, medium: 102, low: 284 },
      { month: 'Feb', high: 24, medium: 108, low: 290 },
      { month: 'Mar', high: 22, medium: 112, low: 298 },
      { month: 'Apr', high: 23, medium: 115, low: 305 },
      { month: 'May', high: 22, medium: 118, low: 312 },
      { month: 'Jun', high: 20, medium: 120, low: 320 },
      { month: 'Jul', high: 19, medium: 122, low: 326 },
      { month: 'Aug', high: 18, medium: 123, low: 328 },
      { month: 'Sep', high: 19, medium: 122, low: 330 },
      { month: 'Oct', high: 18, medium: 124, low: 334 },
      { month: 'Nov', high: 17, medium: 124, low: 336 },
      { month: 'Dec', high: 18, medium: 124, low: 318 }
    ]);

  }, []);

  return {
    complianceMetrics,
    complianceRateHistory,
    riskDistribution,
    auditData,
    complianceBreaches,
    riskTrends
  };
};
