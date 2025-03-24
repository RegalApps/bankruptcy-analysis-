
import { useState, useEffect } from 'react';

interface OperationalMetrics {
  avgCasesPerStaff: number;
  targetCasesPerStaff: number;
  taskCompletionRate: number;
  avgResponseHours: number;
  processEfficiency: number;
  previousEfficiency: number;
}

interface StaffProductivity {
  name: string;
  activeCases: number;
  completedCases: number;
}

interface TaskCompletion {
  week: string;
  completionRate: number;
  responseTime: number;
}

interface ProcessingTime {
  process: string;
  current: number;
  target: number;
}

interface Bottleneck {
  stage: string;
  delay: number;
  impact: string;
  trend: string;
}

export const useOperationalData = () => {
  const [operationalMetrics, setOperationalMetrics] = useState<OperationalMetrics>({
    avgCasesPerStaff: 0,
    targetCasesPerStaff: 0,
    taskCompletionRate: 0,
    avgResponseHours: 0,
    processEfficiency: 0,
    previousEfficiency: 0
  });

  const [staffProductivityData, setStaffProductivityData] = useState<StaffProductivity[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<TaskCompletion[]>([]);
  const [processingTimeData, setProcessingTimeData] = useState<ProcessingTime[]>([]);
  const [workflowBottlenecks, setWorkflowBottlenecks] = useState<Bottleneck[]>([]);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Set operational metrics
    setOperationalMetrics({
      avgCasesPerStaff: 24,
      targetCasesPerStaff: 20,
      taskCompletionRate: 87,
      avgResponseHours: 18,
      processEfficiency: 83,
      previousEfficiency: 79
    });

    // Set staff productivity data
    setStaffProductivityData([
      { name: 'John D.', activeCases: 28, completedCases: 12 },
      { name: 'Sarah M.', activeCases: 23, completedCases: 15 },
      { name: 'Robert K.', activeCases: 25, completedCases: 11 },
      { name: 'Emma L.', activeCases: 19, completedCases: 14 },
      { name: 'Michael T.', activeCases: 27, completedCases: 9 },
      { name: 'Jessica W.', activeCases: 22, completedCases: 13 }
    ]);

    // Set task completion data
    setTaskCompletionData([
      { week: 'Week 1', completionRate: 82, responseTime: 22 },
      { week: 'Week 2', completionRate: 84, responseTime: 20 },
      { week: 'Week 3', completionRate: 85, responseTime: 19 },
      { week: 'Week 4', completionRate: 87, responseTime: 18 },
      { week: 'Week 5', completionRate: 86, responseTime: 17 },
      { week: 'Week 6', completionRate: 88, responseTime: 16 },
      { week: 'Week 7', completionRate: 89, responseTime: 15 },
      { week: 'Week 8', completionRate: 91, responseTime: 14 }
    ]);

    // Set processing time data
    setProcessingTimeData([
      { process: 'Document Review', current: 5, target: 3 },
      { process: 'Form Filing', current: 8, target: 6 },
      { process: 'Client Approval', current: 12, target: 8 },
      { process: 'Financial Assessment', current: 15, target: 10 },
      { process: 'Court Submission', current: 10, target: 7 },
      { process: 'Creditor Negotiation', current: 22, target: 15 }
    ]);

    // Set workflow bottlenecks
    setWorkflowBottlenecks([
      { stage: 'Creditor Documentation', delay: 12.5, impact: 'High', trend: '↑ Increasing' },
      { stage: 'Court Filing', delay: 8.2, impact: 'Medium', trend: '↓ Decreasing' },
      { stage: 'Client Document Collection', delay: 9.7, impact: 'High', trend: '→ Stable' },
      { stage: 'Financial Assessment', delay: 5.3, impact: 'Medium', trend: '↓ Decreasing' },
      { stage: 'Trustee Review', delay: 3.1, impact: 'Low', trend: '→ Stable' }
    ]);

  }, []);

  return {
    operationalMetrics,
    staffProductivityData,
    taskCompletionData,
    processingTimeData,
    workflowBottlenecks
  };
};
