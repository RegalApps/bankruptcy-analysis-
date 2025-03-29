
import React from "react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FolderIcon } from "./FolderIcon";
import { FolderLockIndicator } from "./FolderLockIndicator";
import { FolderNameEditor } from "./FolderNameEditor";

interface FolderItemHeaderProps {
  folder: FolderStructure;
  isSelected: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  isDragTarget: boolean;
  isFolderLocked: boolean;
  indentation: JSX.Element[];
  form47Documents: Document[];
  formDocuments: Document[];
  folderDocuments: Document[];
  handleDoubleClick: (e: React.MouseEvent) => void;
  onFolderSelect: (folderId: string) => void;
  toggleFolder: (folderId: string, e: React.MouseEvent) => void;
  handleRename: (updatedName: string) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: string) => void;
  cancelEditing: () => void;
}

export const FolderItemHeader = ({
  folder,
  isSelected,
  isExpanded,
  isEditing,
  isDragTarget,
  isFolderLocked,
  indentation,
  form47Documents,
  formDocuments,
  folderDocuments,
  handleDoubleClick,
  onFolderSelect,
  toggleFolder,
  handleRename,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  cancelEditing
}: FolderItemHeaderProps) => {
  // For folder with children, show count
  const hasChildren = folder.children && folder.children.length > 0;
  const hasDocuments = folderDocuments.length > 0;
  const folderType = folder.type;
  
  // Display folder badge count if it has children or documents
  const showBadge = hasChildren || hasDocuments;
  const badgeCount = (hasChildren ? folder.children.length : 0) + folderDocuments.length;
  
  // Handle the click event
  const handleFolderClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || !(e.target as HTMLElement).classList.contains('chevron-icon')) {
      onFolderSelect(folder.id);
    }
  };
  
  // Handle expand/collapse
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolder(folder.id, e);
  };

  // Has pending Form 47 or Form 76 documents
  const hasForm47 = form47Documents.length > 0 || 
                     folderType === 'form' && folder.name.includes('47');
  
  // Special indicator for folders with Form 47 documents
  const hasFormDocuments = formDocuments.length > 0 || hasForm47;

  return (
    <div
      onClick={handleFolderClick}
      onDoubleClick={handleDoubleClick}
      draggable={!isFolderLocked}
      onDragStart={() => handleDragStart(folder.id, 'folder')}
      onDragOver={(e) => handleDragOver(e, folder.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, folder.id)}
      className={cn(
        "flex py-1 px-2 rounded-sm hover:bg-accent/50",
        "group transition-colors duration-200 items-center",
        isSelected && "bg-accent",
        isDragTarget && "bg-accent/80 border border-dashed border-primary",
        "cursor-pointer"
      )}
      data-folder-id={folder.id}
      data-folder-type={folderType}
      aria-selected={isSelected}
      aria-expanded={isExpanded}
    >
      {indentation}
      
      {/* Chevron for expand/collapse */}
      <div 
        onClick={handleToggleClick} 
        className="flex items-center justify-center w-4 h-4 chevron-icon"
      >
        {(hasChildren || hasDocuments) ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" /> // Spacer when no chevron
        )}
      </div>
      
      {/* Folder Icon based on type */}
      <FolderIcon type={folderType} isExpanded={isExpanded} />
      
      {/* Folder Name */}
      {isEditing ? (
        <FolderNameEditor
          isEditing={isEditing}
          name={folder.name}
          onRename={handleRename}
          onCancelEdit={cancelEditing}
        />
      ) : (
        <span className="text-sm truncate">{folder.name}</span>
      )}
      
      {/* Show form47 indicator next to the folder name */}
      {hasFormDocuments && (
        <span 
          className="h-2.5 w-2.5 rounded-full bg-orange-500 ml-2" 
          aria-label="Form 47 Documents Require Attention"
        />
      )}
      
      {/* Show badge count */}
      {showBadge && (
        <span className="ml-2 text-xs px-1.5 py-0.5 bg-accent rounded-full text-muted-foreground">
          {badgeCount}
        </span>
      )}
      
      {/* Lock indicator for locked folders */}
      <div className="ml-auto">
        <FolderLockIndicator isLocked={isFolderLocked} />
      </div>
    </div>
  );
};
