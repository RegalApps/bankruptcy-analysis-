
import React from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "../hooks/useDocumentAnalysis";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { StuckAnalysisAlert } from "./components/StuckAnalysisAlert";

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

  const state = {
    fileExists,
    fileUrl,
    isExcelFile,
    previewError,
    setPreviewError,
  };

  const analysis = {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    setSession,
    handleAnalyzeDocument
  };

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

  const showStuckAnalysisAlert = isAnalysisStuck.stuck;

  return (
    <div className="flex flex-col h-full">
      {/* Show error message if something went wrong */}
      {state.previewError && (
        <PreviewErrorAlert 
          error={state.previewError} 
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
      {analysis.analyzing && (
        <AnalysisProgress
          progress={analysis.progress}
          analysisStep={analysis.analysisStep}
          processingStage={analysis.processingStage}
        />
      )}
      
      {/* Document Viewer for the document */}
      <div className="flex-grow relative">
        {state.fileExists ? (
          <div className="h-full flex items-center justify-center">
            <iframe 
              src={state.fileUrl || ''} 
              className="w-full h-full border-0"
              title={`Document Preview: ${title}`}
            />
            {/* Controls are added inline instead of using a separate component */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
              <button
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm flex items-center gap-2"
                onClick={() => analysis.handleAnalyzeDocument()}
                disabled={analysis.analyzing}
              >
                {analysis.analyzing ? "Analyzing..." : "Analyze Document"}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-muted rounded-md">
            <ErrorDisplay 
              error="Document file not found" 
              onRetry={() => checkFile()}
            />
          </div>
        )}
      </div>
    </div>
  );
};
