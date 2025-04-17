export interface DocumentDetails {
  id: string;
  title: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  parent_folder_id: string | null;  // Add this field to match what's used in demoDocuments
  file_type: string;
  file_size: number;
  is_public: boolean;
  is_favorite: boolean;
  labels: string[];
  status: string;
  metadata: {
    [key: string]: any;
  };
  deadlines: Deadline[];
  version: number;
  analysis?: Analysis[];
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  created_at: string;
  type: string;
}

export interface Analysis {
  id: string;
  created_at: string;
  content: {
    extracted_info: any;
    risks: Risk[];
    regulatory_compliance: {
      status: "needs_review" | "compliant" | "non_compliant";
      details: string;
      references: string[];
    }
  }
}

export interface Risk {
  id?: string;
  type: string;
  title?: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  impact: string;
  requiredAction: string;
  solution: string;
  deadline?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    rect?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  metadata?: {
    section?: string;
  };
}
