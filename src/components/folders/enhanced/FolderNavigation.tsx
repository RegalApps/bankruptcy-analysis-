
import { useState, useEffect } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { useFolderDragDrop } from "./hooks/useFolderDragDrop";
import { ClientSidebar } from "./components/ClientSidebar";
import { DocumentTree } from "./components/DocumentTree";

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
  
  // Extract unique client names and IDs from documents
  const clients = documents.reduce<{id: string, name: string}[]>((acc, doc) => {
    const metadata = doc.metadata as Record<string, any> || {};
    
    // Check for client_id and client_name in metadata
    if (metadata?.client_id && metadata?.client_name) {
      const existingClient = acc.find(c => c.id === metadata.client_id);
      if (!existingClient) {
        acc.push({
          id: metadata.client_id,
          name: metadata.client_name
        });
      }
    }
    
    // Check for clientName in metadata (alternative format)
    if (metadata?.clientName) {
      const clientName = metadata.clientName;
      // Create a consistent client ID from the name if no explicit ID exists
      const clientId = metadata.client_id || clientName.toLowerCase().replace(/\s+/g, '-');
      
      const existingClient = acc.find(c => c.id === clientId);
      if (!existingClient) {
        acc.push({
          id: clientId,
          name: clientName
        });
      }
    }
    
    // Check for metadata from folder structure
    if (doc.is_folder && doc.folder_type === 'client') {
      const existingClient = acc.find(c => c.id === doc.id);
      if (!existingClient) {
        acc.push({
          id: doc.id,
          name: doc.title
        });
      }
    }
    
    return acc;
  }, []);

  // Find Form 47 documents
  const form47Documents = documents.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );

  // Filter documents based on selected client
  const filteredDocuments = selectedClientId 
    ? documents.filter(doc => {
        const metadata = doc.metadata as Record<string, any> || {};
        return metadata?.client_id === selectedClientId || 
               doc.id === selectedClientId ||
               (metadata?.clientName && metadata.client_id === selectedClientId);
      })
    : documents;

  // Filter folders based on selected client
  const filteredFolders = selectedClientId
    ? folders.filter(folder => {
        // Check if any document in this folder belongs to the selected client
        return filteredDocuments.some(doc => 
          doc.parent_folder_id === folder.id || 
          doc.id === folder.id
        );
      })
    : folders;

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
