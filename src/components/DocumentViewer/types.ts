
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface Deadline {
  title: string;
  dueDate: string;
  description: string;
}

export interface DocumentAnalysis {
  clientName: string;
  trusteeName: string;
  dateSigned: string;
  formNumber: string;
  documentType: string;
  risks: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  url: string;
  storage_path: string;
  deadlines?: Deadline[];
  analysis?: {
    content: string;
    extracted_info?: DocumentAnalysis;
  }[];
  comments?: Comment[];
}
