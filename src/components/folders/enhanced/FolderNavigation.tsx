
import { useState } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderList } from "./components/FolderList";
import { EmptyFolderState } from "./components/EmptyFolderState";
import { useFolderDragDrop } from "./hooks/useFolderDragDrop";

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
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="pr-4">
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
