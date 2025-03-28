
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  children: FolderStructure[];
  parentId?: string;
  isExpanded: boolean;
  level: number;
  metadata?: Record<string, any>;
}

export interface FolderOperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}
