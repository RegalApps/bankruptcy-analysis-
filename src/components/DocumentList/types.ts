
export interface Document {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
  storage_path?: string;
  metadata?: Record<string, any>;
  type?: string;
  tasks?: any[];
  versions?: any[];
  size?: number; // Added size property
  ai_processing_status?: string; // Added property used in useFolderRecommendations
}

export interface DocumentFolder {
  id: string;
  name: string;
  documents: Document[];
  subfolders: DocumentFolder[];
  parentFolderId?: string;
}

export interface DocumentNode {
  id: string;
  title: string;
  type: string;
  children?: DocumentNode[];
}
