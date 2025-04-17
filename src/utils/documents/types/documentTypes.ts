
export interface DocumentType {
  id: string;
  name: string;
  description?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  type?: string;
  storage_path?: string;
  url?: string;
  size?: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  ai_processing_status?: string;
  user_id?: string;
  parent_folder_id?: string;
  is_folder?: boolean;
  folder_type?: string;
}
