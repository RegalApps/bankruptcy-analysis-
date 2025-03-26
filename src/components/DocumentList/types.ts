
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
}

export interface DocumentFolder {
  id: string;
  name: string;
  documents: Document[];
  subfolders: DocumentFolder[];
  parentFolderId?: string;
}
