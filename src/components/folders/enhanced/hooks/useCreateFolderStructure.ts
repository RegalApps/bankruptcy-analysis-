
import { useMemo } from 'react';
import { Document } from '@/components/DocumentList/types';
import { FolderStructure } from '@/types/folders';

export const useCreateFolderStructure = (documents: Document[]) => {
  const folders = useMemo(() => {
    // Extract all folders from documents
    const folderDocs = documents.filter(doc => doc.is_folder);
    
    // Create a map of folder IDs to folder objects
    const folderMap: Record<string, FolderStructure> = {};
    
    // Initialize folders
    folderDocs.forEach(doc => {
      folderMap[doc.id] = {
        id: doc.id,
        name: doc.title || 'Unnamed Folder',
        type: doc.folder_type || 'default',
        children: [],
        parentId: doc.parent_folder_id,
        isExpanded: false
      };
    });
    
    // Build folder hierarchy
    const rootFolders: FolderStructure[] = [];
    
    Object.values(folderMap).forEach(folder => {
      if (!folder.parentId) {
        rootFolders.push(folder);
      } else if (folderMap[folder.parentId]) {
        folderMap[folder.parentId].children.push(folder);
      } else {
        // Orphaned folder, add to root
        rootFolders.push(folder);
      }
    });
    
    return rootFolders;
  }, [documents]);
  
  return { folders };
};
