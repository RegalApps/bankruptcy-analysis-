
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentPreview } from "./DocumentPreview";
import { Sidebar } from "./Sidebar";
import { CollaborationPanel } from "./CollaborationPanel";
import { LoadingState } from "./LoadingState";
import { TaskManager } from "./TaskManager";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const { document, loading, fetchDocumentDetails } = useDocumentViewer(documentId);

  if (loading) {
    return <LoadingState />;
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Sidebar 
          document={document} 
          onDeadlineUpdated={fetchDocumentDetails} 
        />
      </div>

      <div className="lg:col-span-6">
        <DocumentPreview 
          storagePath={document.storage_path} 
          onAnalysisComplete={fetchDocumentDetails}
        />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <CollaborationPanel 
          document={document}
          onCommentAdded={fetchDocumentDetails}
        />
        <TaskManager
          documentId={document.id}
          tasks={document.tasks || []}
          onTaskUpdate={fetchDocumentDetails}
        />
      </div>
    </div>
  );
};
