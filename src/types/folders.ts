
export interface FolderStructure {
  id: string;
  title: string;
  name?: string; // Adding this since it's being used in many components
  parent_folder_id?: string | null;
  parentId?: string | null; // Alternative property name used in some components
  created_at: string;
  updated_at: string;
  is_folder: boolean;
  type?: 'client' | 'form' | 'financial' | 'general'; // Folder type
  level?: number; // For determining hierarchy depth
  children?: FolderStructure[]; // For hierarchical structure
  isExpanded?: boolean; // Track expanded state
  metadata?: any; // For additional data
}

// Additional interfaces needed based on errors
export interface FolderPermissionRule {
  folderId: string;
  userId: string;
  role: UserRole;
  canCreate: boolean;
  canDelete: boolean;
  canRename: boolean;
  canMove: boolean;
  permission: 'full' | 'edit' | 'view';
}

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer' | 'reviewer';

export interface FolderAIRecommendation {
  id: string;
  type: 'client' | 'form' | 'financial' | 'general';
  reason: string;
  confidence: number;
  documents: string[];
  suggestedFolderId: string;
  suggestedPath: string[];
  alternatives: {
    folderId: string;
    path: string[];
  }[];
}

export interface FolderOperationResult {
  success: boolean;
  message: string;
  folderId?: string;
  error?: any;
}
