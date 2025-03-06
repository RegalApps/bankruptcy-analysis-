
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
