
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
}

export interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
  onError?: () => void;
}
