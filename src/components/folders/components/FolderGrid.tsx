
import { Document } from "@/components/DocumentList/types";
import { Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FolderGridProps {
  folders: Document[];
  documents: Document[];
  isDragging: boolean;
  selectedFolder: string | null;
  onFolderSelect: (folderId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string) => void;
  onOpenDocument?: (documentId: string) => void; // Make this prop optional
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
  onOpenDocument
}: FolderGridProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={cn(
              "flex items-center p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 cursor-pointer",
              isDragging && "border-2 border-dashed border-primary/50",
              selectedFolder === folder.id && "card-highlight"
            )}
            onClick={() => onFolderSelect(folder.id)}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, folder.id)}
          >
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
        ))}
      </div>
    </ScrollArea>
  );
};
