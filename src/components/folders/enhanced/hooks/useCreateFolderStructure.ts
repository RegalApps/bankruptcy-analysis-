
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
            
            // Get direct child documents for this folder
            const childDocuments = documents.filter(doc => 
              !doc.is_folder && doc.parent_folder_id === folder.id
            );
            
            // Build folder structure
            const folderStructure: FolderStructure = {
              id: folder.id,
              name: folder.title,
              type: folderType as 'client' | 'form' | 'financial' | 'general',
              level,
              parentId: folder.parent_folder_id || undefined,
              metadata: folder.metadata || {},
              documents: childDocuments
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
        
        // Create a virtual "Clients" root folder if it doesn't exist
        const clientFolders = folderStructure.filter(folder => folder.type === 'client');
        
        // Only create the Clients folder if there are client folders but no existing "Clients" folder
        const hasClientsFolder = folderStructure.some(folder => 
          folder.name.toLowerCase() === 'clients' && folder.type === 'client'
        );
        
        if (clientFolders.length > 0 && !hasClientsFolder) {
          // Add the Clients virtual folder
          const clientsFolder: FolderStructure = {
            id: 'virtual-clients-folder',
            name: 'Clients',
            type: 'client',
            level: 0,
            children: clientFolders,
            metadata: {},
            isVirtual: true
          };
          
          // Remove the client folders from the top level
          const nonClientFolders = folderStructure.filter(folder => folder.type !== 'client');
          
          // Set the final structure
          setFolders([clientsFolder, ...nonClientFolders]);
        } else {
          setFolders(folderStructure);
        }
      } catch (error) {
        console.error("Error building folder structure:", error);
        setFolders([]);
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
