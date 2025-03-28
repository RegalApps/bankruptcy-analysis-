
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
  folderId?: string; // Added this property
}

export type UserRole = 'admin' | 'manager' | 'user' | 'reviewer' | 'guest';

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
  type: string;
  reason: string;
  confidence: number;
  documents: string[];
  suggestedFolderId: string;
  suggestedPath: string[];
  alternatives?: {
    folderId: string;
    path: string[];
  }[];
}

export interface FolderRecommendation {
  documentId: string;
  suggestedFolderId: string;
  documentTitle: string;
  folderPath: string[];
}

export interface FolderRecommendationHookResult {
  showRecommendation: boolean;
  recommendation: FolderRecommendation | null;
  setShowRecommendation: (show: boolean) => void;
  dismissRecommendation: () => void;
  moveDocumentToFolder: (documentId: string, folderId: string, folderPath: string) => Promise<void>;
}
