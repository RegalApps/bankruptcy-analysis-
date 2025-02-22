
export interface LegalReference {
  source: 'BIA' | 'CCAA' | 'OSB' | 'DIRECTIVE';
  referenceNumber: string;
  title: string;
  description: string;
  relevantSections: string[];
}

export interface RiskAssessment {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  legalReferences: LegalReference[];
  impactAnalysis: string;
  recommendedActions: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'needs_review';
}

export interface ValidationResult {
  field: string;
  status: 'valid' | 'invalid' | 'warning';
  message: string;
  legalReferences?: LegalReference[];
}

export interface AnalysisResult {
  formNumber: string | null;
  extractedFields: Record<string, any>;
  validationResults: ValidationResult[];
  riskAssessment: RiskAssessment[];
  legalCompliance: {
    status: 'compliant' | 'non_compliant' | 'needs_review';
    details: Record<string, any>;
  };
  narrativeSummary: string;
  confidenceScore: number;
  status: 'success' | 'partial' | 'failed';
}
