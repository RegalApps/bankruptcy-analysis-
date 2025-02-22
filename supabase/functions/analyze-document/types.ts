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

export interface OSBFormField extends FormField {
  osbReference: string; // Reference to OSB directive or guideline
  formNumbers: string[]; // Which forms this field appears in
}

export interface OSBFormTemplate extends FormTemplate {
  formNumber: string; // Official OSB form number (1-96)
  category: 'bankruptcy' | 'proposal' | 'receivership' | 'ccaa' | 'administrative';
  subcategory?: 
    | 'consumer_bankruptcy'
    | 'business_bankruptcy'
    | 'consumer_proposal'
    | 'division_1_proposal'
    | 'receivership_appointment'
    | 'receivership_report'
    | 'ccaa_initial'
    | 'ccaa_monitor'
    | 'administrative_general';
  purpose: string;
  relatedForms: string[];
  clientInfoFields: string[];
  keyDates: string[];
  monetaryFields: string[];
  riskIndicators: {
    field: string;
    riskType: 'financial' | 'compliance' | 'legal' | 'operational';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface OSBFormAnalysis {
  formNumber: string;
  formType: string;
  clientInfo: {
    name?: string;
    address?: string;
    estateName?: string;
    estateNumber?: string;
    district?: string;
    division?: string;
  };
  keyDates: {
    filingDate?: string;
    eventDate?: string;
    deadlineDate?: string;
    meetingDate?: string;
  };
  monetaryValues: {
    [key: string]: number;
  };
  risks: {
    type: 'financial' | 'compliance' | 'legal' | 'operational';
    severity: 'low' | 'medium' | 'high';
    description: string;
    impact: string;
    mitigation?: string;
  }[];
  compliance: {
    status: 'compliant' | 'non_compliant' | 'needs_review';
    issues: string[];
    recommendations: string[];
  };
  trusteeActions: {
    required: string[];
    recommended: string[];
    deadlines: string[];
  };
}

export type { ValidationError, CrossValidationRule, ComplianceResult } from './validation/types.ts';
