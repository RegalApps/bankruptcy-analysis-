export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  storage_path: string;
  metadata?: any;
  analysis?: DocumentAnalysis[];
  comments?: DocumentComment[];
  url?: string;
  ai_processing_status?: string;
  ai_confidence_score?: number;
  folder_type?: string;
  parent_folder_id?: string;
  tasks?: Task[];
  deadlines?: DocumentDeadline[];
  versions?: DocumentVersion[];
  created_at?: string;
  updated_at?: string;
}

export interface DocumentAnalysis {
  content: {
    extracted_info?: {
      clientName?: string;
      trusteeName?: string;
      administratorName?: string;
      dateSigned?: string;
      formNumber?: string;
      formType?: string;
      estateNumber?: string;
      district?: string;
      divisionNumber?: string;
      courtNumber?: string;
      meetingOfCreditors?: string;
      chairInfo?: string;
      securityInfo?: string;
      dateBankruptcy?: string;
      officialReceiver?: string;
      documentStatus?: string;
      filingDate?: string;
      submissionDeadline?: string;
      type?: string;
      summary?: string;
      paymentSchedule?: string;
      // Form 31 specific fields
      claimantName?: string;
      creditorName?: string;
      claimAmount?: string;
      claimType?: string;
      securityDetails?: string;
      debtorName?: string;
      creditorAddress?: string;
      claimClassification?: string;
      supportingDocuments?: string[];
      creditorRepresentative?: string;
      creditorContactInfo?: string;
      interestCalculation?: string;
      currencyConversion?: string;
      // Form 47 specific fields
      proposalType?: string;
      monthlyPayment?: string;
      proposalDuration?: string;
    };
    risks?: Risk[];
    regulatory_compliance?: {
      status: string;
      details: string;
      references: string[];
    };
  };
}

export interface Risk {
  type: string;
  description: string;
  severity: "high" | "medium" | "low" | string;
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
}

export interface DocumentComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface DocumentDeadline {
  id?: string;
  title: string;
  description?: string;
  due_date: string;
  status?: 'pending' | 'completed' | 'overdue';
  created_at?: string;
  updated_at?: string;
}

export type Deadline = Partial<DocumentDeadline>;

export interface Task {
  id: string;
  document_id: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  title: string;
  description?: string;
  status: string;
  severity: string;
  regulation?: string;
  solution?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  storage_path?: string;
  created_at: string;
  is_current: boolean;
  description?: string;
  changes_summary?: string;
}

export interface EditableField extends Field {
  showForTypes: string[];
}

export interface Field {
  key: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}
