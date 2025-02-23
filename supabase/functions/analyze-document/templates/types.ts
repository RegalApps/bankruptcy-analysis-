
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
  requiredFields: RequiredField[];
  riskIndicators: RiskIndicator[];
}

interface RequiredField {
  name: string;
  type: 'text' | 'date' | 'currency' | 'number' | 'boolean' | 'multiline' | 'select';
  required: boolean;
  osbReference?: string;
  directives?: string[];
  formNumbers: string[];
  description: string;
}

interface RiskIndicator {
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
}
