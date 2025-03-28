
import { useState, useEffect, useMemo } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

export const useFolderFilterAndExpand = (documents: Document[], searchQuery: string, selectedFolder: string | null) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Create visible folder structure
  const visibleFolders = useMemo(() => {
    // This would convert documents to FolderStructure in a real implementation
    // Simple implementation for now
    const folderDocs = documents.filter(doc => doc.is_folder);
    
    return folderDocs.map(doc => ({
      id: doc.id,
      name: doc.title || 'Unnamed Folder',
      type: doc.folder_type || 'general',
      documentCount: documents.filter(d => d.parent_folder_id === doc.id).length,
      children: []
    })) as FolderStructure[];
  }, [documents]);

  // Filter documents based on search and selected folder
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected folder
      const matchesFolder = !selectedFolder || doc.parent_folder_id === selectedFolder;
      
      return matchesSearch && matchesFolder;
    });
  }, [documents, searchQuery, selectedFolder]);

  // Toggle folder expanded state
  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Filter documents by folder
  const filterDocumentsByFolder = (folderId: string) => {
    return documents.filter(doc => doc.parent_folder_id === folderId);
  };

  // Filter documents by search term
  const filterDocumentsBySearch = (docs: Document[], searchTerm: string) => {
    if (!searchTerm) return docs;
    
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    visibleFolders,
    filteredDocuments,
    expandedFolders,
    toggleFolderExpanded,
    filterDocumentsByFolder,
    filterDocumentsBySearch
  };
};
