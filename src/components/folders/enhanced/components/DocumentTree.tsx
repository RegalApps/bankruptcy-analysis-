
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderList } from "./FolderList";
import { EmptyFolderState } from "./EmptyFolderState";
import { EmptyClientState } from "./EmptyClientState";
import { Form47Alert } from "./Form47Alert";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/client/types";

interface DocumentTreeProps {
  filteredFolders: FolderStructure[];
  filteredDocuments: Document[];
  form47Documents: Document[];
  selectedFolderId?: string;
  selectedClientId?: string;
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

  // Helper function to convert FolderStructure to Document
  const convertFolderStructureToDocument = (folders: FolderStructure[]): Document[] => {
    return folders.map(folder => ({
      id: folder.id,
      title: folder.name,
      type: folder.type,
      created_at: folder.metadata?.created_at || new Date().toISOString(),
      updated_at: folder.metadata?.updated_at || new Date().toISOString(),
      is_folder: true,
      metadata: folder.metadata || {},
      parent_folder_id: folder.parentId
    }));
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="pr-4 pl-2">
        {/* Show alert for Form 47 documents */}
        {hasForm47Documents && (
          <Form47Alert form47Documents={form47Documents} />
        )}
        
        {filteredFolders.length > 0 ? (
          <FolderList
            folders={convertFolderStructureToDocument(filteredFolders)}
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
          selectedClientId ? (
            <EmptyClientState />
          ) : (
            <EmptyFolderState />
          )
        )}
      </div>
    </ScrollArea>
  );
};
