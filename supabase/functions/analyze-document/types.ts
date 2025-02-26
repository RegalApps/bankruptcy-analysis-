
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

export interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  errorType: 'error' | 'warning';
  errorMessage: string;
  errorCode: string;
}

export interface RiskIndicator {
  field: string;
  threshold?: number;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
}

export interface Risk {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  reference?: string;
}

export interface OSBFormTemplate {
  formNumber: string;
  title: string;
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
    | 'administrative_general'
    | 'discharge'
    | 'annulment'
    | 'dividend'
    | 'mediation';
  purpose: string;
  relatedForms: string[];
  clientInfoFields: string[];
  keyDates: string[];
  monetaryFields: string[];
  requiredFields: {
    name: string;
    type: 'text' | 'date' | 'currency' | 'number' | 'boolean' | 'multiline' | 'select';
    required: boolean;
    osbReference?: string;
    directives?: string[];
    formNumbers: string[];
    description: string;
  }[];
  riskIndicators: {
    field: string;
    riskType: 'regulatory' | 'financial' | 'compliance';
    severity: 'low' | 'medium' | 'high';
    description: string;
    regulation?: string;
    directive?: string;
    threshold?: {
      type: 'days' | 'percentage' | 'amount';
      value: number;
      comparison: 'minimum' | 'maximum' | 'exact';
      baseline?: string;
    };
  }[];
}
