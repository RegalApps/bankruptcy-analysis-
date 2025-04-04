
import React, { useState } from "react";
import { DocumentPreviewContentProps } from "../types";
import { DocumentObject } from "./DocumentObject";
import { EnhancedPDFViewer } from "./EnhancedPDFViewer";
import { useDocumentPreview } from "../hooks/useDocumentPreview";
import { ViewerToolbar } from "./ViewerToolbar";
import { ErrorDisplay } from "./ErrorDisplay";

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
        {isPdfFile ? (
          <EnhancedPDFViewer
            fileUrl={fileUrl}
            title={title}
            zoomLevel={zoomLevel}
            documentId={documentId}
            risks={documentRisks}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setPreviewError("Failed to load PDF document");
            }}
          />
        ) : (
          <DocumentObject
            publicUrl={fileUrl}
            isExcelFile={isExcelFile}
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
