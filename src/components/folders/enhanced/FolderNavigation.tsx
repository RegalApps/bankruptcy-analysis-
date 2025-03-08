
import { useState, useEffect } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { useFolderDragDrop } from "./hooks/useFolderDragDrop";
import { ClientSidebar } from "./components/ClientSidebar";
import { DocumentTree } from "./components/DocumentTree";
import { 
  extractClientsFromDocuments,
  filterDocumentsByClient,
  filterFoldersByClient
} from "./hooks/utils/clientExtractionUtils";

interface FolderNavigationProps {
  folders: FolderStructure[];
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  onClientSelect?: (clientId: string) => void;
  onClientViewerAccess?: (clientId: string) => void;
  selectedFolderId?: string;
  selectedClientId?: string;
  expandedFolders: Record<string, boolean>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function FolderNavigation({
  folders,
  documents,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  onClientSelect,
  onClientViewerAccess,
  selectedFolderId,
  selectedClientId,
  expandedFolders,
  setExpandedFolders
}: FolderNavigationProps) {
  // Get drag and drop functionality from hook
  const {
    dragOverFolder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setExpandedFoldersFunction
  } = useFolderDragDrop(documents);
  
  // Provide the setExpandedFolders function to the hook
  setExpandedFoldersFunction(setExpandedFolders);
  
  // Extract unique clients from documents using our utility function
  const clients = extractClientsFromDocuments(documents);

  // Find Form 47 documents
  const form47Documents = documents.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );

  // Filter documents based on selected client using our utility function
  const filteredDocuments = filterDocumentsByClient(documents, selectedClientId);

  // Filter folders based on selected client using our utility function
  const filteredFolders = filterFoldersByClient(folders, filteredDocuments, selectedClientId);

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

  // Expand folders on initial load
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
  }, [folders, form47Documents]);

  return (
    <div className="flex h-full">
      {/* Client Sidebar */}
      {clients.length > 0 && onClientSelect && onClientViewerAccess && (
        <ClientSidebar
          clients={clients}
          onClientSelect={onClientSelect}
          onClientViewerAccess={onClientViewerAccess}
          selectedClientId={selectedClientId}
        />
      )}
      
      {/* Document Tree */}
      <div className="flex-1">
        <DocumentTree
          filteredFolders={filteredFolders}
          filteredDocuments={filteredDocuments}
          form47Documents={form47Documents}
          selectedFolderId={selectedFolderId}
          selectedClientId={selectedClientId}
          expandedFolders={expandedFolders}
          dragOverFolder={dragOverFolder}
          onFolderSelect={onFolderSelect}
          onDocumentSelect={onDocumentSelect}
          onDocumentOpen={onDocumentOpen}
          toggleFolder={toggleFolder}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />
      </div>
    </div>
  );
}
