
import { Button } from "@/components/ui/button";
import { Document } from "@/components/DocumentList/types";
import { DocumentCard } from "@/components/DocumentCard";
import { File, FilePlus, FolderPlus } from "lucide-react";

interface DocumentViewPanelProps {
  documents: Document[];
  isGridView: boolean;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  folderPath: { id: string; name: string }[];
  selectedDocumentId?: string;
}

export const DocumentViewPanel = ({
  documents,
  isGridView,
  onDocumentSelect,
  onDocumentOpen,
  folderPath,
  selectedDocumentId
}: DocumentViewPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb path */}
      {folderPath.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <span>{folder.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Document list */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <File className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents in this folder</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This folder is empty. Upload a document or create a subfolder.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              <FilePlus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <Button variant="outline" size="sm">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Subfolder
            </Button>
          </div>
        </div>
      ) : (
        <div className={`grid gap-4 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.title}
              type={doc.type || 'Unknown'}
              date={new Date(doc.updated_at).toLocaleDateString()}
              selected={doc.id === selectedDocumentId}
              onClick={() => onDocumentSelect(doc.id)}
              onOpen={() => onDocumentOpen(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
