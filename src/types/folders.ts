
import { Document } from "@/components/client/types";

export type FolderType = 'client' | 'form' | 'financial' | 'general';

export interface FolderStructure {
  id: string;
  name: string;
  type: FolderType;
  children: FolderStructure[];
  parentId?: string;
  isExpanded: boolean;
  level: number;
  metadata: Record<string, any>;
  title?: string;
  created_at?: string;
  updated_at?: string;
  parent_folder_id?: string;
  is_folder?: boolean;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'reviewer';

export interface FolderPermissionRule {
  folderId: string;
  userId: string;
  role: UserRole;
  permission: 'full' | 'edit' | 'view' | 'none';
  canCreate: boolean;
  canDelete: boolean;
  canRename: boolean;
  canMove: boolean;
}

export interface FolderAIRecommendation {
  id: string;
  type: FolderType;
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

export interface FolderRecommendationProps {
  folderRecommendation: FolderAIRecommendation | null;
  onAccept: () => Promise<void>;
  onDismiss: () => void;
  isOpen: boolean;
}

// Add the missing FolderOperationResult interface
export interface FolderOperationResult {
  success: boolean;
  message: string;
  folderId?: string;
  error?: string;
}
