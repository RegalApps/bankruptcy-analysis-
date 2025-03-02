
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FolderCard } from "./FolderCard";

interface FolderGridProps {
  folders: Document[];
  documents: Document[];
  isDragging: boolean;
  selectedFolder: string | null;
  onFolderSelect: (folderId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string) => void;
  onOpenDocument?: (documentId: string) => void;
  mergeableClientFolders?: Record<string, string[]>;
  highlightMergeTargets?: boolean;
}

export const FolderGrid = ({
  folders,
  documents,
  isDragging,
  selectedFolder,
  onFolderSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenDocument,
  mergeableClientFolders = {},
  highlightMergeTargets = false
}: FolderGridProps) => {
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  const handleFolderDoubleClick = (folderId: string) => {
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };

  const isPartOfMergeGroup = (folderId: string): boolean => {
    if (!highlightMergeTargets) return false;
    
    return Object.values(mergeableClientFolders).some(
      folderIds => folderIds.includes(folderId)
    );
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            isExpanded={expandedFolder === folder.id}
            isSelected={selectedFolder === folder.id}
            isDragging={isDragging}
            isPartOfMergeGroup={isPartOfMergeGroup(folder.id)}
            documents={documents}
            onFolderSelect={onFolderSelect}
            onFolderDoubleClick={handleFolderDoubleClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onOpenDocument={onOpenDocument}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
