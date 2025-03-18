
import { useState, useEffect } from "react";

// Meeting Efficiency Data Types
export interface MeetingEfficiencyData {
  monthlyTrends: Array<{
    month: string;
    avgDuration: number;
    targetDuration: number;
    completionRate: number;
  }>;
  meetingTypes: Array<{
    type: string;
    avgDuration: number;
    targetDuration: number;
    efficiency: number;
  }>;
  preparationStats: {
    withPreparation: number;
    withoutPreparation: number;
    improvementPercentage: number;
  };
}

// Client Engagement Data Types
export interface ClientEngagementData {
  overallScore: number;
  byClientType: Array<{
    clientType: string;
    score: number;
    count: number;
  }>;
  trendData: Array<{
    month: string;
    score: number;
    meetings: number;
  }>;
  factors: Array<{
    factor: string;
    impact: number;
    recommendation: string;
  }>;
}

// Trustee Workload Data Types
export interface TrusteeWorkloadData {
  distribution: Array<{
    name: string;
    hours: number;
    clients: number;
    meetings: number;
    capacity: number;
  }>;
  imbalanceScore: number;
  recommendations: Array<{
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// Time Allocation Data Types
export interface TimeAllocationData {
  byActivity: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  trends: Array<{
    month: string;
    clientMeetings: number;
    adminTasks: number;
    documentation: number;
    otherActivities: number;
  }>;
  recommendations: Array<{
    area: string;
    current: number;
    recommended: number;
    potentialImpact: string;
  }>;
}

export const useMeetingEfficiencyData = () => {
  const [data, setData] = useState<MeetingEfficiencyData>({
    monthlyTrends: [],
    meetingTypes: [],
    preparationStats: {
      withPreparation: 0,
      withoutPreparation: 0,
      improvementPercentage: 0
    }
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData({
        monthlyTrends: [
          { month: 'Jan', avgDuration: 65, targetDuration: 60, completionRate: 92 },
          { month: 'Feb', avgDuration: 61, targetDuration: 60, completionRate: 94 },
          { month: 'Mar', avgDuration: 58, targetDuration: 60, completionRate: 95 },
          { month: 'Apr', avgDuration: 57, targetDuration: 60, completionRate: 96 },
          { month: 'May', avgDuration: 55, targetDuration: 60, completionRate: 97 },
          { month: 'Jun', avgDuration: 53, targetDuration: 60, completionRate: 98 },
        ],
        meetingTypes: [
          { type: 'Initial Consultation', avgDuration: 62, targetDuration: 60, efficiency: 0.94 },
          { type: 'Document Collection', avgDuration: 42, targetDuration: 45, efficiency: 0.96 },
          { type: 'Proposal Filing', avgDuration: 88, targetDuration: 90, efficiency: 0.98 },
          { type: 'Credit Counseling', avgDuration: 61, targetDuration: 60, efficiency: 0.95 },
          { type: 'Follow-up', avgDuration: 27, targetDuration: 30, efficiency: 0.99 }
        ],
        preparationStats: {
          withPreparation: 93,
          withoutPreparation: 76,
          improvementPercentage: 22
        }
      });
    }, 500);
  }, []);

  return data;
};

export const useClientEngagementData = () => {
  const [data, setData] = useState<ClientEngagementData>({
    overallScore: 0,
    byClientType: [],
    trendData: [],
    factors: []
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData({
        overallScore: 87,
        byClientType: [
          { clientType: 'Consumer Proposal', score: 91, count: 68 },
          { clientType: 'Bankruptcy', score: 82, count: 42 },
          { clientType: 'Debt Consolidation', score: 89, count: 35 },
          { clientType: 'Credit Counseling', score: 94, count: 23 }
        ],
        trendData: [
          { month: 'Jan', score: 83, meetings: 42 },
          { month: 'Feb', score: 84, meetings: 38 },
          { month: 'Mar', score: 85, meetings: 45 },
          { month: 'Apr', score: 86, meetings: 51 },
          { month: 'May', score: 86, meetings: 48 },
          { month: 'Jun', score: 87, meetings: 56 }
        ],
        factors: [
          { 
            factor: 'Pre-meeting preparation', 
            impact: 0.32, 
            recommendation: 'Send detailed agendas 48 hours in advance' 
          },
          { 
            factor: 'Follow-up communication', 
            impact: 0.27, 
            recommendation: 'Implement 24-hour follow-up contact protocol' 
          },
          { 
            factor: 'Meeting duration', 
            impact: 0.22, 
            recommendation: 'Aim for 45-60 minute meetings for optimal engagement' 
          },
          { 
            factor: 'Time of day', 
            impact: 0.19, 
            recommendation: 'Schedule important meetings between 10am-2pm when possible' 
          }
        ]
      });
    }, 500);
  }, []);

  return data;
};

export const useTrusteeWorkloadData = () => {
  const [data, setData] = useState<TrusteeWorkloadData>({
    distribution: [],
    imbalanceScore: 0,
    recommendations: []
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData({
        distribution: [
          { name: 'John Smith', hours: 37, clients: 28, meetings: 21, capacity: 0.92 },
          { name: 'Sarah Johnson', hours: 32, clients: 24, meetings: 18, capacity: 0.80 },
          { name: 'Michael Thompson', hours: 41, clients: 31, meetings: 24, capacity: 1.02 },
          { name: 'Emily Davis', hours: 29, clients: 22, meetings: 15, capacity: 0.73 },
          { name: 'Robert Wilson', hours: 35, clients: 26, meetings: 20, capacity: 0.88 },
        ],
        imbalanceScore: 0.24,
        recommendations: [
          {
            description: 'Redistribute 4 clients from Michael to Emily',
            impact: 'Would reduce imbalance score to 0.15 and optimize capacity utilization',
            priority: 'high'
          },
          {
            description: 'Schedule more morning meetings for Sarah',
            impact: 'Could increase productivity by 12% based on past performance patterns',
            priority: 'medium'
          },
          {
            description: 'Consider hiring additional part-time support for peak periods',
            impact: 'Would reduce overall capacity strain during high-volume months',
            priority: 'low'
          }
        ]
      });
    }, 500);
  }, []);

  return data;
};

export const useTimeAllocationData = () => {
  const [data, setData] = useState<TimeAllocationData>({
    byActivity: [],
    trends: [],
    recommendations: []
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData({
        byActivity: [
          { name: 'Client Meetings', value: 42, color: '#0ea5e9' },
          { name: 'Documentation', value: 28, color: '#f97316' },
          { name: 'Administrative Tasks', value: 18, color: '#8b5cf6' },
          { name: 'Client Follow-up', value: 8, color: '#22c55e' },
          { name: 'Other Activities', value: 4, color: '#64748b' }
        ],
        trends: [
          { month: 'Jan', clientMeetings: 39, adminTasks: 20, documentation: 30, otherActivities: 11 },
          { month: 'Feb', clientMeetings: 40, adminTasks: 19, documentation: 29, otherActivities: 12 },
          { month: 'Mar', clientMeetings: 40, adminTasks: 18, documentation: 29, otherActivities: 13 },
          { month: 'Apr', clientMeetings: 41, adminTasks: 19, documentation: 28, otherActivities: 12 },
          { month: 'May', clientMeetings: 41, adminTasks: 18, documentation: 28, otherActivities: 13 },
          { month: 'Jun', clientMeetings: 42, adminTasks: 18, documentation: 28, otherActivities: 12 }
        ],
        recommendations: [
          { 
            area: 'Administrative Tasks', 
            current: 18, 
            recommended: 12, 
            potentialImpact: 'Could free up 6% more time for client-facing activities' 
          },
          { 
            area: 'Documentation', 
            current: 28, 
            recommended: 22, 
            potentialImpact: 'Automation could reduce documentation time by 21%' 
          },
          { 
            area: 'Client Meetings', 
            current: 42, 
            recommended: 50, 
            potentialImpact: 'Increasing client meeting time could improve case resolution rates by 14%' 
          }
        ]
      });
    }, 500);
  }, []);

  return data;
};
