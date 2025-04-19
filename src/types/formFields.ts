
/**
 * Type definitions for form field mapping and validation across OSB forms
 */

export type FieldType = 
  | 'text' 
  | 'textArea'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'signature'
  | 'attachment'
  | 'staticText';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ValidationRule {
  type: 'required' | 'format' | 'match' | 'range' | 'custom';
  message: string;
  severity: RiskSeverity;
  validate: (value: any, formData?: any) => boolean;
  regulation?: string;
}

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  section: string;
  quadrant?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  validationRules?: ValidationRule[];
  options?: { label: string; value: string }[];
  condition?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  };
  metadata?: {
    legalSchema?: string;
    riskIndicators?: string[];
    uiBehavior?: 'static' | 'dynamic' | 'conditional';
    pdfLocation?: { x: number; y: number; width?: number; height?: number };
    fieldSource?: string;
    systemAction?: string[];
    form11Mapping?: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  formNumber: string;
  category: string;
  sections: FormSection[];
  validationRules?: Array<(formData: any) => { valid: boolean; message: string; severity: RiskSeverity }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: RiskSeverity;
    regulation?: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    severity: RiskSeverity;
    regulation?: string;
  }>;
}

export interface FormFieldMappingResult {
  mappedFields: Record<string, any>;
  missingRequiredFields: string[];
  validationIssues: Array<{
    field: string;
    message: string;
    severity: RiskSeverity;
  }>;
}
