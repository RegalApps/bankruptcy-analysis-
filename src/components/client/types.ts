
export interface Client {
  id: string;
  name: string;
  status: string;
  location: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  mobilePhone?: string;
  notes?: string;
  company?: string;
  occupation?: string;
  metrics: ClientMetrics;
  last_interaction?: string;
  engagement_score?: number;
}

export interface ClientMetrics {
  openTasks: number;
  pendingDocuments: number;
  urgentDeadlines: number;
}

// Updated to match DocumentList/types.ts Document interface
export interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
  storage_path: string;
  size: number;
  metadata?: Record<string, any>;
  is_folder?: boolean;
  folder_type?: string;
  parent_folder_id?: string;
  analysis?: any[];
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
