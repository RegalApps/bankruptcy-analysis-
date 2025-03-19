
import React, { useEffect } from "react";
import { useDocumentViewer } from "./hooks/useDocumentViewer";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { ViewerNotFoundState } from "./components/ViewerNotFoundState";
import { LoadingState } from "./LoadingState";
import { DocumentPreview } from "./DocumentPreview";
import { DocumentAnalysis } from "./DocumentAnalysis";
import { DocumentHeader } from "./DocumentHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertTriangle, BarChart2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentViewerProps {
  documentId: string;
  onError?: (error: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  documentId,
  onError
}) => {
  const { document, loading, loadingError, handleRefresh } = useDocumentViewer(documentId);
  
  // Notify parent component of errors
  useEffect(() => {
    if (loadingError && onError) {
      onError(loadingError);
    }
  }, [loadingError, onError]);

  if (loading) {
    return <LoadingState />;
  }

  if (loadingError) {
    if (loadingError.includes("not found") || loadingError.includes("deleted")) {
      return <ViewerNotFoundState />;
    }
    
    return (
      <ViewerErrorState 
        error={loadingError} 
        onRetry={handleRefresh} 
      />
    );
  }

  if (!document) {
    return <ViewerNotFoundState />;
  }

  return (
    <div className="flex flex-col h-full">
      <DocumentHeader 
        title={document.title} 
        documentId={document.id}
        metadata={document.metadata}
        createdAt={document.created_at}
        updatedAt={document.updated_at}
      />
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-background">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 p-0 mt-0">
          {document.storage_path ? (
            <DocumentPreview 
              storagePath={document.storage_path} 
              documentId={document.id}
              title={document.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="max-w-md p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Preview Unavailable</h3>
                <p className="text-muted-foreground">
                  This document doesn't have an associated file to preview.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analysis" className="flex-1 p-4 mt-0">
          <ScrollArea className="h-full">
            <DocumentAnalysis 
              document={document} 
              onRefreshAnalysis={handleRefresh}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
