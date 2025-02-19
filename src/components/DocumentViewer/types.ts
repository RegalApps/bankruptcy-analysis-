
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}

export interface Deadline {
  title: string;
  dueDate: string;
  description?: string;
}

export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  storage_path: string;
  deadlines?: Deadline[];
  analysis?: {
    content: {
      extracted_info: {
        clientName?: string;
        trusteeName?: string;
        dateSigned?: string;
        formNumber?: string;
        risks?: Risk[];
      };
    };
  }[];
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
  }[];
}
