
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
}

export interface ClientDataHookResult {
  client: Client | null;
  documents: Document[];
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  error: Error | null;
}
