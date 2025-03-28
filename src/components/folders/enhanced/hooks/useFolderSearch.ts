
import { useMemo } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

export const useFolderSearch = (
  folders: FolderStructure[],
  documents: Document[],
  searchQuery: string,
  filterCategory: string | null
) => {
  // Filter folders based on search query and category
  const filteredFolders = useMemo(() => {
    if (!searchQuery && !filterCategory) return folders;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return folders.filter(folder => {
      // Filter by search query
      const matchesSearch = !searchQuery || folder.name.toLowerCase().includes(lowerQuery);
      
      // Filter by category
      const matchesCategory = !filterCategory || 
                             (filterCategory === 'client' && folder.type === 'client') ||
                             (filterCategory === 'form' && folder.type === 'form') ||
                             (filterCategory === 'financial' && folder.type === 'financial');
      
      return matchesSearch && matchesCategory;
    });
  }, [folders, searchQuery, filterCategory]);
  
  // Filter documents based on search query and category
  const filteredDocuments = useMemo(() => {
    if (!searchQuery && !filterCategory) return documents;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return documents.filter(doc => {
      if (doc.is_folder) return false; // Skip folders
      
      // Filter by search query
      const matchesSearch = !searchQuery || 
                          (doc.title?.toLowerCase().includes(lowerQuery)) ||
                          (doc.description?.toLowerCase().includes(lowerQuery));
                          
      // Filter by category
      const matchesCategory = !filterCategory || 
                             (filterCategory === 'uncategorized' && !doc.parent_folder_id) ||
                             (filterCategory === 'form' && doc.type?.includes('form')) ||
                             (filterCategory === 'financial' && doc.type?.includes('excel'));
      
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, filterCategory]);
  
  // Find Form 47 documents
  const form47Documents = useMemo(() => {
    return documents.filter(doc => 
      !doc.is_folder && 
      (doc.type === 'form-47' || 
       doc.title?.toLowerCase().includes('form 47') ||
       doc.title?.toLowerCase().includes('consumer proposal'))
    );
  }, [documents]);
  
  return { filteredFolders, filteredDocuments, form47Documents };
};
