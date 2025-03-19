
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  last_interaction?: string;
  engagement_score?: number;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  parent_folder_id?: string;
  is_folder?: boolean;
  folder_type?: string;
  storage_path?: string;
  original_id?: string;
  form_type?: 'form-47' | 'form-76' | string;  // Adding specific form type for better identification
}

export interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
  onError?: () => void;
}
