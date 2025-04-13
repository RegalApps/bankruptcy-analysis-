

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

export interface Client {
  id: string;
  name: string;
  status: string;
  location?: string;
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
  metrics?: ClientMetrics;
  last_interaction?: string;
  engagement_score?: number;
  created_at?: string;
  metadata?: Record<string, any>;
}

export interface ClientMetrics {
  openTasks: number;
  pendingDocuments: number;
  urgentDeadlines: number;
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
