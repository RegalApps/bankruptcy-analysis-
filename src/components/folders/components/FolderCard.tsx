
import { Document } from "@/components/DocumentList/types";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
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

  return (
    <div
      className={cn(
        "flex flex-col p-4 rounded-lg glass-panel transition-all duration-200 cursor-pointer",
        "border border-transparent hover:border-primary/30 hover:shadow-md",
        isDragging && "border-2 border-dashed border-primary/50",
        isSelected && "card-highlight bg-primary/5",
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
          <div className="p-2 rounded-md bg-primary/10 mr-3 flex items-center justify-center">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{folder.title}</h4>
            <p className="text-sm text-muted-foreground">
              {folder.folder_type || 'Folder'}
              {folder.metadata?.count && (
                <span className="ml-1">- {folder.metadata.count} items</span>
              )}
              {!folder.metadata?.count && hasDocuments && (
                <span className="ml-1">- {folderDocuments.length} items</span>
              )}
            </p>
          </div>
        </div>
        
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
