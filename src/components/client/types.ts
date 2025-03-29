
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
}

export interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
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
