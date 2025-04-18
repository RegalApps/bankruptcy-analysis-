
// Define the possible document statuses
export type DocumentStatus = 
  | 'pending'
  | 'processing'
  | 'complete'
  | 'completed'
  | 'error'
  | 'needs-review'
  | 'approved'
  | 'rejected'
  | 'needs-signature';

// Define document tree node structure
export interface DocumentTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId?: string;
  status?: DocumentStatus;
  metadata?: any;
  storagePath?: string;
  filePath?: string;
  folderType?: string;
  children?: DocumentTreeNode[];
}

// DocumentRecord interface for documents from the database
export interface DocumentRecord {
  id: string;
  title: string;
  storage_path: string;
  type?: string;
  size?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  metadata?: any;
  parent_folder_id?: string;
  is_folder?: boolean;
  folder_type?: string;
  ai_processing_status?: DocumentStatus;
  ai_confidence_score?: number;
  url?: string;
}

// File Info interface for uploaded files
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  uploadTime: Date;
  url?: string;
}

export interface DocumentMetadata {
  client_name?: string;
  client_id?: string;
  document_type?: string;
  form_type?: string;
  form_number?: string;
  processing_status?: string;
  confidence_score?: number;
  extracted_fields?: Record<string, any>;
  upload_timestamp?: string;
  original_filename?: string;
}

// Risk item interface
export interface DocumentRisk {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page?: number;
    rect?: [number, number, number, number];
  };
  regulation?: string;
  impact?: string;
  solution?: string;
  status?: 'open' | 'reviewing' | 'resolved';
  deadline?: string;
}
