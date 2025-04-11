
export interface Risk {
  severity: string;
  type?: string;
  title?: string;
  description: string;
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
}

export interface DocumentDetails {
  id: string;
  title?: string;
  type?: string;
  status?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  analysis?: { 
    content: any 
  }[];
  comments?: any[];
  deadline?: string;
  submission_date?: string;
}

export interface DocumentSummaryProps {
  summary?: string;
  regulatoryCompliance?: {
    status: string;
    details: string[];
    references: string[];
  };
}

export interface ExtractedInfo {
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  trusteeName?: string;
  trusteeAddress?: string;
  trusteeEmail?: string;
  trusteePhone?: string;
  formType?: string;
  formNumber?: string;
  dateSigned?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  filingDate?: string;
  submissionDeadline?: string;
  documentStatus?: string;
  summary?: string;
  paymentSchedule?: string;
}
