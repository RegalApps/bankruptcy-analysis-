
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
  formNumber: string | null;
  clientName: string | null;
  trusteeName: string | null;
  estateNumber: string | null;
  district: string | null;
  divisionNumber: string | null;
  courtNumber: string | null;
  meetingOfCreditors: string | null;
  chairInfo: string | null;
  securityInfo: string | null;
  dateBankruptcy: string | null;
  dateSigned: string | null;
  officialReceiver: string | null;
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
