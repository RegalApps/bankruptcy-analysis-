
import { useState } from "react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { DocumentListItem } from "./DocumentListItem";
import { FolderItemHeader } from "./folder/FolderItemHeader";
import { FolderContextMenu } from "./folder/FolderContextMenu";
import { isForm47or76 } from "../utils/documentUtils";

interface FolderItemProps {
  folder: FolderStructure;
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedFolderId?: string;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (folderId: string, e: React.MouseEvent) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: string) => void;
  dragOverFolder: string | null;
}

export const FolderItem = ({
  folder,
  documents,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  selectedFolderId,
  expandedFolders,
  toggleFolder,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragOverFolder
}: FolderItemProps) => {
  const isExpanded = expandedFolders[folder.id] || false;
  const isSelected = folder.id === selectedFolderId;
  const isDragTarget = dragOverFolder === folder.id;
  const isFolderLocked = folder.metadata?.locked || folder.metadata?.system;
  
  // For renaming folders
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  // Create indentation based on level
  const indentation = Array(folder.level).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Get documents in this folder
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  // Specifically identify Form 47 documents
  const form47Documents = folderDocuments.filter(doc => isForm47or76(doc));
  
  // Get form documents specifically
  const formDocuments = folderDocuments.filter(
    doc => doc.metadata?.formType === 'form-47' || doc.metadata?.formType === 'form-76' || 
          doc.title?.toLowerCase().includes('form 47') || doc.title?.toLowerCase().includes('form 76') ||
          doc.title?.toLowerCase().includes('consumer proposal') || doc.title?.toLowerCase().includes('statement of affairs')
  );

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder.metadata?.locked) return;
    setIsEditing(true);
  };

  const handleRename = (updatedName: string) => {
    // In a real app, you would call an API to update the folder name
    console.log(`Renamed folder ${folder.id} to ${updatedName}`);
    setNewName(updatedName);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewName(folder.name);
  };

  const handleLockFolder = () => {
    console.log(`Locking folder ${folder.id}`);
    // In a real app, you would call an API to lock the folder
  };

  const handleAddComment = () => {
    console.log(`Adding comment to folder ${folder.id}`);
    // In a real app, you would open a comment dialog
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <FolderItemHeader
            folder={folder}
            isSelected={isSelected}
            isExpanded={isExpanded}
            isEditing={isEditing}
            isDragTarget={isDragTarget}
            isFolderLocked={isFolderLocked}
            indentation={indentation}
            form47Documents={form47Documents}
            formDocuments={formDocuments}
            folderDocuments={folderDocuments}
            handleDoubleClick={handleDoubleClick}
            onFolderSelect={onFolderSelect}
            toggleFolder={toggleFolder}
            handleRename={handleRename}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            cancelEditing={cancelEditing}
          />
        </ContextMenuTrigger>
        
        <FolderContextMenu
          isExpanded={isExpanded}
          isFolderLocked={isFolderLocked}
          onToggleExpand={() => toggleFolder(folder.id, {} as React.MouseEvent)}
          onRenameClick={handleDoubleClick}
          onLockClick={handleLockFolder}
          onCommentClick={handleAddComment}
        />
      </ContextMenu>

      {/* Render child folders if expanded */}
      {isExpanded && folder.children && folder.children.length > 0 && (
        <div>
          {folder.children.map(childFolder => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
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
          ))}
        </div>
      )}

      {/* Render documents in this folder if expanded */}
      {isExpanded && folderDocuments.length > 0 && (
        <DocumentListItem 
          documents={folderDocuments}
          indentationLevel={folder.level}
          onDocumentSelect={onDocumentSelect}
          onDocumentOpen={onDocumentOpen}
          handleDragStart={handleDragStart}
        />
      )}
    </div>
  );
};
