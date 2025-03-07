
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ViewerToolbar } from "./components/ViewerToolbar";
import { DocumentViewerFrame } from "./components/DocumentViewerFrame";
import { useDocumentPreview } from "./hooks/useDocumentPreview";
import usePreviewState from "./hooks/usePreviewState";
import { ErrorDisplay } from "./components/ErrorDisplay";

interface DocumentPreviewProps {
  storagePath: string;
  documentId: string;
  title: string;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  storagePath,
  documentId,
  title,
  onAnalysisComplete
}) => {
  const {
    fileExists,
    fileUrl,
    isExcelFile,
    previewError,
    setPreviewError,
    checkFile
  } = usePreviewState(storagePath, documentId, title, onAnalysisComplete);

  const [forceReload, setForceReload] = useState(0);
  const {
    isLoading,
    setIsLoading,
    zoomLevel,
    useDirectLink,
    setUseDirectLink,
    isRetrying,
    setIsRetrying,
    iframeRef,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload
  } = useDocumentPreview(fileUrl, title);

  useEffect(() => {
    if (storagePath) {
      const fetchDocumentUrl = async () => {
        try {
          await checkFile();
          setIsLoading(false);
        } catch (error) {
          console.error("Error getting document URL:", error);
          setIsLoading(false);
        }
      };
      fetchDocumentUrl();
    }
  }, [storagePath, documentId, forceReload]);

  useEffect(() => {
    if (previewError && 
        (previewError.includes('blocked by Chrome') || 
         previewError.includes('Failed to fetch') || 
         previewError.includes('CORS'))) {
      setUseDirectLink(true);
    }
  }, [previewError]);

  const handleIframeLoad = () => setIsLoading(false);
  const handleIframeError = () => {
    setIsLoading(false);
    if (!useDirectLink) {
      setUseDirectLink(true);
    }
  };

  const handleRefresh = async () => {
    setIsRetrying(true);
    setIsLoading(true);
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

  const isPdfFile = storagePath.toLowerCase().endsWith('.pdf');
  const isDocFile = storagePath.toLowerCase().endsWith('.doc') || storagePath.toLowerCase().endsWith('.docx');

  return (
    <div className="flex flex-col h-full">      
      <div className="flex-grow relative">
        {fileExists && fileUrl ? (
          <div className="h-full flex flex-col">
            <ViewerToolbar
              title={title}
              zoomLevel={zoomLevel}
              isRetrying={isRetrying}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onRefresh={handleRefresh}
              onOpenInNewTab={handleOpenInNewTab}
              onDownload={handleDownload}
            />
            
            <div className="flex-1 overflow-hidden relative">
              <DocumentViewerFrame
                fileUrl={fileUrl}
                title={title}
                isLoading={isLoading}
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
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-muted rounded-md">
            <ErrorDisplay 
              error="Document preview not available. Please try refreshing or check storage path."
              onRetry={handleRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
};
