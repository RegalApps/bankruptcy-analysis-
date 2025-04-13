
export interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
  size?: number;
  metadata?: Record<string, any>;
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
  storage_path?: string;
  ai_processing_status?: string;
  deadlines?: any[];
  url?: string;
  comments?: Comment[]; // Add this line to define comments
}

// Define Comment interface if it's not already defined
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  user_name?: string;
  document_id?: string;
  parent_id?: string;
  is_resolved?: boolean;
}
