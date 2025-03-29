
import { useEffect, useMemo, useState } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

export const useCreateFolderStructure = (documents: Document[]) => {
  const [folders, setFolders] = useState<FolderStructure[]>([]);

  useEffect(() => {
    // Create folder structure from documents
    const createStructure = () => {
      if (!documents || documents.length === 0) {
        setFolders([]);
        return;
      }

      // Extract all folders from documents
      const folderDocs = documents.filter(doc => doc.is_folder);
      
      // Create map of folders by ID
      const folderMap: Record<string, FolderStructure> = {};
      
      // First pass: create folder nodes
      folderDocs.forEach(doc => {
        folderMap[doc.id] = {
          id: doc.id,
          name: doc.title,
          type: doc.folder_type || 'folder', // Use folder_type or default to 'folder'
          children: [],
          parentId: doc.parent_folder_id,
          isExpanded: false,
          level: 0, // Will be calculated in second pass
          metadata: doc.metadata
        };
      });
      
      // Second pass: build folder hierarchy
      const rootFolders: FolderStructure[] = [];
      
      Object.values(folderMap).forEach(folder => {
        if (folder.parentId && folderMap[folder.parentId]) {
          // Add as child to parent
          folderMap[folder.parentId].children.push(folder);
        } else {
          // No parent, so it's a root folder
          rootFolders.push(folder);
        }
      });
      
      // Third pass: calculate levels and sort
      const setLevels = (folders: FolderStructure[], level: number) => {
        folders.forEach(folder => {
          folder.level = level;
          
          // Sort children by type and then alphabetically
          folder.children.sort((a, b) => {
            // First by type (client -> estate -> form -> other)
            const typeOrder = { client: 0, estate: 1, form: 2 };
            const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 3;
            const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 3;
            
            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }
            
            // Then alphabetically
            return a.name.localeCompare(b.name);
          });
          
          if (folder.children.length > 0) {
            setLevels(folder.children, level + 1);
          }
        });
      };
      
      // Sort root folders by type and then alphabetically
      rootFolders.sort((a, b) => {
        if (a.type === 'client' && b.type !== 'client') return -1;
        if (a.type !== 'client' && b.type === 'client') return 1;
        return a.name.localeCompare(b.name);
      });
      
      setLevels(rootFolders, 0);
      
      setFolders(rootFolders);
    };

    createStructure();
  }, [documents]);

  return { 
    folders,
    setFolders
  };
};
