
export interface DocumentNode {
  id: string;
  title: string;
  type: string;
  children?: DocumentNode[];
}

export interface Document {
  id: string;
  title: string;
  type: string;
  size: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    client_name?: string;
    [key: string]: any;
  };
  // Add new properties to match the database schema
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
  ai_processing_status?: string;
  ai_confidence_score?: number;
  url?: string;
}
