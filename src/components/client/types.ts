
// Client data structure
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  address?: string;
  notes?: string;
  // Add any other client fields needed
}

// Document data structure
export interface Document {
  id: string;
  title: string;
  type?: string;
  url?: string;
  updated_at: string;
  created_at: string;  // Added missing property
  status?: string;
  metadata?: Record<string, any>;
  parent_folder_id?: string;
  is_folder?: boolean;  // Added missing property
  folder_type?: string; // Added missing property
}

// Props for the ClientViewer component
export interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void; // Added optional property
}

// Additional interface types as needed
