
import { Document } from "@/components/DocumentList/types";
import { Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

  const getFolderDocuments = (folderId: string) => {
    return documents.filter(doc => !doc.is_folder && doc.parent_folder_id === folderId);
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={cn(
              "flex flex-col p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 cursor-pointer",
              isDragging && "border-2 border-dashed border-primary/50",
              selectedFolder === folder.id && "card-highlight",
              isPartOfMergeGroup(folder.id) && "border-2 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10"
            )}
            onClick={() => onFolderSelect(folder.id)}
            onDoubleClick={() => handleFolderDoubleClick(folder.id)}
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
            {expandedFolder === folder.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h5 className="text-sm font-medium mb-2">Documents in this folder:</h5>
                <div className="space-y-2">
                  {getFolderDocuments(folder.id).length > 0 ? (
                    getFolderDocuments(folder.id).map(doc => (
                      <div 
                        key={doc.id}
                        className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenDocument) onOpenDocument(doc.id);
                        }}
                      >
                        <span className="truncate">{doc.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents in this folder</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
