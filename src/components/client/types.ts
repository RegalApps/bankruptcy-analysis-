
export interface Client {
  id: string;
  name: string;
  status: string;
  location: string;
  email?: string;
  phone?: string;
  metrics: {
    openTasks: number;
    pendingDocuments: number;
    urgentDeadlines: number;
  };
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
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
}

export interface ClientViewerProps {
  clientId: string;
  onBack?: () => void;
  onDocumentOpen?: (documentId: string) => void;
  onError?: () => void;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface ClientInfoPanelProps {
  client: Client;
  tasks?: Task[];
  documentCount?: number;
  lastActivityDate?: string;
  documents?: Document[];
  onDocumentSelect?: (documentId: string) => void;
  selectedDocumentId?: string | null;
  onClientUpdate?: (updatedClient: Client) => void;
}
