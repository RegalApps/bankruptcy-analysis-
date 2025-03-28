
export interface FolderStructure {
  id: string;
  title: string;
  parent_folder_id?: string | null;
  created_at: string;
  updated_at: string;
  is_folder: boolean;
}
