
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { DocumentListItem } from "./DocumentListItem";

interface FolderItemProps {
  folder: FolderStructure;
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedFolderId?: string;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (folderId: string, e: React.MouseEvent) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
  handleDragOver: (e: React.DragEvent, folderId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: string) => void;
  dragOverFolder: string | null;
}

export const FolderItem = ({
  folder,
  documents,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  selectedFolderId,
  expandedFolders,
  toggleFolder,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragOverFolder
}: FolderItemProps) => {
  const isExpanded = expandedFolders[folder.id] || false;
  const isSelected = folder.id === selectedFolderId;
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  // Get form documents specifically
  const formDocuments = folderDocuments.filter(
    doc => doc.metadata?.formType === 'form-47' || doc.metadata?.formType === 'form-76' || 
          doc.title?.toLowerCase().includes('form 47') || doc.title?.toLowerCase().includes('form 76')
  );
  
  const isDragTarget = dragOverFolder === folder.id;

  // Create indentation based on level
  const indentation = Array(folder.level).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Get folder icon based on type
  const getFolderIcon = () => {
    if (folder.type === 'client') {
      return isExpanded ? <Users className="h-4 w-4 text-blue-500 mr-2" /> : <Users className="h-4 w-4 text-muted-foreground mr-2" />;
    } else if (folder.type === 'form') {
      return isExpanded ? <FileText className="h-4 w-4 text-green-500 mr-2" /> : <FileText className="h-4 w-4 text-muted-foreground mr-2" />;
    } else {
      return isExpanded ? <FolderOpen className="h-4 w-4 text-primary mr-2" /> : <Folder className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer",
          isSelected && "bg-accent/60",
          isDragTarget && "bg-primary/20 border border-dashed border-primary"
        )}
        onClick={() => onFolderSelect(folder.id)}
        draggable
        onDragStart={() => handleDragStart(folder.id, 'folder')}
        onDragOver={(e) => handleDragOver(e, folder.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, folder.id)}
      >
        {indentation}
        
        <button 
          className="p-1 rounded-sm hover:bg-muted/60 mr-1"
          onClick={(e) => toggleFolder(folder.id, e)}
        >
          {folder.children && folder.children.length > 0 ? (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-4" />
          )}
        </button>
        
        {getFolderIcon()}
        
        <span className="text-sm truncate">{folder.name}</span>
        
        {/* Show form documents count with special badge for Forms folder */}
        {folder.type === 'form' && formDocuments.length > 0 && (
          <span className="ml-auto text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
            {formDocuments.length}
          </span>
        )}
        
        {/* Show regular document count for other folders */}
        {folder.type !== 'form' && folderDocuments.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">{folderDocuments.length}</span>
        )}
      </div>

      {/* Render child folders if expanded */}
      {isExpanded && folder.children && folder.children.length > 0 && (
        <div>
          {folder.children.map(childFolder => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              documents={documents}
              onFolderSelect={onFolderSelect}
              onDocumentSelect={onDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              selectedFolderId={selectedFolderId}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              dragOverFolder={dragOverFolder}
            />
          ))}
        </div>
      )}

      {/* Render documents in this folder if expanded */}
      {isExpanded && folderDocuments.length > 0 && (
        <DocumentListItem 
          documents={folderDocuments}
          indentationLevel={folder.level}
          onDocumentSelect={onDocumentSelect}
          onDocumentOpen={onDocumentOpen}
          handleDragStart={handleDragStart}
        />
      )}
    </div>
  );
};
