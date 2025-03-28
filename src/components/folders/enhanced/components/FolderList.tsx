
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";

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

export const FolderList: React.FC<FolderListProps> = ({
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
}) => {
  // Get top-level folders
  const topLevelFolders = folders.filter(folder => !folder.parent_folder_id);
  
  const renderFolder = (folder: FolderStructure) => {
    const isExpanded = expandedFolders[folder.id];
    const isSelected = selectedFolderId === folder.id;
    const isDraggedOver = dragOverFolder === folder.id;
    
    // Get child folders and documents
    const childFolders = folders.filter(f => f.parent_folder_id === folder.id);
    const childDocuments = documents.filter(doc => doc.parent_folder_id === folder.id && !doc.is_folder);
    
    return (
      <div key={folder.id} className="mb-1">
        <div 
          className={cn(
            "flex items-center p-1.5 rounded-md cursor-pointer",
            isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent",
            isDraggedOver ? "bg-primary/5 border border-dashed border-primary" : ""
          )}
          onClick={() => onFolderSelect(folder.id)}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder.id)}
          draggable
          onDragStart={() => handleDragStart(folder.id, 'folder')}
        >
          <button 
            onClick={(e) => toggleFolder(folder.id, e)}
            className="mr-1 p-0.5 rounded hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <Folder className="h-4 w-4 text-primary mr-1.5" />
          <span className="truncate">{folder.title}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {childFolders.length + childDocuments.length}
          </span>
        </div>
        
        {isExpanded && (
          <div className="pl-6 ml-1 border-l mt-1">
            {/* Render child folders recursively */}
            {childFolders.map(childFolder => renderFolder(childFolder))}
            
            {/* Render documents in this folder */}
            {childDocuments.map(doc => (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center p-1.5 rounded-md cursor-pointer",
                  "hover:bg-accent/50"
                )}
                onClick={() => onDocumentSelect(doc.id)}
                onDoubleClick={() => onDocumentOpen(doc.id)}
                draggable
                onDragStart={() => handleDragStart(doc.id, 'document')}
              >
                <File className="h-4 w-4 text-muted-foreground mr-1.5" />
                <span className="truncate">{doc.title}</span>
              </div>
            ))}
            
            {childFolders.length === 0 && childDocuments.length === 0 && (
              <div className="text-xs text-muted-foreground py-1.5 px-2">
                Empty folder
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="pb-6">
      {topLevelFolders.map(folder => renderFolder(folder))}
    </div>
  );
};
