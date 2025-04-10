
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
  metadata?: Record<string, any>;
}

export interface RiskAssessmentProps {
  documentId: string;
  risks?: Risk[];
  isLoading?: boolean;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export interface Form47Risk extends Risk {
  status?: 'pending' | 'in_progress' | 'resolved';
  assignedTo?: string;
  paymentScheduleAffected?: boolean;
  complianceSection?: string;
  documentationRequirement?: string;
  deadlineStatus?: 'upcoming' | 'immediate' | 'overdue';
}

export interface Form76Risk extends Risk {
  signatureRequired?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface Form31Risk extends Risk {
  section?: string;
  biaReference?: string;
  details?: string;
  isResolved?: boolean;
  riskCategory?: 'section4' | 'section5' | 'section6' | 'date' | 'trustee' | 'schedule' | 'other';
}

// Add GreenTech specific types
export interface GreenTechRisk extends Form31Risk {
  // Specific fields for GreenTech risks
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  documentSection?: string;
}

export interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
  onRiskSelect?: (riskId: string | null) => void;
  activeRiskId?: string | null;
}

// Update Form47RiskViewProps interface to include activeRiskId and onRiskSelect
export interface Form47RiskViewProps {
  risks: Risk[];
  documentId: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}
