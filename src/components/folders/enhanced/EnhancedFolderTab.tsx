
import { useState, useCallback, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { FolderHeader } from "./FolderHeader";
import { FolderFilterToolbar } from "./FolderFilterToolbar";
import { FolderStructure } from "@/types/folders";
import { useFolderNavigation } from "./hooks/useFolderNavigation";
import { useDocumentDragDrop } from "./hooks/useDocumentDragDrop";
import { DocumentTree } from "./components/DocumentTree";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { useFolderSearch } from "./hooks/useFolderSearch";
import { useFolderRecommendation } from "./hooks/useFolderRecommendation";
import { FolderRecommendation } from "./FolderRecommendation";
import { ClientSidebar } from "./components/ClientSidebar";
import { ClientTab } from "./components/ClientTab";
import { extractClientsFromDocuments } from "./hooks/utils/clientExtractionUtils";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh: () => void;
}

export const EnhancedFolderTab = ({
  documents,
  onDocumentOpen,
  onRefresh
}: EnhancedFolderTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const { folders, isLoading } = useCreateFolderStructure(documents);
  const {
    selectedItemId,
    handleItemSelect
  } = useFolderNavigation(documents);
  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    dragOverFolder
  } = useDocumentDragDrop(onRefresh);
  const {
    filteredFolders,
    filteredDocuments,
    form47Documents
  } = useFolderSearch(folders, documents, searchQuery, filterCategory);
  const {
    showRecommendation,
    recommendation,
    setShowRecommendation,
    dismissRecommendation,
    moveDocumentToFolder
  } = useFolderRecommendation(documents, folders);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const selectedFolderId = selectedItemId && folders.find(f => f.id === selectedItemId) ? selectedItemId : undefined;
  const selectedClientId = selectedItemId && documents.find(d => d.id === selectedItemId)?.metadata?.client_id;
  
  // New state for client viewer
  const [showClientViewer, setShowClientViewer] = useState(false);
  const [selectedViewerClientId, setSelectedViewerClientId] = useState<string | null>(null);
  
  // Extract clients from documents
  const clients = extractClientsFromDocuments(documents);

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleFolderSelect = useCallback((folderId: string) => {
    handleItemSelect(folderId, "folder");
  }, [handleItemSelect]);

  const handleDocumentSelect = useCallback((documentId: string) => {
    handleItemSelect(documentId, "file");
  }, [handleItemSelect]);

  const handleCreateFolder = () => {
    console.log("Create folder");
    // Implementation would go here in a real app
  };

  const handleCreateDocument = () => {
    console.log("Create document");
    // Implementation would go here in a real app
  };

  // Fixed: Modified the function to properly handle the Promise<boolean> from moveDocumentToFolder
  const handleMoveDocument = async (documentId: string, folderId: string, folderPath: string): Promise<void> => {
    try {
      // Call moveDocumentToFolder but ignore its boolean return value
      const success = await moveDocumentToFolder(documentId, folderId, folderPath);
      // We can still use the boolean for logging if needed
      console.log(`Document move ${success ? 'succeeded' : 'failed'}`);
      // But we don't return anything (void)
    } catch (error) {
      console.error("Error moving document to folder:", error);
    }
  };
  
  // Handle client selection for the main view
  const handleClientSelect = (clientId: string) => {
    console.log("Selected client in main view:", clientId);
    // Don't use handleItemSelect which expects "folder" or "file" type
    // Instead, we'll manage selection state directly
    setSelectedViewerClientId(null); // Reset viewer client when selecting in main view
    
    // Instead of setting selectedItemId directly, we now toggle the client viewer
    if (clientId) {
      setShowClientViewer(false); // Ensure we're in the main view initially
      
      // Use setTimeout to ensure state updates before selecting
      setTimeout(() => {
        // This will change the selection in the sidebar without causing type errors
        const clientDoc = documents.find(d => d.metadata?.client_id === clientId);
        if (clientDoc) {
          handleItemSelect(clientDoc.id, "file");
        } else {
          console.log("Client document not found for ID:", clientId);
        }
      }, 0);
    }
  };
  
  // Handle opening the client viewer
  const handleOpenClientViewer = (clientId: string) => {
    console.log("Opening client viewer for:", clientId);
    setSelectedViewerClientId(clientId);
    setShowClientViewer(true);
  };
  
  // Handle back button from client viewer
  const handleClientViewerBack = () => {
    console.log("Returning from client viewer");
    setShowClientViewer(false);
    setSelectedViewerClientId(null);
  };

  // Handle showing loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle showing empty state
  if (documents.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
  }
  
  // Show client viewer when selected
  if (showClientViewer && selectedViewerClientId) {
    console.log("Rendering ClientTab for client:", selectedViewerClientId);
    return (
      <ClientTab 
        clientId={selectedViewerClientId} 
        onBack={handleClientViewerBack}
        onDocumentOpen={onDocumentOpen}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <FolderHeader 
        onCreateFolder={handleCreateFolder}
        onCreateDocument={handleCreateDocument}
        selectedFolderId={selectedFolderId}
        hasWriteAccess={true}
        userRole="admin"
        onRefresh={onRefresh}
      />
      
      {showRecommendation && recommendation && (
        <FolderRecommendation
          recommendation={recommendation}
          onDismiss={dismissRecommendation}
          onMoveToFolder={handleMoveDocument}
          setShowRecommendation={setShowRecommendation}
        />
      )}

      <FolderFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Client sidebar on the left */}
        <ClientSidebar
          clients={clients}
          onClientSelect={handleClientSelect}
          onClientViewerAccess={handleOpenClientViewer}
          selectedClientId={selectedClientId}
        />
        
        {/* Document tree in the main area */}
        <div className="flex-1 overflow-auto">
          <DocumentTree
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
            toggleFolder={toggleFolder}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        </div>
      </div>
    </div>
  );
};
