
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FolderCard } from "./FolderCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [showAllFolders, setShowAllFolders] = useState(true);

  const handleFolderDoubleClick = (folderId: string) => {
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };

  const isPartOfMergeGroup = (folderId: string): boolean => {
    if (!highlightMergeTargets) return false;
    
    return Object.values(mergeableClientFolders).some(
      folderIds => folderIds.includes(folderId)
    );
  };

  // Reset to show all folders
  const handleShowAllFolders = () => {
    setShowAllFolders(true);
    onFolderSelect("");
  };

  // Filter folders based on selection state
  const foldersToDisplay = showAllFolders 
    ? folders 
    : folders.filter(folder => folder.id === selectedFolder);

  // Update showAllFolders state when a folder is selected
  const handleFolderSelection = (folderId: string) => {
    setShowAllFolders(false);
    onFolderSelect(folderId);
  };

  return (
    <div className="space-y-4">
      {folders.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No folders found. Create a new folder to organize your documents.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Tip:</span> Click on a folder to focus on it, double-click to expand and see documents
          </div>
          
          {!showAllFolders && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowAllFolders}
            >
              Show All Folders
            </Button>
          )}
        </div>
      )}
      
      <ScrollArea className="h-[400px]">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {foldersToDisplay.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              isExpanded={expandedFolder === folder.id}
              isSelected={selectedFolder === folder.id}
              isDragging={isDragging}
              isPartOfMergeGroup={isPartOfMergeGroup(folder.id)}
              documents={documents}
              onFolderSelect={handleFolderSelection}
              onFolderDoubleClick={handleFolderDoubleClick}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onOpenDocument={onOpenDocument}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
