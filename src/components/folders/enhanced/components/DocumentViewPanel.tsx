
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@/components/DocumentList/types";
import { DocumentGrid } from "./DocumentGrid";
import { DocumentTable } from "./DocumentTable";
import { DocumentPathBreadcrumb } from "./DocumentPathBreadcrumb";

interface DocumentViewPanelProps {
  documents: Document[];
  isGridView: boolean;
  folderPath: { id: string; name: string }[];
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentViewPanel: React.FC<DocumentViewPanelProps> = ({
  documents,
  isGridView,
  folderPath,
  onDocumentSelect,
  onDocumentOpen,
  selectedDocumentId
}) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-4">
        <DocumentPathBreadcrumb folderPath={folderPath} />
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No documents found in this location
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <DocumentPathBreadcrumb folderPath={folderPath} />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-15rem)]">
          {isGridView ? (
            <DocumentGrid 
              documents={documents} 
              onDocumentSelect={onDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              selectedDocumentId={selectedDocumentId}
            />
          ) : (
            <DocumentTable 
              documents={documents} 
              onDocumentSelect={onDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              selectedDocumentId={selectedDocumentId}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
