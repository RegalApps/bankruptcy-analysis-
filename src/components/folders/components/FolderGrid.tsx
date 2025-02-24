
import { Document } from "@/components/DocumentList/types";
import { FolderIcon } from "@/components/DocumentList/components/FolderIcon";
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
}: FolderGridProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div 
        className={cn(
          "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
          isDragging && "ring-2 ring-primary/50 rounded-lg p-4"
        )}
      >
        {folders.map((folder) => {
          const folderDocuments = documents.filter(d => d.parent_folder_id === folder.id);
          const isSelected = selectedFolder === folder.id;
          
          return (
            <div
              key={folder.id}
              className={cn(
                "p-4 rounded-lg glass-panel hover:shadow-lg transition-all duration-200 card-highlight",
                isSelected && "ring-2 ring-primary"
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, folder.id)}
              onClick={() => onFolderSelect(folder.id)}
            >
              <div className="flex items-center space-x-4">
                <FolderIcon 
                  variant="client" 
                  isActive={isSelected}
                  isOpen={isSelected}
                />
                <div>
                  <h4 className="font-medium text-lg">{folder.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {folderDocuments.length} documents
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
