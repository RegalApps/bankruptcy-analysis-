
import { useEffect } from "react";
import { DocumentPreview } from "./DocumentPreview";
import { useDocumentViewer } from "./hooks/useDocumentViewer";
import { Sidebar } from "./Sidebar";
import { CollaborationPanel } from "./CollaborationPanel";
import { LoadingState } from "./LoadingState";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const { document, loading, loadingError, handleRefresh } = useDocumentViewer(documentId);

  useEffect(() => {
    if (document) {
      console.log("Document data loaded:", document);
    }
  }, [document]);

  // Function to handle document updates (like comments added)
  const handleDocumentUpdated = () => {
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4">
        <LoadingState size="large" message="Loading document details..." />
        <p className="text-muted-foreground mt-2">
          This may take a moment for large documents or during initial processing.
        </p>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4">
        <div className="max-w-md mx-auto text-center p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-medium mb-3">Document Loading Error</h3>
          <p className="text-muted-foreground mb-6">{loadingError}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">Document Not Found</h3>
        <p className="text-muted-foreground mt-2">
          The requested document could not be found or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[calc(100vh-10rem)]">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left Panel - Document Summary & Details - Adjusted from col-span-3 to col-span-2 */}
        <div className="col-span-3 lg:col-span-2 h-full overflow-hidden">
          <Sidebar document={document} onDeadlineUpdated={handleDocumentUpdated} />
        </div>
        
        {/* Center Panel - Document Viewer - Adjusted from col-span-6 to col-span-7 */}
        <div className="col-span-6 lg:col-span-7 h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <DocumentPreview 
              storagePath={document.storage_path} 
              title={document.title}
              documentId={documentId}
            />
          </div>
        </div>
        
        {/* Right Panel - Collaboration - Adjusted from col-span-3 to col-span-3 */}
        <div className="col-span-3 h-full overflow-hidden">
          <CollaborationPanel document={document} onCommentAdded={handleDocumentUpdated} />
        </div>
      </div>
    </div>
  );
};
