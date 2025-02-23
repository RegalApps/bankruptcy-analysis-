
export interface DocumentNode {
  id: string;
  title: string;
  type: string;
  children?: DocumentNode[];
}

export interface Document {
  id: string;
  title: string;
  type: string;
  size: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    client_name?: string;
    [key: string]: any;
  };
}
