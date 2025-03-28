
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/components/client/types";

export const useCreateFolderStructure = (documents: Document[]) => {
  const [folders, setFolders] = useState<FolderStructure[]>([]);

  useEffect(() => {
    // Map documents to folder structure
    if (documents.length === 0) {
      setFolders([]);
      return;
    }

    const folderMap = new Map();
    
    // First, collect all folder documents
    documents.forEach(doc => {
      if (doc.is_folder) {
        folderMap.set(doc.id, {
          id: doc.id,
          name: doc.title,
          type: doc.folder_type || 'general',
          children: [],
          parentId: doc.parent_folder_id || "",
          isExpanded: false,
          level: 0, // Default level, will be calculated properly later
          metadata: doc.metadata || {}
        });
      }
    });
    
    // Connect parent-child relationships
    folderMap.forEach((folder) => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId);
        parent.children.push(folder);
      }
    });
    
    // Calculate levels for all folders
    const calculateLevels = (folder: any, level: number) => {
      folder.level = level;
      folder.children.forEach((child: any) => {
        calculateLevels(child, level + 1);
      });
    };
    
    // Get only root folders (those without parents or with non-existent parents)
    const rootFolders = Array.from(folderMap.values()).filter(
      folder => !folder.parentId || !folderMap.has(folder.parentId)
    );
    
    // Calculate levels starting from the root
    rootFolders.forEach(folder => {
      calculateLevels(folder, 0);
    });
    
    setFolders(rootFolders);
  }, [documents]);

  return { folders };
};
