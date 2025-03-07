
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
