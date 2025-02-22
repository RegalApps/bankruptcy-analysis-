
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
export type { ValidationError, CrossValidationRule, ComplianceResult } from './validation/types';
