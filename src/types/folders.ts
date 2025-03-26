
export interface FolderStructure {
  id: string;
  name: string;
  type: string;
  children: FolderStructure[];
  parentId?: string;
  isExpanded: boolean;
}
