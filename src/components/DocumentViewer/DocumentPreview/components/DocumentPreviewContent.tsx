
import React, { useState } from "react";
import { DocumentPreviewContentProps } from "../types";
import { DocumentObject } from "../DocumentObject";
import { EnhancedPDFViewer } from "./EnhancedPDFViewer";
import { useDocumentPreview } from "../hooks/useDocumentPreview";
import { ViewerToolbar } from "./ViewerToolbar";
import { ErrorDisplay } from "./ErrorDisplay";
import { toast } from "sonner";

export const DocumentPreviewContent: React.FC<DocumentPreviewContentProps> = ({
  storagePath,
  documentId,
  title,
  previewState
}) => {
  const {
    fileExists,
    fileUrl,
    isPdfFile,
    isExcelFile,
    isDocFile,
    isLoading,
    previewError,
    setPreviewError,
    checkFile,
    documentRisks
  } = previewState;

  const {
    zoomLevel,
    useDirectLink,
    isRetrying,
    iframeRef,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload,
    handlePrint,
    setIsLoading
  } = useDocumentPreview(fileUrl, title);

  // Force reload counter for when we need to reload the iframe
  const [forceReload, setForceReload] = useState(0);

  const handleRetry = async () => {
    setPreviewError(null);
    await checkFile();
  };

  const handleRefresh = () => {
    setForceReload(prev => prev + 1);
    setIsLoading(true);
  };

  if (previewError) {
    return <ErrorDisplay error={previewError} onRetry={handleRetry} />;
  }

  // Check if this is a PDF file by checking the path
  const isPdfDocument = storagePath.toLowerCase().endsWith('.pdf');

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
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

      {/* Document Viewer */}
      <div className="flex-1 overflow-hidden relative">
        {isPdfDocument ? (
          <EnhancedPDFViewer
            fileUrl={fileUrl}
            title={title}
            zoomLevel={zoomLevel}
            documentId={documentId}
            risks={documentRisks}
            onLoad={() => setIsLoading(false)}
            onError={(errorMessage) => {
              setIsLoading(false);
              // Check if this is a token error
              if (errorMessage?.includes('token') || errorMessage?.includes('JWT')) {
                setPreviewError("Authentication error: Your session may have expired. Please refresh the page and try again.");
                toast.error("Authentication error with document. Refreshing your session might help.");
              } else {
                setPreviewError("Failed to load PDF document");
              }
            }}
          />
        ) : (
          <DocumentObject
            publicUrl={fileUrl}
            isExcelFile={storagePath.toLowerCase().includes('.xls') || storagePath.toLowerCase().includes('.csv')}
            storagePath={storagePath}
            documentId={documentId}
            onError={() => {
              setIsLoading(false);
              setPreviewError("Failed to load document");
            }}
          />
        )}
      </div>
    </div>
  );
};
