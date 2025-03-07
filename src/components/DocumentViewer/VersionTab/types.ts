
export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at: string;
  description?: string;
  is_current: boolean;
  changes_summary?: string;
  storage_path: string;
}

export interface VersionComparisonProps {
  currentVersion: DocumentVersion;
  previousVersion?: DocumentVersion;
}

export interface VersionListProps {
  versions: DocumentVersion[];
  currentVersionId: string;
  onVersionSelect: (version: DocumentVersion) => void;
}
