
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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-background">
          <Sidebar document={document} onDeadlineUpdated={handleDocumentUpdated} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main content */}
        <ResizablePanel defaultSize={50} className="bg-background">
          <ViewerLayout
            isForm47={isForm47}
            documentTitle={document.title}
            documentType={document.type}
            sidebar={null}
            mainContent={
              <DocumentPreview 
                storagePath={document.storage_path} 
                title={document.title}
                documentId={documentId}
              />
            }
            collaborationPanel={null}
            taskPanel={null}
            versionPanel={null}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right panel with tabs for collaboration, tasks, and versions */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="bg-background">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <CollaborationPanel document={document} onCommentAdded={handleDocumentUpdated} />
            </div>
            <div className="flex-1 overflow-auto border-t">
              <TaskManager 
                documentId={documentId} 
                tasks={document.tasks || []} 
                onTaskUpdate={handleDocumentUpdated} 
              />
            </div>
            <div className="flex-1 overflow-auto border-t">
              <VersionTab 
                documentId={documentId}
                versions={document.versions || []}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
