
import { Document } from "@/components/DocumentList/types";
import { LucideIcon } from "lucide-react";

export type FolderPermission = 'full' | 'edit' | 'view' | 'none';

export type UserRole = 'admin' | 'manager' | 'reviewer' | 'restricted';

export interface FolderPermissionRule {
  folderId: string;
  userId: string;
  permission: FolderPermission;
}

export interface FolderAIRecommendation {
  documentId: string;
  suggestedFolderId: string;
  confidence: number;
  suggestedPath: string[];
  alternatives?: {
    folderId: string;
    confidence: number;
    path: string[];
  }[];
}

export interface FolderStructure {
  id: string;
  name: string;
  type: 'client' | 'form' | 'financial' | 'general';
  children?: FolderStructure[];
  parentId?: string;
  level: number;
  metadata?: Record<string, any>;
}

export interface FolderTabProps {
  documents: Document[];
  folders: FolderStructure[];
  onDocumentOpen: (documentId: string) => void;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  selectedFolderId?: string;
  userRole: UserRole;
  folderPermissions?: FolderPermissionRule[];
}

export interface FolderDragItem {
  id: string;
  type: 'folder' | 'document';
}

export interface DragAndDropResult {
  success: boolean;
  message?: string;
  error?: any;
}

export interface FolderOperationResult {
  success: boolean;
  message: string;
  folderId?: string;
  error?: any;
}

// Utility functions for folder operations

export const getFolderPermission = (
  folderId: string,
  userRole: UserRole,
  folderPermissions?: FolderPermissionRule[]
): FolderPermission => {
  // Admin has full access to all folders
  if (userRole === 'admin') return 'full';
  
  // Manager has edit access by default
  if (userRole === 'manager') return 'edit';
  
  // Check specific folder permissions
  const folderPermission = folderPermissions?.find(fp => fp.folderId === folderId);
  if (folderPermission) return folderPermission.permission;
  
  // Default permissions based on role
  if (userRole === 'reviewer') return 'view';
  
  // Restricted users have no access by default
  return 'none';
};

export const canUserEditFolder = (
  folderId: string,
  userRole: UserRole,
  folderPermissions?: FolderPermissionRule[]
): boolean => {
  const permission = getFolderPermission(folderId, userRole, folderPermissions);
  return permission === 'full' || permission === 'edit';
};

export const canUserViewFolder = (
  folderId: string,
  userRole: UserRole,
  folderPermissions?: FolderPermissionRule[]
): boolean => {
  const permission = getFolderPermission(folderId, userRole, folderPermissions);
  return permission !== 'none';
};
