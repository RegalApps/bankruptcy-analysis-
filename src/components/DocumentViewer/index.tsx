
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentPreview } from "./DocumentPreview";
import { AnalysisPanel } from "./AnalysisPanel";
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

  // Function to handle document analysis completion
  const handleAnalysisComplete = () => {
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-6">
              <DocumentPreview 
                storagePath={document.storage_path} 
                title={document.title}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </TabsContent>
            <TabsContent value="analysis" className="mt-6">
              <AnalysisPanel document={document} onDeadlineUpdated={handleRefresh} />
            </TabsContent>
            <TabsContent value="collaboration" className="mt-6">
              <CollaborationPanel document={document} onCommentAdded={handleRefresh} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-1">
          <Sidebar document={document} onDeadlineUpdated={handleRefresh} />
        </div>
      </div>
    </div>
  );
};
