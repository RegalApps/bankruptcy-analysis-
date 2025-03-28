
import { useState, useCallback, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { ClientViewer } from "@/components/client/ClientViewer";
import { DocumentViewControls } from "./components/DocumentViewControls";
import { DocumentSearchFilter } from "./components/DocumentSearchFilter";
import { FolderTree } from "./components/FolderTree";
import { DocumentViewPanel } from "./components/DocumentViewPanel";
import { FolderTools } from "./components/FolderTools";
import { useFolderDragAndDrop } from "./hooks/useFolderDragAndDrop";
import { useFolderActions } from "./hooks/useFolderActions";
import { useFolderFilterAndExpand } from "./hooks/useFolderFilterAndExpand";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh: () => void;
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
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showClientView, setShowClientView] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  } = useFolderDragAndDrop();

  const {
    folderPath,
    selectedFolder,
    handleFolderSelect,
    handleCreateFolder,
    handleDeleteFolder,
    handleRenameFolder
  } = useFolderActions(documents);

  const {
    visibleFolders,
    filteredDocuments,
    expandedFolders,
    toggleFolderExpanded,
    filterDocumentsByFolder,
    filterDocumentsBySearch
  } = useFolderFilterAndExpand(documents, searchQuery, selectedFolder);

  const handleClientClick = (clientId: string) => {
    if (onClientSelect) {
      setSelectedClientId(clientId);
      setShowClientView(true);
      onClientSelect(clientId);
    }
  };

  const handleBackFromClient = () => {
    setShowClientView(false);
    setSelectedClientId(null);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  // Handler for creating a new folder
  const handleCreateFolderClick = () => {
    setShowCreateFolderDialog(true);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (showClientView && selectedClientId) {
    return (
      <ClientViewer 
        clientId={selectedClientId} 
        onBack={handleBackFromClient}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DocumentSearchFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clients={clients}
          onClientSelect={handleClientClick}
        />
        
        <div className="flex gap-2 items-center justify-between md:justify-end">
          <FolderTools 
            onCreateFolder={handleCreateFolderClick}
            onRefresh={handleRefresh}
          />
          
          <DocumentViewControls 
            isGridView={isGridView}
            setIsGridView={setIsGridView}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 bg-card h-[500px] overflow-y-auto">
          <FolderTree 
            folders={visibleFolders}
            selectedFolderId={selectedFolder}
            expandedFolders={expandedFolders}
            onFolderSelect={handleFolderSelect}
            onToggleExpand={toggleFolderExpanded}
            isDragging={isDragging}
          />
        </div>
        
        <div className="md:col-span-3 border rounded-lg p-6 min-h-[500px]">
          <DocumentViewPanel 
            documents={filteredDocuments}
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
