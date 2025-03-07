
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { DocumentViewerFrame } from "./components/DocumentViewerFrame";
import { useDocumentPreview } from "./hooks/useDocumentPreview";
import usePreviewState from "./hooks/usePreviewState";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Printer } from "lucide-react";

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
  // Create the iframe ref first
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const {
    isLoading,
    setIsLoading,
    zoomLevel,
    useDirectLink,
    setUseDirectLink,
    isRetrying,
    setIsRetrying,
    handleZoomIn,
    handleZoomOut,
    handleOpenInNewTab,
    handleDownload,
    handlePrint
  } = useDocumentPreview(fileUrl, title, iframeRef);

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

  // Simple zoom controls at the top of the viewer
  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted/30 p-2 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut} 
            className="p-1 hover:bg-muted rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
          </button>
          <span className="text-xs font-mono">{zoomLevel}%</span>
          <button 
            onClick={handleZoomIn} 
            className="p-1 hover:bg-muted rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenInNewTab}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            Open
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRetrying}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Refresh
          </button>
          <button 
            onClick={handleDownload}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download
          </button>
          <button 
            onClick={handlePrint}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-muted/50 rounded-md border"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {fileExists && fileUrl ? (
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
