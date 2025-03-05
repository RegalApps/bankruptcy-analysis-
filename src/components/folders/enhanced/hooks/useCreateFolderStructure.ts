
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { supabase } from "@/lib/supabase";

export const useCreateFolderStructure = (documents: Document[]) => {
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const buildFolderStructure = async () => {
      setIsLoading(true);
      
      try {
        // Filter folder documents
        const folderDocs = documents.filter(doc => doc.is_folder);
        
        // Create a map of folder documents by id for easy lookup
        const folderMap = new Map();
        folderDocs.forEach(doc => {
          folderMap.set(doc.id, doc);
        });
        
        // Function to recursively build folder structure
        const buildFolderTree = (folderId: string | null): FolderStructure[] => {
          const childFolders = folderDocs.filter(doc => doc.parent_folder_id === folderId);
          
          return childFolders.map(folder => {
            // Determine folder level
            let level = 0;
            let currentFolder = folder;
            while (currentFolder.parent_folder_id) {
              level++;
              currentFolder = folderMap.get(currentFolder.parent_folder_id) || currentFolder;
            }
            
            // Determine folder type
            const folderType = folder.folder_type || 'general';
            
            // Build folder structure
            const folderStructure: FolderStructure = {
              id: folder.id,
              name: folder.title,
              type: folderType as 'client' | 'form' | 'financial' | 'general',
              level,
              parentId: folder.parent_folder_id || undefined,
              metadata: folder.metadata || {}
            };
            
            // Add children recursively
            const children = buildFolderTree(folder.id);
            if (children.length > 0) {
              folderStructure.children = children;
            }
            
            return folderStructure;
          });
        };
        
        // Build the top-level folders
        const folderStructure = buildFolderTree(null);
        setFolders(folderStructure);
      } catch (error) {
        console.error("Error building folder structure:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (documents && documents.length > 0) {
      buildFolderStructure();
    } else {
      setFolders([]);
      setIsLoading(false);
    }
  }, [documents]);
  
  return { folders, isLoading };
};
