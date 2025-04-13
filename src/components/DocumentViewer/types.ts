
export interface DocumentDetails {
  id: string;
  title: string;
  type: string;
  content?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  comments?: Comment[];
  analysis?: Analysis[];
  versions?: DocumentVersion[];
  tasks?: Task[];
  deadlines?: Deadline[];
  metadata?: any;
  status?: string;
  storage_path?: string;
  file_size?: number;
  size?: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  document_id: string;
  parent_id?: string;
  is_resolved: boolean;
  user_name?: string;
}

export interface Analysis {
  id: string;
  content: AnalysisContent;
  created_at: string;
}

export interface AnalysisContent {
  extracted_info?: {
    clientName?: string;
    trusteeName?: string;
    administratorName?: string;
    dateSigned?: string;
    formNumber?: string;
    estateNumber?: string;
    filingDate?: string;
    submissionDeadline?: string;
    documentStatus?: string;
    type?: string;
    summary?: string;
    [key: string]: any;
  };
  risks?: Risk[];
  regulatory_compliance?: {
    status: string;
    details: string;
    references: string[];
  };
}

export interface Risk {
  id?: string;
  type: string;
  title?: string;
  description: string;
  severity: "low" | "medium" | "high";
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
  position?: {
    page?: number;
    rect?: number[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at: string;
  is_current: boolean;
  description?: string;
  changes_summary?: string;
  version_name?: string;
}

export interface Task {
  id: string;
  document_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  severity: string;
  priority: string;
  created_at: string;
  due_date?: string;
  assigned_to?: string;
  regulation?: string;
  solution?: string;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  type?: string;
}

export interface DocumentViewerProps {
  documentId: string;
  documentTitle?: string;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  onLoadFailure?: () => void;
  bypassProcessing?: boolean;
}

export interface DocumentPreviewProps {
  documentId: string;
  storagePath: string;
  title: string;
  bypassAnalysis?: boolean;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
  onAnalysisComplete?: () => void;
  onLoadFailure?: () => void;
  isForm31GreenTech?: boolean;
}

export interface CommentsProps {
  documentId: string;
  comments?: Comment[];
  isLoading?: boolean;
  onCommentAdded?: () => void;
}

export interface TaskManagerProps {
  documentId: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
  isLoading?: boolean;
}

export interface DocumentVersionsProps {
  documentId: string;
  documentVersions?: DocumentVersion[];
  currentDocumentId?: string;
  isLoading?: boolean;
}

export interface DeadlineManagerProps {
  documentId: string;
  deadlines?: Deadline[];
  isLoading?: boolean;
  onDeadlineUpdated?: () => void;
}

export interface AnalysisPanelProps {
  documentId: string;
  isLoading?: boolean;
  analysis?: AnalysisContent;
}
