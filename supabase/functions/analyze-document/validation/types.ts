
export interface ValidationError {
  field: string;
  type: 'error' | 'warning' | 'regulatory';
  message: string;
  code: string;
  context?: Record<string, any>;
  regulation?: {
    framework: string;
    section: string;
    severity?: 'critical' | 'major' | 'minor';
    remediation?: string;
    dueDate?: Date;
  };
  metadata?: {
    timestamp: Date;
    source: string;
    validationType: string;
    impactLevel: 'high' | 'medium' | 'low';
  };
}

export interface CrossValidationRule {
  fields: string[];
  validate: (values: Record<string, any>) => ValidationError[];
  category: string;
  metadata?: {
    description: string;
    applicableFrameworks: string[];
    lastUpdated: Date;
    version: string;
  };
}

export interface ComplianceResult {
  compliant: boolean;
  message: string;
  details?: {
    framework: string;
    section: string;
    requirement: string;
    status: 'compliant' | 'non_compliant' | 'pending';
    nextReviewDate?: Date;
    remediationSteps?: string[];
  };
}
