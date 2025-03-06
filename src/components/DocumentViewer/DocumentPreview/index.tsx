
import React, { useEffect, useState, useRef } from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "../hooks/useDocumentAnalysis";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { StuckAnalysisAlert } from "./components/StuckAnalysisAlert";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw, Search, ZoomIn, ZoomOut } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
    checkFile,
    handleAnalysisRetry,
    isAnalysisStuck
  } = usePreviewState(storagePath, documentId, title, onAnalysisComplete);

  const {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    setSession,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  const [isRetrying, setIsRetrying] = useState(false);
  const [forceReload, setForceReload] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [useDirectLink, setUseDirectLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Effect to get document URL when component loads
  useEffect(() => {
    if (storagePath) {
      const fetchDocumentUrl = async () => {
        try {
          console.log("Fetching document URL for path:", storagePath);
          await checkFile();
          setIsLoading(false);
        } catch (error) {
          console.error("Error getting document URL:", error);
          setPreviewError("Failed to get document URL");
          setIsLoading(false);
        }
      };

      fetchDocumentUrl();
    }
  }, [storagePath, documentId, forceReload]);

  // Check for Chrome/browser blocking errors and add backup viewers
  useEffect(() => {
    if (previewError && 
        (previewError.includes('blocked by Chrome') || 
         previewError.includes('Failed to fetch') || 
         previewError.includes('CORS'))) {
      setUseDirectLink(true);
    }
  }, [previewError]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error event
  const handleIframeError = () => {
    setIsLoading(false);
    
    // Only set useDirectLink if we haven't already tried to use Google Docs viewer
    if (!useDirectLink) {
      setUseDirectLink(true);
    }
  };

  const handleRefresh = async () => {
    setIsRetrying(true);
    setIsLoading(true);
    toast.info("Refreshing document preview...");
    try {
      // Force a complete reload
      await checkFile();
      // Update the forceReload counter to trigger iframe refresh
      setForceReload(prev => prev + 1);
      // Reset direct link flag
      setUseDirectLink(false);
      toast.success("Document refreshed");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh document");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      toast.info("Document opened in new tab");
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    try {
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = title || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  if (!storagePath) {
    return <ErrorDisplay error="No document selected" onRetry={() => {}} />;
  }

  const showStuckAnalysisAlert = isAnalysisStuck?.stuck;
  const isPdfFile = storagePath.toLowerCase().endsWith('.pdf');
  const isDocFile = storagePath.toLowerCase().endsWith('.doc') || storagePath.toLowerCase().endsWith('.docx');

  // Create Google Docs Viewer URL for better document rendering
  const getGoogleDocsViewerUrl = () => {
    if (!fileUrl) return '';
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  };

  const googleDocsViewerUrl = getGoogleDocsViewerUrl();

  return (
    <div className="flex flex-col h-full">
      {/* Show error message if something went wrong */}
      {previewError && (
        <PreviewErrorAlert 
          error={previewError} 
          onRefresh={handleRefresh}
          publicUrl={fileUrl || ''}
          documentId={documentId}
          onRunDiagnostics={() => handleAnalysisRetry()}
        />
      )}
      
      {/* Show analysis stuck alert if needed */}
      {showStuckAnalysisAlert && (
        <StuckAnalysisAlert 
          documentId={documentId} 
          minutesStuck={isAnalysisStuck.minutesStuck}
          onRetryComplete={handleAnalysisRetry}
        />
      )}
      
      {/* Show analysis progress if document is being analyzed */}
      {analyzing && (
        <AnalysisProgress
          progress={progress}
          analysisStep={analysisStep}
          processingStage={processingStage}
        />
      )}
      
      {/* Document Viewer for the document */}
      <div className="flex-grow relative">
        {fileExists && fileUrl ? (
          <div className="h-full flex flex-col">
            <div className="bg-muted/50 p-2 flex justify-between items-center border-b">
              <span className="text-sm font-medium truncate flex-1">{title}</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleZoomOut}
                    className="h-7 w-7"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs font-mono">{zoomLevel}%</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleZoomIn}
                    className="h-7 w-7"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="h-7"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Open
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRetrying}
                  className="h-7"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="h-7"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="text-center">
                    <LoadingSpinner size="large" className="mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading document preview...</p>
                  </div>
                </div>
              )}
              
              {/* Use Google Docs Viewer for documents with issues */}
              {useDirectLink && isPdfFile && (
                <object
                  data={fileUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  onLoad={() => setIsLoading(false)}
                >
                  <iframe 
                    src={googleDocsViewerUrl}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                </object>
              )}
              
              {/* Use Google Docs Viewer for DOC/DOCX files */}
              {((useDirectLink && isDocFile) || isDocFile) && (
                <iframe 
                  src={googleDocsViewerUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              )}
              
              {/* Default viewer for PDFs and other files */}
              {!useDirectLink && !isDocFile && (
                <iframe 
                  ref={iframeRef}
                  src={`${fileUrl}?t=${forceReload}`}
                  className="w-full h-full border-0"
                  title={`Document Preview: ${title}`}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  style={{transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top'}}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              )}
              
              {/* Fallback for when all viewers fail */}
              {useDirectLink && !isPdfFile && !isDocFile && (
                <div className="w-full h-full flex items-center justify-center bg-muted/30">
                  <div className="text-center max-w-md p-6">
                    <p className="text-muted-foreground mb-4">
                      Browser security settings are preventing the document from being displayed inline.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleOpenInNewTab} className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Document in New Tab
                      </Button>
                      <Button variant="outline" onClick={handleDownload} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Document
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Controls are added inline instead of using a separate component */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
              <button
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm flex items-center gap-2"
                onClick={() => handleAnalyzeDocument()}
                disabled={analyzing}
              >
                <Search className="h-3.5 w-3.5" />
                {analyzing ? "Analyzing..." : "Analyze Document"}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-muted rounded-md">
            <ErrorDisplay 
              error={`Document preview not available. ${previewError || 'Try refreshing or check storage path.'}`} 
              onRetry={handleRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
};
