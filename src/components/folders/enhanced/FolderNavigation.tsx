
import { useState, useEffect } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderList } from "./components/FolderList";
import { EmptyFolderState } from "./components/EmptyFolderState";
import { useFolderDragDrop } from "./hooks/useFolderDragDrop";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FolderNavigationProps {
  folders: FolderStructure[];
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedFolderId?: string;
  expandedFolders: Record<string, boolean>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function FolderNavigation({
  folders,
  documents,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  selectedFolderId,
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

  // Find Form 47 documents
  const form47Documents = documents.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );

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

  // Check if we have Form 47 documents that need attention
  const hasForm47Documents = form47Documents.length > 0;

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="pr-4">
        {/* Show alert for Form 47 documents */}
        {hasForm47Documents && (
          <Alert className="mb-4 bg-primary/10 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              {form47Documents.length} Form 47 document{form47Documents.length > 1 ? 's' : ''} available. 
              Double-click on the document to open it.
            </AlertDescription>
          </Alert>
        )}
        
        {folders.length > 0 ? (
          <FolderList
            folders={folders}
            documents={documents}
            onFolderSelect={onFolderSelect}
            onDocumentSelect={onDocumentSelect}
            onDocumentOpen={onDocumentOpen}
            selectedFolderId={selectedFolderId}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            dragOverFolder={dragOverFolder}
          />
        ) : (
          <EmptyFolderState />
        )}
      </div>
    </ScrollArea>
  );
}
