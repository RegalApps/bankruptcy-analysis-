
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact?: string;
  requiredAction?: string;
  solution?: string;
  regulation?: string;
  reference?: string;
  deadline?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page?: number;
    rect?: number[];
  };
  id?: string; // Adding ID for easier reference
  metadata?: {
    section?: string;
  };
}

export interface RegulatoryCompliance {
  status: 'compliant' | 'non_compliant' | 'needs_review' | 'error';
  details: string;
  references: string[];
}

export interface ExtractedInfo {
  formType?: string;
  formNumber?: string;
  clientName?: string;
  creditorName?: string;
  creditorMailingAddress?: string;
  creditorEmail?: string;
  contactPersonName?: string;
  contactTelephone?: string;
  debtorName?: string;
  debtorCity?: string;
  debtorProvince?: string;
  debtAmount?: string;
  executionDate?: string;
  documentStatus?: string;
  trusteeName?: string;
  dateSigned?: string;
  summary?: string;
  administratorName?: string;
  filingDate?: string;
  submissionDeadline?: string;
  estimatedCompletion?: string;
  lastUpdated?: string;
  estateNumber?: string;
  district?: string;
  // Form 31 specific fields - Certifier Declaration
  certifierName?: string;
  representativeAuthority?: boolean;
  debtValidityDate?: string;
  statuteBarredStatus?: boolean;
  // Form 31 specific fields - Debt Particulars
  debtDueDate?: string;
  lastPaymentDate?: string;
  lastAcknowledgementDate?: string;
  claimHistory?: string;
  // Form 31 specific fields - Claim Categories
  claimCategory?: string;
  unsecuredAmount?: string;
  prioritySubsection?: string;
  priorityJustification?: string;
  leaseAmount?: string;
  leaseParticulars?: string;
  securedAmount?: string;
  securityValue?: string;
  securityDocumentation?: string;
  agriculturalAmount?: string;
  wageArrearsAmount?: string;
  employmentPeriod?: string;
  pensionArrearsAmount?: string;
  directorLiabilityAmount?: string;
  netEquityAmount?: string;
  // Form 31 specific fields - Relationship & Transactions
  relatedToDebtor?: boolean;
  nonArmsLengthTransactions?: boolean;
  transfersAtUndervalue?: string;
  // Form 31 specific fields - Bankruptcy Requests
  surplusIncomeNotification?: boolean;
  trusteeDischargeReport?: boolean;
  [key: string]: any;
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  regulatoryReferences?: Record<string, string[]>;
}

export interface AnalysisResult {
  structureValid?: boolean;
  requiredFieldsPresent?: boolean;
  signaturesValid?: boolean;
  extracted_info: ExtractedInfo;
  risks?: Risk[];
  regulatory_compliance?: RegulatoryCompliance;
}
