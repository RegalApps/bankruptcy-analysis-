
import { useEffect, useMemo } from "react";
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
import { debugTiming, isDebugMode } from "@/utils/debugMode";

interface DocumentViewerProps {
  documentId: string;
  bypassProcessing?: boolean;
  documentTitle?: string | null;
  isForm47?: boolean;
  onLoadFailure?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  documentId, 
  bypassProcessing = false,
  documentTitle,
  isForm47 = false,
  onLoadFailure
}) => {
  // Use a stable key for this component to force full remount when documentId changes
  const componentKey = useMemo(() => `document-viewer-${documentId}`, [documentId]);
  
  const loadStart = performance.now();
  const { document, loading, loadingError, handleRefresh, isNetworkError } = useDocumentViewer(documentId);

  useEffect(() => {
    if (document) {
      console.log("Document data loaded:", document.id);
      if (isDebugMode() || bypassProcessing) {
        debugTiming('document-viewer-load', performance.now() - loadStart);
      }
    }
  }, [document, loadStart, bypassProcessing]);

  // Call onLoadFailure when there's an error loading the document
  useEffect(() => {
    if (loadingError && onLoadFailure) {
      console.log("Document load failed, calling onLoadFailure callback");
      onLoadFailure();
    }
  }, [loadingError, onLoadFailure]);

  // Function to handle document updates (like comments added)
  const handleDocumentUpdated = () => {
    handleRefresh();
  };

  if (loading) {
    return <ViewerLoadingState 
      key={`${componentKey}-loading`} 
      onRetry={handleRefresh}
      networkError={isNetworkError}
    />;
  }

  if (loadingError) {
    return <ViewerErrorState key={`${componentKey}-error`} error={loadingError} onRetry={handleRefresh} />;
  }

  if (!document) {
    return <ViewerNotFoundState key={`${componentKey}-not-found`} />;
  }

  // If isForm47 is explicitly passed as prop, use that, otherwise check from document
  const isForm47Document = isForm47 || isDocumentForm47(document);
  // Use passed documentTitle if available, otherwise use the one from document
  const displayTitle = documentTitle || document.title;

  return (
    <div className="h-full overflow-hidden rounded-lg shadow-sm border border-border/20" key={componentKey}>
      <ViewerLayout
        isForm47={isForm47Document}
        documentTitle={displayTitle}
        documentType={document.type}
        sidebar={
          <Sidebar document={document} onDeadlineUpdated={handleDocumentUpdated} />
        }
        mainContent={
          <DocumentPreview 
            storagePath={document.storage_path} 
            title={displayTitle}
            documentId={documentId}
            bypassAnalysis={bypassProcessing || isDebugMode()}
            key={`preview-${documentId}`}
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
