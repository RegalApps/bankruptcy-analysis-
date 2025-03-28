
import { useState } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderHeader } from "./components/FolderHeader";
import { FolderTree } from "./components/FolderTree";
import { DocumentViewPanel } from "./components/DocumentViewPanel";
import { DocumentSearchFilter } from "./components/DocumentSearchFilter";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { useFolderDragAndDrop } from "./hooks/useFolderDragAndDrop";
import { useFolderFilterAndExpand } from "./hooks/useFolderFilterAndExpand";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh?: () => void;
  onClientSelect?: (clientId: string) => void;
  clients?: { id: string; name: string }[];
}

export const EnhancedFolderTab = ({
  documents,
  onDocumentOpen,
  onRefresh,
  onClientSelect,
  clients = []
}: EnhancedFolderTabProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Create folder structure from documents
  const { folders, folderPath } = useCreateFolderStructure(documents, selectedFolderId);

  // Drag and drop functionality
  const {
    draggedItem,
    dragOverFolder,
    isDragging,
    handleDragStart, 
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setExpandedFoldersFunction
  } = useFolderDragAndDrop();

  // Filter and expand functionality
  const {
    filteredFolders,
    filteredDocuments,
    expandedFolders,
    toggleFolderExpanded,
    setExpandedFolders
  } = useFolderFilterAndExpand(documents, searchQuery, selectedFolderId);

  // Provide the setExpandedFolders function to the drag-drop hook
  setExpandedFoldersFunction(setExpandedFolders);

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(null);
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (onClientSelect) {
      onClientSelect(clientId);
    }
  };

  // Handle folder toggle
  const handleToggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolderExpanded(folderId);
  };

  // Filter Form 47 documents for quick access
  const form47Documents = documents.filter(doc => 
    doc.type === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );

  // Documents to display in the main panel
  const documentsToDisplay = selectedFolderId
    ? documents.filter(doc => doc.parent_folder_id === selectedFolderId)
    : documents.filter(doc => !doc.parent_folder_id && !doc.is_folder);

  return (
    <div className="h-full flex flex-col">
      <FolderHeader 
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        selectedFolderId={selectedFolderId}
        onRefresh={onRefresh}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-1 border-r">
          <DocumentSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clients={clients}
            onClientSelect={handleClientSelect}
          />
          
          <FolderTree
            filteredFolders={filteredFolders}
            filteredDocuments={filteredDocuments}
            form47Documents={form47Documents}
            selectedFolderId={selectedFolderId}
            selectedClientId={selectedClientId}
            expandedFolders={expandedFolders}
            dragOverFolder={dragOverFolder}
            onFolderSelect={handleFolderSelect}
            onDocumentSelect={handleDocumentSelect}
            onDocumentOpen={onDocumentOpen}
            toggleFolder={handleToggleFolder}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        </div>
        
        <div className="md:col-span-3">
          <DocumentViewPanel
            documents={documentsToDisplay}
            isGridView={isGridView}
            onDocumentSelect={handleDocumentSelect}
            onDocumentOpen={onDocumentOpen}
            folderPath={folderPath}
            selectedDocumentId={selectedDocumentId}
          />
        </div>
      </div>
    </div>
  );
};
