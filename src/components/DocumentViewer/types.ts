
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

export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ExtractedInfo {
  clientName: string | null;
  trusteeName: string | null;
  dateSigned: string | null;
  formNumber: string | null;
  risks: Risk[];
}

export interface Analysis {
  content: {
    extracted_info: ExtractedInfo;
  };
}

export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  url: string;
  storage_path: string;
  deadlines?: Deadline[];
  analysis?: Analysis[];
  comments?: Comment[];
}
