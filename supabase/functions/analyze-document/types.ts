
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

export interface FormField {
  name: string;
  type: 'text' | 'date' | 'currency' | 'number' | 'boolean' | 'multiline' | 'select';
  required: boolean;
  description?: string;
  pattern?: string;
  options?: string[]; // For select type fields
  validationRules?: ValidationRule[];
  regulatoryReferences?: {
    bia?: string[];
    ccaa?: string[];
    osb?: string[];
  };
}

export interface ValidationRule {
  rule: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'validDate' | 'currency' | 'custom';
  message: string;
  params?: any;
}

export interface FormTemplate {
  formNumber: string;
  title?: string;
  description?: string;
  category: 'bankruptcy' | 'proposal' | 'receivership' | 'ccaa' | 'administrative';
  requiredFields: FormField[];
  validationRules?: Record<string, ValidationRule[]>;
  fieldMappings?: Record<string, string[]>;
  regulatoryFramework?: {
    bia?: string[];
    ccaa?: string[];
    osb?: string[];
  };
}

// Re-export validation types
export type { ValidationError, CrossValidationRule, ComplianceResult } from './validation/types.ts';
