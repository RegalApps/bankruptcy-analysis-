
import React, { useState } from "react";
import { toast } from "sonner";
import { DocumentViewerFrame } from "./DocumentViewerFrame";
import { useDocumentPreview } from "../hooks/useDocumentPreview";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ViewerToolbar } from "./ViewerToolbar";

interface DocumentPreviewContentProps {
  storagePath: string;
  documentId: string;
  title: string;
  previewState: any; // Using any here to avoid circular dependencies, but in practice should be properly typed
}

export const DocumentPreviewContent: React.FC<DocumentPreviewContentProps> = ({
  storagePath,
  documentId,
  title,
  previewState
}) => {
  const {
    fileExists,
    fileUrl,
    previewError,
    setPreviewError,
    checkFile,
    isLoading
  } = previewState;

  const [forceReload, setForceReload] = useState(0);
  
  const {
    isLoading: isFrameLoading,
    setIsLoading: setIsFrameLoading,
    zoomLevel,
    useDirectLink,
    setUseDirectLink,
    isRetrying,
    setIsRetrying,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload,
    handlePrint,
    iframeRef
  } = useDocumentPreview(fileUrl, title, undefined);

  const handleIframeLoad = () => setIsFrameLoading(false);
  
  const handleIframeError = () => {
    setIsFrameLoading(false);
    if (!useDirectLink) {
      setUseDirectLink(true);
    }
  };

  const handleRefresh = async () => {
    setIsRetrying(true);
    setIsFrameLoading(true);
    toast.info("Refreshing document preview...");
    try {
      await checkFile();
      setForceReload(prev => prev + 1);
      setUseDirectLink(false);
      toast.success("Document refreshed");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh document");
    } finally {
      setIsRetrying(false);
    }
  };

  if (!storagePath) {
    return <ErrorDisplay error="No document selected" onRetry={() => {}} />;
  }

  // Show loading state when document is loading
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading document preview...</p>
        </div>
      </div>
    );
  }

  const isPdfFile = storagePath.toLowerCase().endsWith('.pdf');
  const isDocFile = storagePath.toLowerCase().endsWith('.doc') || storagePath.toLowerCase().endsWith('.docx');

  return (
    <div className="flex flex-col h-full">
      <ViewerToolbar 
        title={title}
        zoomLevel={zoomLevel}
        isRetrying={isRetrying}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRefresh={handleRefresh}
        onOpenInNewTab={handleOpenInNewTab}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
      
      <div className="flex-1 overflow-hidden relative">
        {fileExists && fileUrl ? (
          <DocumentViewerFrame
            fileUrl={fileUrl}
            title={title}
            isLoading={isFrameLoading}
            useDirectLink={useDirectLink}
            zoomLevel={zoomLevel}
            isPdfFile={isPdfFile}
            isDocFile={isDocFile}
            onIframeLoad={handleIframeLoad}
            onIframeError={handleIframeError}
            iframeRef={iframeRef}
            forceReload={forceReload}
            onOpenInNewTab={handleOpenInNewTab}
            onDownload={handleDownload}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-muted rounded-md">
            <ErrorDisplay 
              error={previewError || "Document preview not available. Please try refreshing or check storage path."}
              onRetry={handleRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
};
