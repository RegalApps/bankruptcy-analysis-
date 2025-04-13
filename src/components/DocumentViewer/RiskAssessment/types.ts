
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
  metadata?: {
    section?: string;
    details?: string;
    biaReference?: string;
    clientName?: string;
    position?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      page?: number;
      rect?: number[];
    };
  };
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

export interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
  onRiskSelect?: (riskId: string) => void;
  activeRiskId?: string | null;
}

export interface Form47RiskViewProps {
  risks: Risk[];
  documentId: string;
  onRiskSelect?: (riskId: string) => void;
  activeRiskId?: string | null;
}

// Alias for Form47 risks
export type Form47Risk = Risk;

// Alias for GreenTech risks
export type GreenTechRisk = Risk;

// Form 31 specific risk type with BIA specific fields
export interface Form31Risk extends Risk {
  biaSection?: string;
  complianceDetails?: {
    requirement: string;
    statusDetails: string;
    remediation: string;
  };
  formSection?: {
    name: string;
    fieldName: string;
    requiredAction: string;
  };
}
