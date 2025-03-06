
import React, { useEffect, useState } from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "../hooks/useDocumentAnalysis";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { StuckAnalysisAlert } from "./components/StuckAnalysisAlert";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

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

  // Effect to get document URL when component loads
  useEffect(() => {
    if (storagePath) {
      const fetchDocumentUrl = async () => {
        try {
          console.log("Fetching document URL for path:", storagePath);
          checkFile();
        } catch (error) {
          console.error("Error getting document URL:", error);
          setPreviewError("Failed to get document URL");
        }
      };

      fetchDocumentUrl();
    }
  }, [storagePath, documentId, forceReload]);

  const handleRefresh = async () => {
    setIsRetrying(true);
    toast.info("Refreshing document preview...");
    try {
      // Force a complete reload
      await checkFile();
      // Update the forceReload counter to trigger iframe refresh
      setForceReload(prev => prev + 1);
      toast.success("Document refreshed");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh document");
    } finally {
      setIsRetrying(false);
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

  if (!storagePath) {
    return <ErrorDisplay error="No document selected" onRetry={() => {}} />;
  }

  const showStuckAnalysisAlert = isAnalysisStuck?.stuck;

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
              <span className="text-sm font-medium truncate">{title}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRetrying}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <iframe 
              src={`${fileUrl}?t=${forceReload}`}
              className="w-full h-full border-0"
              title={`Document Preview: ${title}`}
              sandbox="allow-same-origin allow-scripts allow-forms"
              referrerPolicy="no-referrer"
              key={`iframe-${forceReload}`}
            />
            {/* Controls are added inline instead of using a separate component */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
              <button
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm flex items-center gap-2"
                onClick={() => handleAnalyzeDocument()}
                disabled={analyzing}
              >
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
