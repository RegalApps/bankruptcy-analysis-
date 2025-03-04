
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentPreview } from "./DocumentPreview";
import { Sidebar } from "./Sidebar";
import { CollaborationPanel } from "./CollaborationPanel";
import { LoadingState } from "./LoadingState";
import { TaskManager } from "./TaskManager";
import { VersionTab } from "./VersionTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logger from "@/utils/logger";
import { useEffect } from "react";
import { showPerformanceToast } from "@/utils/performance";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const { document, loading, fetchDocumentDetails } = useDocumentViewer(documentId);

  useEffect(() => {
    // Measure and show performance metrics when the document viewer loads
    if (!loading && document) {
      showPerformanceToast("Document Viewer");
    }
  }, [loading, document]);

  logger.debug('Document data in DocumentViewer:', document);

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

  const analysis = document.analysis?.[0]?.content;
  logger.debug('Analysis content:', analysis);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Sidebar 
          document={document}
          onDeadlineUpdated={fetchDocumentDetails} 
        />
      </div>

      <div className="lg:col-span-6">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <DocumentPreview 
              storagePath={document.storage_path} 
              title={document.title}
              onAnalysisComplete={fetchDocumentDetails}
            />
          </TabsContent>
          <TabsContent value="versions">
            <VersionTab documentId={document.id} />
          </TabsContent>
        </Tabs>
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
