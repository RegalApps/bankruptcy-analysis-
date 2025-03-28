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

  const handleMoveDocument = async (documentId: string, folderId: string, folderPath: string): Promise<void> => {
    try {
      await moveDocumentToFolder(documentId, folderId, folderPath);
      // If you need the boolean result, handle it here, but don't return it
    } catch (error) {
      console.error("Error moving document to folder:", error);
    }
  };

  // Handle showing loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle showing empty state
  if (documents.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
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
          onMoveToFolder={moveDocumentToFolder}
          setShowRecommendation={setShowRecommendation}
        />
      )}

      <FolderFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

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
  );
};
