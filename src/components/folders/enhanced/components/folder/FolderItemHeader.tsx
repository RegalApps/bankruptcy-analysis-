
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { FolderIcon } from "./FolderIcon";
import { FolderStatusIndicator } from "./FolderStatusIndicator";
import { FolderLockIndicator } from "./FolderLockIndicator";
import { FolderNameEditor } from "./FolderNameEditor";
import { FolderActions } from "./FolderActions";
import { FolderBadges } from "./FolderBadges";

interface FolderItemHeaderProps {
  folder: FolderStructure;
  isSelected: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  isDragTarget: boolean;
  isFolderLocked: boolean;
  indentation: JSX.Element[];
  form47Documents: any[];
  formDocuments: any[];
  folderDocuments: any[];
  handleDoubleClick: (e: React.MouseEvent) => void;
  onFolderSelect: (folderId: string) => void;
  toggleFolder: (folderId: string, e: React.MouseEvent) => void;
  handleRename: (newName: string) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, folderId: string) => void;
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
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Add comment to folder", folder.id);
  };

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

  return (
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
      aria-label={getFolderTooltip()}
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
      
      <FolderIcon type={folder.type} isExpanded={isExpanded} />
      
      {isEditing ? (
        <FolderNameEditor 
          isEditing={isEditing} 
          name={folder.name} 
          onRename={handleRename} 
          onCancelEdit={cancelEditing} 
        />
      ) : (
        <div className="flex items-center flex-1 space-x-2">
          <span className="text-sm truncate">{folder.name}</span>
          <FolderStatusIndicator status={folder.metadata?.status} />
          <FolderLockIndicator isLocked={isFolderLocked} />
        </div>
      )}
      
      {/* Action icons */}
      {!isEditing && (
        <FolderActions 
          isFolderLocked={isFolderLocked} 
          onRenameClick={handleDoubleClick} 
          onCommentClick={handleCommentClick} 
        />
      )}
      
      <FolderBadges 
        folderType={folder.type} 
        form47Count={form47Documents.length} 
        formDocumentsCount={formDocuments.length} 
        documentsCount={folderDocuments.length} 
      />
    </div>
  );
};
