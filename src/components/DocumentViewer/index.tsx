
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

  // Check if document is still being processed
  const isProcessing = document.ai_processing_status === 'pending';

  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Panel - Document Summary & Details */}
        <div className="col-span-3 h-full">
          <Sidebar document={document} onDeadlineUpdated={handleDocumentUpdated} />
        </div>
        
        {/* Center Panel - Document Viewer */}
        <div className="col-span-6 h-full">
          <div className="h-full flex flex-col">
            {isProcessing && (
              <div className="mb-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                <p className="font-medium">Document Analysis in Progress</p>
                <p className="text-sm mt-1">The document is currently being analyzed. Some features may be limited until processing completes.</p>
              </div>
            )}
            <DocumentPreview 
              storagePath={document.storage_path} 
              title={document.title}
              documentId={documentId}
            />
          </div>
        </div>
        
        {/* Right Panel - Collaboration */}
        <div className="col-span-3 h-full">
          <CollaborationPanel document={document} onCommentAdded={handleDocumentUpdated} />
        </div>
      </div>
    </div>
  );
};
