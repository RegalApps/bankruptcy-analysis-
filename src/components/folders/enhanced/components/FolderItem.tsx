
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileText, Users, Lock, Edit2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { DocumentListItem } from "./DocumentListItem";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  // Specifically identify Form 47 documents
  const form47Documents = folderDocuments.filter(
    doc => doc.metadata?.formType === 'form-47' || 
          doc.title?.toLowerCase().includes('form 47') || 
          doc.title?.toLowerCase().includes('consumer proposal')
  );
  
  // Get form documents specifically
  const formDocuments = folderDocuments.filter(
    doc => doc.metadata?.formType === 'form-47' || doc.metadata?.formType === 'form-76' || 
          doc.title?.toLowerCase().includes('form 47') || doc.title?.toLowerCase().includes('form 76') ||
          doc.title?.toLowerCase().includes('consumer proposal') || doc.title?.toLowerCase().includes('statement of affairs')
  );
  
  const isDragTarget = dragOverFolder === folder.id;

  // For renaming folders
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  // Create indentation based on level
  const indentation = Array(folder.level).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Get folder icon based on type
  const getFolderIcon = () => {
    if (folder.type === 'client') {
      return isExpanded ? <Users className="h-4 w-4 text-blue-500 mr-2" /> : <Users className="h-4 w-4 text-muted-foreground mr-2" />;
    } else if (folder.type === 'form') {
      return isExpanded ? <FileText className="h-4 w-4 text-green-500 mr-2" /> : <FileText className="h-4 w-4 text-muted-foreground mr-2" />;
    } else {
      return isExpanded ? <FolderOpen className="h-4 w-4 text-primary mr-2" /> : <Folder className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  // Create a tooltip message based on folder content
  const getFolderTooltip = () => {
    if (form47Documents.length > 0) {
      return `Contains ${form47Documents.length} Form 47 document${form47Documents.length > 1 ? 's' : ''}`;
    }
    if (formDocuments.length > 0) {
      return `Contains ${formDocuments.length} form document${formDocuments.length > 1 ? 's' : ''}`;
    }
    if (folderDocuments.length > 0) {
      return `Contains ${folderDocuments.length} document${folderDocuments.length > 1 ? 's' : ''}`;
    }
    return "Empty folder";
  };

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // In a real app, you would call an API to update the folder name
      console.log(`Renamed folder ${folder.id} to ${newName}`);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewName(folder.name);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder.metadata?.locked) return;
    setIsEditing(true);
  };

  const isFolderLocked = folder.metadata?.locked || folder.metadata?.system;

  // Get folder status indicator
  const getFolderStatus = () => {
    const status = folder.metadata?.status || 'pending';
    
    switch (status) {
      case 'approved':
        return <span className="h-2.5 w-2.5 rounded-full bg-green-500" title="Approved / No Risks" />;
      case 'pending':
        return <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" title="Pending / Minor Issues" />;
      case 'attention':
        return <span className="h-2.5 w-2.5 rounded-full bg-orange-500" title="Requires Attention" />;
      case 'critical':
        return <span className="h-2.5 w-2.5 rounded-full bg-red-500" title="Critical Compliance Risks" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className={cn(
              "flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer group",
              isSelected && "bg-accent/60",
              isDragTarget && "bg-primary/20 border border-dashed border-primary"
            )}
            onClick={() => onFolderSelect(folder.id)}
            draggable={!isFolderLocked}
            onDragStart={() => !isFolderLocked && handleDragStart(folder.id, 'folder')}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
            title={getFolderTooltip()}
          >
            {indentation}
            
            <button 
              className="p-1 rounded-sm hover:bg-muted/60 mr-1"
              onClick={(e) => toggleFolder(folder.id, e)}
            >
              {folder.children && folder.children.length > 0 ? (
                isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              ) : (
                <div className="w-4" />
              )}
            </button>
            
            {getFolderIcon()}
            
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleRename}
                onBlur={() => {
                  setIsEditing(false);
                  setNewName(folder.name);
                }}
                autoFocus
                className="text-sm px-1 py-0.5 border border-primary rounded flex-1 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center flex-1 space-x-2">
                <span className="text-sm truncate">{folder.name}</span>
                {getFolderStatus()}
                {isFolderLocked && (
                  <Lock className="h-3 w-3 text-muted-foreground" title="This folder is locked" />
                )}
              </div>
            )}
            
            {/* Action icons */}
            {!isEditing && !isFolderLocked && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={handleDoubleClick}
                  aria-label="Rename Folder"
                />
                <MessageCircle
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Add comment to folder", folder.id);
                  }}
                  aria-label="Add Comment"
                />
              </div>
            )}
            
            {/* Special highlight for Form 47 documents in Forms folder */}
            {folder.type === 'form' && form47Documents.length > 0 && (
              <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                Form 47 ({form47Documents.length})
              </span>
            )}
            
            {/* Show form documents count with special badge for Forms folder */}
            {folder.type === 'form' && form47Documents.length === 0 && formDocuments.length > 0 && (
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                {formDocuments.length}
              </span>
            )}
            
            {/* Show regular document count for other folders */}
            {folder.type !== 'form' && folderDocuments.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">{folderDocuments.length}</span>
            )}
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="min-w-[160px]">
          <ContextMenuItem onClick={(e) => toggleFolder(folder.id, e as any)}>
            {isExpanded ? "Collapse" : "Expand"}
          </ContextMenuItem>
          
          {!isFolderLocked && (
            <>
              <ContextMenuItem onClick={handleDoubleClick}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem>
                <Lock className="h-4 w-4 mr-2" />
                Lock Folder
              </ContextMenuItem>
            </>
          )}
          
          <ContextMenuSeparator />
          
          <ContextMenuItem>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Comment
          </ContextMenuItem>
        </ContextMenuContent>
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
