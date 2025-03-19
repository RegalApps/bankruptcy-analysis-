
import { useEffect } from "react";
import { DocumentPreview } from "./DocumentPreview";
import { useDocumentViewer } from "./hooks/useDocumentViewer";
import { Sidebar } from "./Sidebar";
import { CollaborationPanel } from "./CollaborationPanel";
import { ViewerLayout } from "./layout/ViewerLayout";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { ViewerNotFoundState } from "./components/ViewerNotFoundState";
import { isDocumentForm47 } from "./utils/documentTypeUtils";
import { TaskManager } from "./TaskManager";
import { VersionTab } from "./VersionTab";
import { isUUID } from "@/utils/validation";
import { toast } from "sonner";

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

  // Log the document ID format on initial load for debugging
  useEffect(() => {
    console.log(`Loading document with ID: ${documentId}, UUID format: ${isUUID(documentId)}`);
    
    // Check if the document ID is not in UUID format and show a warning
    if (!isUUID(documentId)) {
      toast.info("Loading document with a non-standard ID format. This might cause issues with some documents.");
    }
  }, [documentId]);

  // Function to handle document updates (like comments added)
  const handleDocumentUpdated = () => {
    handleRefresh();
  };

  if (loading) {
    return <ViewerLoadingState />;
  }

  if (loadingError) {
    return <ViewerErrorState error={loadingError} onRetry={handleRefresh} />;
  }

  if (!document) {
    return <ViewerNotFoundState />;
  }

  // Check if this is a Form 47 document to apply specific layout adjustments
  const isForm47 = isDocumentForm47(document);

  return (
    <div className="h-full overflow-hidden rounded-lg shadow-sm border border-border/20">
      <ViewerLayout
        isForm47={isForm47}
        documentTitle={document.title}
        documentType={document.type}
        sidebar={
          <Sidebar document={document} onDeadlineUpdated={handleDocumentUpdated} />
        }
        mainContent={
          <DocumentPreview 
            storagePath={document.storage_path} 
            title={document.title}
            documentId={documentId}
          />
        }
        collaborationPanel={
          <CollaborationPanel document={document} onCommentAdded={handleDocumentUpdated} />
        }
        taskPanel={
          <TaskManager 
            documentId={documentId} 
            tasks={document.tasks || []} 
            onTaskUpdate={handleDocumentUpdated} 
          />
        }
        versionPanel={
          <VersionTab 
            documentId={documentId}
            versions={document.versions || []}
          />
        }
      />
    </div>
  );
};
