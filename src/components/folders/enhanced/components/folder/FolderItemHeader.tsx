
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FolderIcon } from "./FolderIcon";
import { AlertCircle } from "lucide-react";
import { getFolderTooltip } from "../../utils/folderUtils";

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
  handleRename: (newName: string) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: string) => void;
  cancelEditing: () => void;
  newName?: string;
  setNewName?: (name: string) => void;
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
  cancelEditing,
  newName,
  setNewName
}: FolderItemHeaderProps) => {
  // Check if this folder needs attention - if it contains Form 47 docs that need attention
  const needsAttention = folder.type === 'client' || 
                        (form47Documents && form47Documents.length > 0);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onFolderSelect(folder.id);
    } else if (e.key === ' ') {
      e.preventDefault();
      toggleFolder(folder.id, {} as React.MouseEvent);
    }
  };

  // Handle rename submit
  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName) {
      handleRename(newName);
    }
  };

  // Get tooltip text for folder
  const tooltipText = getFolderTooltip(folder, folderDocuments);

  return (
    <div
      className={cn(
        "flex items-center py-1 px-2 rounded-sm cursor-pointer",
        isSelected ? "bg-primary/10" : "hover:bg-accent/50",
        isDragTarget && "border border-dashed border-primary bg-primary/5",
        "transition-colors duration-200"
      )}
      onClick={() => onFolderSelect(folder.id)}
      onDoubleClick={handleDoubleClick}
      draggable={!isFolderLocked}
      onDragStart={() => handleDragStart(folder.id, 'folder')}
      onDragOver={(e) => handleDragOver(e, folder.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, folder.id)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-folder-id={folder.id}
      role="treeitem"
      aria-expanded={isExpanded}
    >
      {indentation}
      <div
        className="mr-1 cursor-pointer p-1 hover:bg-accent rounded-sm"
        onClick={(e) => toggleFolder(folder.id, e)}
      >
        <FolderIcon type={folder.type} isExpanded={isExpanded} />
      </div>

      {isEditing ? (
        <form onSubmit={handleRenameSubmit} className="flex-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName && setNewName(e.target.value)}
            onBlur={cancelEditing}
            autoFocus
            className="text-sm px-1 py-0.5 border border-primary rounded w-full outline-none"
          />
        </form>
      ) : (
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center">
            <span className="text-sm font-medium truncate max-w-[150px]">{folder.name}</span>
            
            {/* Status badge for client and form folders */}
            {folder.type === 'client' && (
              <Badge variant="outline" className="ml-2 text-xs bg-blue-50">Client</Badge>
            )}
            {folder.type === 'form' && (
              <Badge variant="outline" className="ml-2 text-xs bg-green-50">Form</Badge>
            )}
            {folder.type === 'estate' && (
              <Badge variant="outline" className="ml-2 text-xs bg-purple-50">Estate</Badge>
            )}
          </div>
          
          {/* Attention indicator for client folders or folders with Form 47 docs */}
          {needsAttention && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center ml-2">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {folder.type === 'client' ? 'Client requires attention' : 'Contains documents that need attention'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Show document count badge */}
          {folderDocuments.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="ml-2">{folderDocuments.length}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
};
