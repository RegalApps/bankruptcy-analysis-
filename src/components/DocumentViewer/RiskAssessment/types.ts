
export interface Risk {
  id?: string;
  type: string;
  title?: string;
  description: string;
  severity: "low" | "medium" | "high";
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
  position?: {
    page?: number;
    rect?: number[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export interface RiskAssessmentProps {
  documentId: string;
  risks: Risk[];
  isLoading?: boolean;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
}
