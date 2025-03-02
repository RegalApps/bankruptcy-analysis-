
import { Document } from "@/components/DocumentList/types";
import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderDocumentList } from "./FolderDocumentList";

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
  return (
    <div
      className={cn(
        "flex flex-col p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 cursor-pointer",
        isDragging && "border-2 border-dashed border-primary/50",
        isSelected && "card-highlight",
        isPartOfMergeGroup && "border-2 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10"
      )}
      onClick={() => onFolderSelect(folder.id)}
      onDoubleClick={() => onFolderDoubleClick(folder.id)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, folder.id)}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-md bg-primary/10 mr-3">
          <Folder className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">{folder.title}</h4>
          <p className="text-sm text-muted-foreground">
            {folder.folder_type || 'Folder'}
            {folder.metadata?.count && (
              <span className="ml-1">- {folder.metadata.count} items</span>
            )}
          </p>
        </div>
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
