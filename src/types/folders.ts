
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  subfolders?: FolderStructure[];
  parentId?: string;
  documentCount?: number;
  isExpanded?: boolean;
  children?: FolderStructure[]; 
  level?: number; 
  metadata?: Record<string, any>;
}

export interface FolderAIRecommendation {
  id: string;
  type: string;
  reason: string;
  confidence: number;
  documents: string[];
  suggestedFolderId: string;
  suggestedPath: string[];
  alternatives?: { folderId: string; path: string[] }[];
}

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

export type UserRole = 'admin' | 'manager' | 'user' | 'reviewer';

export interface FolderOperationResult {
  success: boolean;
  message?: string;
  folderId?: string;
  error?: string; // Added the missing error property
}
