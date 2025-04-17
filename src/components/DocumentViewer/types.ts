
export interface DocumentDetails {
  id: string;
  title: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  parent_folder_id: string | null;
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
  // Additional properties needed by the components
  type?: string;
  size?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
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
  severity?: string; // Added to match usage in demoDocuments.ts
}

export interface Analysis {
  id: string;
  created_at: string;
  document_id?: string; // Added to match usage in demoDocuments.ts
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
    rect?: number[]; // Changed to match RiskAssessment/types.ts
  };
  metadata?: {
    section?: string;
  };
}

// Task interface needed by TaskManager components
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  document_id: string;
  risk_id?: string;
}

// Document version interface needed by DocumentVersions
export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  storage_path: string;
  created_at: string;
  created_by: string;
  comment?: string;
}

// Analysis Panel Props interface
export interface AnalysisPanelProps {
  documentId: string;
  isLoading?: boolean;
  analysis?: any;
}

// DeadlineManager Props interface
export interface DeadlineManagerProps {
  documentId: string;
  deadlines?: Deadline[];
  isLoading?: boolean;
  onDeadlineUpdated?: () => void;
}
