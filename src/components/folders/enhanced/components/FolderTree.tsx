
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderList } from "./FolderList";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

interface DocumentTreeProps {
  filteredFolders: FolderStructure[];
  filteredDocuments: Document[];
  form47Documents: Document[];
  selectedFolderId?: string | null;
  selectedClientId?: string | null;
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

export const DocumentTree = ({
  filteredFolders,
  filteredDocuments,
  form47Documents,
  selectedFolderId,
  selectedClientId,
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
}: DocumentTreeProps) => {
  const hasForm47Documents = form47Documents.length > 0;

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="pr-4 pl-2">
        {hasForm47Documents && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-medium text-sm mb-1">Consumer Proposals</h3>
            <div className="space-y-1">
              {form47Documents.map(doc => (
                <div 
                  key={doc.id}
                  className="text-sm p-2 hover:bg-amber-100 rounded cursor-pointer"
                  onClick={() => onDocumentOpen(doc.id)}
                >
                  {doc.title}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {filteredFolders.length > 0 ? (
          <FolderList
            folders={filteredFolders}
            documents={filteredDocuments}
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
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            {selectedClientId ? (
              <p>No folders available for this client</p>
            ) : (
              <p>No folders found</p>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export const FolderTree = DocumentTree;
