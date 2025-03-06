
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
import { Home } from "lucide-react";

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
    <ViewerLayout
      isForm47={isForm47}
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
    />
  );
};
