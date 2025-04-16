
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
}

export interface RegulatoryCompliance {
  status: 'compliant' | 'non_compliant' | 'error';
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
  [key: string]: any;
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  regulatoryReferences?: Record<string, string[]>;
}
