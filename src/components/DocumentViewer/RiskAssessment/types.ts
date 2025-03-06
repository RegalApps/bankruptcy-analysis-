
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
}

export interface RiskAssessmentProps {
  documentId: string;
  risks?: Risk[];
  isLoading?: boolean;
}

export interface Form47Risk extends Risk {
  status?: 'pending' | 'in_progress' | 'resolved';
  assignedTo?: string;
}

export interface Form76Risk extends Risk {
  signatureRequired?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}
