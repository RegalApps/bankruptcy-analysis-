
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
  status?: string;
  metadata?: Record<string, any>;
  parent_folder_id?: string;
}

// Props for the ClientViewer component
export interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
}

// Additional interface types as needed
