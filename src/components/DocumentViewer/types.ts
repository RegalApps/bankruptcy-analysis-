
export interface DocumentDetails {
  id: string;
  title: string;
  type?: string;
  description?: string;
  size?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  status?: string;
  tags?: string[];
  content?: string;
  storage_path: string;
  metadata?: Record<string, any>;
  url?: string;
  analysis?: Array<{
    content: any;
  }>;
  versions?: DocumentVersion[];
  comments?: Array<{
    id: string;
    content: any;
    created_at: string;
    user_id: string;
  }>;
  tasks?: Task[];
  deadlines?: Deadline[];
  file_size?: number;
  creation_date?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  version_name?: string;
  storage_path: string;
  created_at: string;
  created_by: string;
  is_current: boolean;
  change_summary?: string;
  metadata?: Record<string, any>;
}

export interface Risk {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  content: {
    text: string;
    attachments?: string[];
    page?: number;
    position?: {
      x: number;
      y: number;
    };
  };
  parent_id?: string | null;
  created_at: string;
  updated_at?: string;
  status?: "active" | "deleted" | "resolved";
  replies?: DocumentComment[];
}

export interface Deadline {
  title: string;
  dueDate: string;
  description?: string;
}

export interface Task {
  id: string;
  document_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  severity: 'low' | 'medium' | 'high';
  created_at?: string;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  regulation?: string;
  solution?: string;
}

export interface CollaborationPanelProps {
  document: DocumentDetails;
  onCommentAdded?: () => void;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
}

export interface DocumentPreviewProps {
  storagePath: string;
  documentId: string;
  title: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}
