import { ReactNode } from 'react';

export interface EditableField {
  label: string;
  key: string;
  value: string | undefined;
  showForTypes: string[];
  icon?: ReactNode;
}

export interface DocumentDetailsProps {
  clientName?: string;
  trusteeName?: string;
  administratorName?: string;
  dateSigned?: string;
  formNumber?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  summary?: string;
  documentId: string;
  formType?: string;
  filingDate?: string;
  submissionDeadline?: string;
  documentStatus?: string;
  // Form 31 specific fields
  claimantName?: string;
  creditorName?: string;
  claimAmount?: string;
  claimType?: string;
  securityDetails?: string;
  debtorName?: string;
  creditorAddress?: string;
  claimClassification?: string;
  debtorAddress?: string;
  // Additional metadata
  metadata?: Record<string, any>;
}
