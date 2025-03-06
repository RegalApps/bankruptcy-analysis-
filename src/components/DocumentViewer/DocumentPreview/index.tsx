
import React, { useEffect } from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "../hooks/useDocumentAnalysis";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { StuckAnalysisAlert } from "./components/StuckAnalysisAlert";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

  // Effect to get document URL when component loads
  useEffect(() => {
    if (storagePath) {
      const fetchDocumentUrl = async () => {
        try {
          const { data } = await supabase.storage
            .from('documents')
            .getPublicUrl(storagePath);

          if (data?.publicUrl) {
            // Document exists, update state
            setPreviewError(null);
            checkFile();
          } else {
            setPreviewError("Document not found in storage");
          }
        } catch (error) {
          console.error("Error getting document URL:", error);
          setPreviewError("Failed to get document URL");
        }
      };

      fetchDocumentUrl();
    }
  }, [storagePath, documentId]);

  if (!storagePath) {
    return <ErrorDisplay error="No document selected" onRetry={() => {}} />;
  }

  if (previewError) {
    return (
      <div className="flex flex-col h-full">
        <PreviewErrorAlert 
          error={previewError} 
          onRefresh={() => checkFile()}
          publicUrl={fileUrl || ''}
        />
      </div>
    );
  }

  const showStuckAnalysisAlert = isAnalysisStuck?.stuck;

  return (
    <div className="flex flex-col h-full">
      {/* Show error message if something went wrong */}
      {previewError && (
        <PreviewErrorAlert 
          error={previewError} 
          onRefresh={() => checkFile()}
          publicUrl={fileUrl || ''}
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
          <div className="h-full flex items-center justify-center">
            <iframe 
              src={fileUrl} 
              className="w-full h-full border-0"
              title={`Document Preview: ${title}`}
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
              error="Document file not found. Please check storage path or try refreshing." 
              onRetry={() => {
                toast.info("Attempting to refresh document...");
                checkFile();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
