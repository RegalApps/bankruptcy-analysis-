
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
