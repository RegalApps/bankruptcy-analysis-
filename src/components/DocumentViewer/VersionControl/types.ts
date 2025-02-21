
export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
  userId: string;
  changes?: {
    added: string[];
    removed: string[];
    modified: string[];
  };
}

export interface VersionComparisonProps {
  currentVersion: DocumentVersion;
  previousVersion: DocumentVersion;
}
