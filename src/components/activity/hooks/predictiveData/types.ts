
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
}

export interface InsightDataResponse {
  status: string;
  data: ClientInsightData;
}
