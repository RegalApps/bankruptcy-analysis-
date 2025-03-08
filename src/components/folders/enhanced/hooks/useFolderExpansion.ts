
import { useEffect } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

/**
 * Hook to manage folder expansion logic
 * 
 * @param folders List of all folders
 * @param documents List of all documents
 * @param expandedFolders Current expanded folders state
 * @param setExpandedFolders Function to update expanded folders
 * @returns Object with toggleFolder function
 */
export const useFolderExpansion = (
  folders: FolderStructure[],
  documents: Document[],
  expandedFolders: Record<string, boolean>,
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  // Find Form 47 documents
  const form47Documents = documents.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );

  /**
   * Toggle folder expansion state
   * 
   * @param folderId ID of the folder to toggle
   * @param e Mouse event (used to stop propagation)
   */
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
    
    // Auto-expand parent folders when a subfolder is expanded
    const folder = folders.flat().find(f => f.id === folderId);
    if (folder && folder.parentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [folder.parentId!]: true
      }));
    }
  };

  // Set up initial folder expansion
  useEffect(() => {
    // Prepare initial expanded folders state
    const initialExpanded: Record<string, boolean> = {};
    
    // Always expand client folders
    const clientFolders = folders.filter(folder => folder.type === 'client');
    clientFolders.forEach(folder => {
      initialExpanded[folder.id] = true;
    });
    
    // Find Form 47 documents and expand their parent folders
    if (form47Documents.length > 0) {
      // Get parent folders of Form 47 documents
      form47Documents.forEach(doc => {
        if (doc.parent_folder_id) {
          initialExpanded[doc.parent_folder_id] = true;
          
          // Also expand the client folder if this is in a subfolder
          const formFolder = folders.flat().find(f => f.id === doc.parent_folder_id);
          if (formFolder && formFolder.parentId) {
            initialExpanded[formFolder.parentId] = true;
          }
        }
      });
    }
    
    // Update expanded folders state
    setExpandedFolders(prev => ({
      ...prev,
      ...initialExpanded
    }));
  }, [folders, form47Documents, setExpandedFolders]);

  return {
    toggleFolder,
    form47Documents
  };
};
