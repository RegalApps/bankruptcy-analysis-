
export interface RegulatoryCompliance {
  status: "needs_review" | "compliant" | "non_compliant";
  details: string;
  references: string[];
}

export interface ExtractedInfo {
  clientName?: string;
  formNumber?: string;
  formType?: string;
  trusteeName?: string;
  dateSigned?: string;
  summary?: string;
  submissionDeadline?: string;
  documentStatus?: string;
  // Form 31 specific fields - Creditor Contact Info
  creditorMailingAddress?: string;
  creditorEmail?: string;
  contactPersonName?: string;
  contactTelephone?: string;
  // Form 31 specific fields - Matter Identification
  debtorName?: string;
  debtorCity?: string;
  debtorProvince?: string;
  creditorName?: string;
  // Form 31 specific fields - Certifier Declaration
  certifierName?: string;
  representativeAuthority?: boolean;
  debtValidityDate?: string;
  debtAmount?: string;
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
  // Form 31 specific fields - Execution
  executionDate?: string;
  signatureValid?: boolean;
  // Other fields already in use
  filingDate?: string;
  administratorName?: string;
  estimatedCompletion?: string;
  estateNumber?: string;
  district?: string;
  lastUpdated?: string;
  // Financial information fields
  totalDebts?: string;
  totalAssets?: string;
  monthlyIncome?: string;
  [key: string]: any; // Allow additional fields for backward compatibility
}

export interface Risk {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page?: number;
    rect?: number[];
  };
}

export interface AnalysisResult {
  structureValid?: boolean;
  requiredFieldsPresent?: boolean;
  signaturesValid?: boolean;
  extracted_info: ExtractedInfo;
  risks?: Risk[];
  regulatory_compliance?: RegulatoryCompliance;
}
