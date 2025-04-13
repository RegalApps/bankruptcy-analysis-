
export interface Risk {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  deadline?: string;
}

export interface ExtractedInfo {
  clientName?: string;
  formNumber?: string;
  formType?: string;
  trusteeName?: string;
  administratorName?: string;
  dateSigned?: string;
  filingDate?: string;
  submissionDeadline?: string;
  documentStatus?: string;
  summary?: string;
  // Adding additional fields needed for the mock data
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  trusteeAddress?: string;
  trusteePhone?: string;
  trusteeEmail?: string;
  type?: string;
  totalDebts?: string;
  totalAssets?: string;
  monthlyIncome?: string;
  estateNumber?: string;
}

export interface RegulatoryCompliance {
  status: 'compliant' | 'non_compliant' | 'needs_review';
  details: string;
  references?: string[];
}

export interface AnalysisResult {
  structureValid?: boolean;
  requiredFieldsPresent?: boolean;
  signaturesValid?: boolean;
  risks: Risk[];
  extracted_info: ExtractedInfo;
  regulatory_compliance?: RegulatoryCompliance;
}
