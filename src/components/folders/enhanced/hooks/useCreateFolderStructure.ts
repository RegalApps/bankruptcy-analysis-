
import { useMemo } from "react";
import { Document } from "@/components/DocumentList/types";

export const useCreateFolderStructure = (documents: Document[], selectedFolderId: string | null) => {
  // Create folder structure from documents
  const folders = useMemo(() => {
    return documents.filter(doc => doc.is_folder);
  }, [documents]);

  // Create folder path
  const folderPath = useMemo(() => {
    const path: { id: string; name: string }[] = [];

    if (selectedFolderId) {
      let currentFolder = folders.find(folder => folder.id === selectedFolderId);
      
      // Add the current folder to the path
      if (currentFolder) {
        path.unshift({ id: currentFolder.id, name: currentFolder.title });
      }

      // Build the path by finding parent folders
      while (currentFolder && currentFolder.parent_folder_id) {
        const parent = folders.find(folder => folder.id === currentFolder?.parent_folder_id);
        if (parent) {
          path.unshift({ id: parent.id, name: parent.title });
          currentFolder = parent;
        } else {
          break;
        }
      }
    }

    return path;
  }, [folders, selectedFolderId]);

  return { folders, folderPath };
};
