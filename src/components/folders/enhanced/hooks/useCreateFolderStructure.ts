
import { useMemo } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { mapDocumentsToFolderStructure, buildFolderHierarchy } from "./utils/folderMapperUtils";

export const useCreateFolderStructure = (documents: Document[], selectedFolderId: string | null) => {
  // Create folder structure from documents
  const folders = useMemo(() => {
    const folderStructures = mapDocumentsToFolderStructure(documents);
    return buildFolderHierarchy(folderStructures);
  }, [documents]);

  // Get all folders in flat structure for easier lookup
  const allFolders = useMemo(() => {
    return documents.filter(doc => doc.is_folder);
  }, [documents]);

  // Create folder path
  const folderPath = useMemo(() => {
    const path: { id: string; name: string }[] = [];

    if (selectedFolderId) {
      let currentFolder = allFolders.find(folder => folder.id === selectedFolderId);
      
      // Add the current folder to the path
      if (currentFolder) {
        path.unshift({ id: currentFolder.id, name: currentFolder.title || 'Unnamed' });
      }

      // Build the path by finding parent folders
      while (currentFolder && currentFolder.parent_folder_id) {
        const parent = allFolders.find(folder => folder.id === currentFolder?.parent_folder_id);
        if (parent) {
          path.unshift({ id: parent.id, name: parent.title || 'Unnamed' });
          currentFolder = parent;
        } else {
          break;
        }
      }
    }

    return path;
  }, [allFolders, selectedFolderId]);

  return { folders, folderPath };
};
