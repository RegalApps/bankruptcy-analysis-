
import { useEffect, useMemo, useCallback } from "react";
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

  // Function to handle document updates (like comments added) with useCallback for stability
  const handleDocumentUpdated = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Use memoization to prevent unnecessary re-renders
  const isForm47 = useMemo(() => document ? isDocumentForm47(document) : false, [document]);

  if (loading) {
    return <ViewerLoadingState />;
  }

  if (loadingError) {
    return <ViewerErrorState error={loadingError} onRetry={handleRefresh} />;
  }

  if (!document) {
    return <ViewerNotFoundState />;
  }

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
