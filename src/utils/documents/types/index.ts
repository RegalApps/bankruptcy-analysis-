
export * from './analysisTypes';
export * from './documentTypes';

// Document processing status
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'error' | 'needs-review' | 'complete' | 'needs-signature';

// Document tree node interface
export interface DocumentTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId?: string;
  status?: DocumentStatus;
  metadata?: Record<string, any>;
  children?: DocumentTreeNode[];
  storagePath?: string;
  folderType?: 'client' | 'estate' | 'form' | 'financials' | 'default';
  filePath?: string;
}
