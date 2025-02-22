
export interface ValidationError {
  field: string;
  type: 'error' | 'warning' | 'regulatory';
  message: string;
  code: string;
  context?: Record<string, any>;
  regulation?: {
    framework: string;
    section: string;
  };
}

export interface CrossValidationRule {
  fields: string[];
  validate: (values: Record<string, any>) => ValidationError[];
  category: string;
}

export interface ComplianceResult {
  compliant: boolean;
  message: string;
}
