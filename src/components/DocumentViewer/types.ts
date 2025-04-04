export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
  created_at?: string;
  size?: number;
}

export interface Deadline {
  title: string;
  dueDate: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  created_at: string;
  created_by: string;
  assigned_to?: string;
  document_id: string;
  regulation?: string;
  solution?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at: string;
  created_by?: string;
  storage_path: string;
  is_current: boolean;
  changes_description?: string;
}

export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  storage_path: string;
  deadlines?: Deadline[];
  tasks?: Task[];
  versions?: DocumentVersion[];
  ai_processing_status?: 'pending' | 'complete' | 'failed';
  analysis?: {
    content: {
      extracted_info: {
        type?: string;
        formType?: string;
        formNumber?: string;
        clientName?: string;
        trusteeName?: string;
        administratorName?: string;
        estateNumber?: string;
        district?: string;
        divisionNumber?: string;
        courtNumber?: string;
        meetingOfCreditors?: string;
        chairInfo?: string;
        securityInfo?: string;
        dateBankruptcy?: string;
        dateSigned?: string;
        officialReceiver?: string;
        summary?: string;
        filingDate?: string;
        submissionDeadline?: string;
        documentStatus?: string;
        paymentSchedule?: string;
      };
      risks: Risk[];
    };
  }[];
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
  }[];
}
