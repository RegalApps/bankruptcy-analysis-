
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  last_interaction?: string;
  engagement_score?: number;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
  metadata?: {
    client_name?: string;
    storage_path?: string;
    [key: string]: any;
  };
}

export interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void;
  onError?: () => void;
}

export interface FolderStructure {
  id: string;
  name: string;
  type: 'client' | 'form' | 'financial' | 'general';
  title?: string;
  children: FolderStructure[];
  parentId?: string;
  parent_folder_id?: string;
  isExpanded: boolean;
  level: number;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  is_folder?: boolean;
}
