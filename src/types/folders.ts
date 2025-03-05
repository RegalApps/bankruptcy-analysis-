
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
