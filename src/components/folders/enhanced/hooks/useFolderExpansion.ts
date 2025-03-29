
import { useState, useEffect } from "react";
import { Document } from "@/components/client/types";
import { FolderStructure } from "@/types/folders";

export const useFolderExpansion = (
  folders: FolderStructure[],
  documents: Document[],
  expandedFolders: Record<string, boolean>,
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  const [form47Documents, setForm47Documents] = useState<Document[]>([]);

  // Extract Form 47 documents when documents change
  useEffect(() => {
    if (!documents || !Array.isArray(documents)) return;
    
    const form47Docs = documents.filter(doc => {
      if (!doc) return false;
      
      // Check for form 47 in various ways
      return (
        doc.title?.toLowerCase().includes('form 47') ||
        doc.type?.toLowerCase().includes('form 47') ||
        (doc.metadata?.form_number === '47')
      );
    });
    
    setForm47Documents(form47Docs);
  }, [documents]);

  // Toggle folder expansion
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return {
    toggleFolder,
    form47Documents
  };
};
