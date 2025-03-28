
import { useState, useEffect } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

export function useCreateFolderStructure(documents: Document[]) {
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (documents.length === 0) {
      setFolders([]);
      setIsLoading(false);
      return;
    }

    // Create folder structure
    setIsLoading(true);
    
    try {
      // Get folders from documents
      const folderDocs = documents.filter(doc => doc.is_folder);
      
      // Map to FolderStructure
      const folderStructures: FolderStructure[] = folderDocs.map(doc => ({
        id: doc.id,
        name: doc.title || 'Unnamed Folder',
        type: doc.folder_type as any || 'general',
        children: [],
        parentId: doc.parent_folder_id,
        isExpanded: false,
        level: 0, // Add default level, it will be updated later
        metadata: doc.metadata || {}
      }));
      
      // Build hierarchy
      const rootFolders: FolderStructure[] = [];
      const folderMap = new Map<string, FolderStructure>();
      
      // Add all folders to map
      folderStructures.forEach(folder => {
        folderMap.set(folder.id, folder);
      });
      
      // Organize into hierarchy
      folderStructures.forEach(folder => {
        if (folder.parentId && folderMap.has(folder.parentId)) {
          const parent = folderMap.get(folder.parentId);
          if (parent) {
            parent.children.push(folder);
          }
        } else {
          rootFolders.push(folder);
        }
      });
      
      // Calculate levels for each folder
      const addLevels = (folders: FolderStructure[], level: number) => {
        folders.forEach(folder => {
          folder.level = level;
          if (folder.children.length > 0) {
            addLevels(folder.children, level + 1);
          }
        });
      };
      
      addLevels(rootFolders, 0);
      
      setFolders(rootFolders);
    } catch (error) {
      console.error("Error creating folder structure:", error);
    } finally {
      setIsLoading(false);
    }
  }, [documents]);

  return { folders, isLoading };
}
