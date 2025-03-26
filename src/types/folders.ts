
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  children: FolderStructure[];
  parentId?: string;
  isExpanded: boolean;
  level?: number;
  metadata?: Record<string, any>; // Added metadata property
}

export interface FolderOperationResult {
  success: boolean;
  message: string;
  folder?: FolderStructure;
  error?: string; // Added error property
}

export interface FolderAIRecommendation {
  id: string;
  type: string;
  reason: string;
  confidence: number;
  documents: string[];
  suggestedFolderId?: string;
  suggestedPath?: string[];
  alternatives?: { folderId: string; path: string[] }[]; // Changed to proper type
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager' | 'reviewer';

export interface FolderPermissionRule {
  role: UserRole;
  canCreate: boolean;
  canDelete: boolean;
  canRename: boolean;
  canMove: boolean;
  folderId?: string;
  userId?: string;
  permission?: string;
}
