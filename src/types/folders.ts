
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  subfolders?: FolderStructure[];
  parentId?: string;
  documentCount?: number;
  isExpanded?: boolean;
}
