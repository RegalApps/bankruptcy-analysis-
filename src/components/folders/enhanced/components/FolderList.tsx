
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

interface FolderListProps {
  folders: FolderStructure[];
  documents: Document[];
  selectedFolderId?: string | null;
  expandedFolders: Record<string, boolean>;
  dragOverFolder: string | null;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  toggleFolder: (folderId: string, e: React.MouseEvent) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: string) => void;
}

export const FolderList = ({
  folders,
  documents,
  selectedFolderId,
  expandedFolders,
  dragOverFolder,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  toggleFolder,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop
}: FolderListProps) => {
  return (
    <div className="space-y-1">
      {folders.map(folder => (
        <div key={folder.id} className="mb-1">
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-sm cursor-pointer",
              selectedFolderId === folder.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50",
              dragOverFolder === folder.id ? "bg-primary/5 border border-primary/20" : ""
            )}
            onClick={() => onFolderSelect(folder.id)}
            draggable
            onDragStart={() => handleDragStart(folder.id, 'folder')}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <button
              className="mr-1 p-1 hover:bg-muted rounded-sm"
              onClick={(e) => toggleFolder(folder.id, e)}
            >
              {expandedFolders[folder.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedFolders[folder.id] ? (
              <FolderOpen className="h-4 w-4 text-primary mr-2" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground mr-2" />
            )}

            <span className="text-sm truncate">{folder.name}</span>

            {folder.documentCount > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">{folder.documentCount}</span>
            )}
          </div>

          {expandedFolders[folder.id] && (
            <div className="ml-6 mt-1 space-y-1">
              {/* Show documents in this folder */}
              {documents
                .filter(doc => doc.parent_folder_id === folder.id && !doc.is_folder)
                .map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-accent/50"
                    onClick={() => onDocumentSelect(doc.id)}
                    onDoubleClick={() => onDocumentOpen(doc.id)}
                    draggable
                    onDragStart={() => handleDragStart(doc.id, 'document')}
                  >
                    <File className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm truncate">{doc.title}</span>
                  </div>
                ))}
              
              {/* Show folders in this folder (recursive) */}
              {folders
                .filter(subfolder => subfolder.parentId === folder.id)
                .map(subfolder => (
                  <div key={subfolder.id} className="mb-1">
                    {/* Recursive rendering would go here */}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
