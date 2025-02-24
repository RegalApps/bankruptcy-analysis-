
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact?: string;
  requiredAction?: string;
  solution?: string;
  regulation?: string;
  reference?: string;
}

export interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
}
