
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact?: string;
  requiredAction?: string;
  solution?: string;
  regulation?: string;
  reference?: string;
  deadline?: string;
  biaReference?: string;
  biaDescription?: string;
  directiveReference?: string;
  directiveDescription?: string;
}

export interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
}
