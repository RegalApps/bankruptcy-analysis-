
import { useState, useMemo } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

interface UseFolderFilterAndExpandProps {
  documents: Document[];
  searchQuery: string;
  selectedFolderId: string | null;
}

export const useFolderFilterAndExpand = (
  documents: Document[],
  searchQuery: string,
  selectedFolderId: string | null
) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Create visible folders based on documents
  const filteredFolders = useMemo(() => {
    return documents.filter(doc => 
      doc.is_folder && 
      (!searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [documents, searchQuery]);

  // Filter documents based on search query and selected folder
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      !doc.is_folder && 
      (!searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedFolderId ? doc.parent_folder_id === selectedFolderId : true)
    );
  }, [documents, searchQuery, selectedFolderId]);

  // Toggle folder expanded state
  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return {
    filteredFolders,
    filteredDocuments,
    expandedFolders,
    toggleFolderExpanded,
    setExpandedFolders
  };
};
