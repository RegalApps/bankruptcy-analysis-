
import React, { useState, useEffect } from "react";
import { EnhancedPDFViewer } from "./EnhancedPDFViewer";
import { DocumentViewerFrame } from "./DocumentViewerFrame";
import { PreviewControls } from "../PreviewControls";
import { DocumentObject } from "./DocumentObject";
import { DocumentPreviewContentProps } from "../types";

export const DocumentPreviewContent: React.FC<DocumentPreviewContentProps> = ({
  documentId,
  storagePath,
  title,
  previewState,
  activeRiskId = null,
  onRiskSelect = () => {},
  onLoadFailure,
  isForm31GreenTech
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [forceReload, setForceReload] = useState(Date.now());
  
  // Handle zoom in/out functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 60));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleRefresh = () => {
    setForceReload(Date.now());
  };

  // Call onLoadFailure when there's a preview error
  useEffect(() => {
    if (previewState.previewError && onLoadFailure) {
      onLoadFailure();
    }
  }, [previewState.previewError, onLoadFailure]);

  const { 
    fileExists,
    fileUrl,
    isPdfFile,
    isExcelFile,
    isDocFile,
    isLoading,
    previewError,
    documentRisks
  } = previewState;
  
  const handleDocumentLoad = () => {
    console.log("Document loaded successfully");
  };
  
  const handleDocumentError = () => {
    console.error("Error loading document");
    if (onLoadFailure) onLoadFailure();
  };

  // Define content based on loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If we have an error or no file URL
  if (previewError || !fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center p-6">
        <div className="bg-destructive text-white rounded-full p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Document Error</h3>
        <p className="text-sm text-muted-foreground mb-4">{previewError || "Could not load the document. It might be in an unsupported format or inaccessible."}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-medium"
          onClick={handleRefresh}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use explicit path checking in addition to the isExcelFile flag
  const actuallyIsExcel = isExcelFile && storagePath.match(/\.(xlsx|xls|csv)$/i);
  
  // For Form47, we know it's a PDF regardless of what the system thinks
  const isForm47 = title?.toLowerCase().includes('form 47') || title?.toLowerCase().includes('consumer proposal');
  
  // For Excel files that aren't actually Form 47
  if (actuallyIsExcel && !isForm47) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-2 bg-muted/20">
          <div className="flex-1 truncate">
            <h3 className="text-sm font-medium">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
              onClick={() => window.open(fileUrl, "_blank")}
              title="Open in new tab"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-4"/><path d="M16 3h5v5"/><path d="M21 3 10 14"/></svg>
            </button>
            <button 
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
              onClick={() => {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = title;
                link.click();
              }}
              title="Download document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 17v-10H5.5A2.5 2.5 0 0 1 3 4.5v0A2.5 2.5 0 0 1 5.5 2H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/><path d="m8 15-2 2 2 2"/></svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <DocumentObject
            publicUrl={fileUrl}
            isExcelFile={true}
            storagePath={storagePath}
            documentId={documentId}
            onError={handleDocumentError}
          />
        </div>
      </div>
    );
  }

  // Regular PDF viewer
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 bg-muted/20">
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8"/><circle cx="12" cy="12" r="10"/></svg>
          </button>
          
          <span className="text-xs font-medium w-12 text-center">{zoomLevel}%</span>
          
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="10"/></svg>
          </button>
          
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-xs"
            onClick={handleZoomReset}
            title="Reset Zoom"
          >
            100%
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            title="Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </button>
          
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            onClick={() => window.open(fileUrl, "_blank")}
            title="Open in new tab"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-4"/><path d="M16 3h5v5"/><path d="M21 3 10 14"/></svg>
          </button>
          
          <button 
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            onClick={() => {
              const link = document.createElement("a");
              link.href = fileUrl;
              link.download = title;
              link.click();
            }}
            title="Download document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 17v-10H5.5A2.5 2.5 0 0 1 3 4.5v0A2.5 2.5 0 0 1 5.5 2H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/><path d="m8 15-2 2 2 2"/></svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <EnhancedPDFViewer
          fileUrl={fileUrl}
          title={title}
          zoomLevel={zoomLevel}
          documentId={documentId}
          risks={documentRisks || []}
          activeRiskId={activeRiskId}
          onRiskSelect={onRiskSelect}
          onLoad={handleDocumentLoad}
          onError={handleDocumentError}
        />
      </div>
    </div>
  );
};
