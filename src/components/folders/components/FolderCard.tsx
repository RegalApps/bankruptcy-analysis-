
import { Document } from "@/components/DocumentList/types";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Folder, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderDocumentList } from "./FolderDocumentList";
import { useState } from "react";

interface FolderCardProps {
  folder: Document;
  isExpanded: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isPartOfMergeGroup: boolean;
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onFolderDoubleClick: (folderId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string) => void;
  onOpenDocument?: (documentId: string) => void;
}

export const FolderCard = ({
  folder,
  isExpanded,
  isSelected,
  isDragging,
  isPartOfMergeGroup,
  documents,
  onFolderSelect,
  onFolderDoubleClick,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenDocument
}: FolderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const folderDocuments = documents.filter(doc => !doc.is_folder && doc.parent_folder_id === folder.id);
  const hasDocuments = folderDocuments.length > 0;
  const folderTags = folder.metadata?.tags || [];

  // Count of documents and subfolders
  const documentCount = documents.filter(doc => !doc.is_folder && doc.parent_folder_id === folder.id).length;
  const subfolderCount = documents.filter(doc => doc.is_folder && doc.parent_folder_id === folder.id).length;
  const totalItems = documentCount + subfolderCount;

  return (
    <div
      className={cn(
        "flex flex-col p-4 rounded-lg glass-panel transition-all duration-200 cursor-pointer",
        "border border-transparent hover:border-primary/30 hover:shadow-md",
        isDragging && "border-2 border-dashed border-primary/50",
        isSelected && "card-highlight bg-primary/5 border-primary/40",
        isHovered && "bg-accent/10",
        isPartOfMergeGroup && "border-2 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10"
      )}
      onClick={() => onFolderSelect(folder.id)}
      onDoubleClick={() => onFolderDoubleClick(folder.id)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, folder.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-expanded={isExpanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onFolderSelect(folder.id);
        if (e.key === 'Space') onFolderDoubleClick(folder.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded-md mr-3 flex items-center justify-center",
            isSelected ? "bg-primary/20" : "bg-primary/10"
          )}>
            <Folder className={cn(
              "h-5 w-5",
              isSelected ? "text-primary" : "text-primary/80"
            )} />
          </div>
          <div>
            <h4 className="font-medium">{folder.title}</h4>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{folder.folder_type || 'Folder'}</span>
              {totalItems > 0 && (
                <span className="ml-1">- {totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Tags indicator */}
          {folderTags.length > 0 && (
            <div className="flex items-center mr-2">
              <Tag className="h-3 w-3 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{folderTags.length}</span>
            </div>
          )}
          
          {/* Expand/collapse indicator */}
          {hasDocuments && (
            <button 
              className="p-1 rounded-full hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onFolderDoubleClick(folder.id);
              }}
              aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tags badges */}
      {folderTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {folderTags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded view showing documents in the folder */}
      {isExpanded && (
        <FolderDocumentList 
          documents={documents}
          folderId={folder.id}
          onOpenDocument={onOpenDocument}
        />
      )}
    </div>
  );
};
