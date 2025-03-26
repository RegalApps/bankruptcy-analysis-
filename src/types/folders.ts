
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  children: FolderStructure[];
  parentId?: string;
  isExpanded: boolean;
  level?: number; // Adding level property to fix type errors
}

export interface FolderOperationResult {
  success: boolean;
  message: string;
  folder?: FolderStructure;
}

export interface FolderAIRecommendation {
  id: string;
  type: string;
  reason: string;
  confidence: number;
  documents: string[];
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface FolderPermissionRule {
  role: UserRole;
  canCreate: boolean;
  canDelete: boolean;
  canRename: boolean;
  canMove: boolean;
}
