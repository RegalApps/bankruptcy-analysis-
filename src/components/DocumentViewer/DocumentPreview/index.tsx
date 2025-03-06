
import React from "react";
import { DocumentObject } from "./DocumentObject";
import { PreviewControls } from "./PreviewControls";
import { usePreviewState } from "./hooks/usePreviewState";
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
    return <ErrorDisplay message="No document selected" details="Please select a document to preview." />;
  }

  if (previewError) {
    return (
      <div className="flex flex-col h-full">
        <PreviewErrorAlert error={previewError} />
      </div>
    );
  }

  const showStuckAnalysisAlert = isAnalysisStuck.stuck;

  return (
    <div className="flex flex-col h-full">
      {/* Show error message if something went wrong */}
      {state.previewError && (
        <PreviewErrorAlert error={state.previewError} />
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
          step={analysis.analysisStep}
          processingStage={analysis.processingStage}
        />
      )}
      
      {/* PDF Viewer for the document */}
      <div className="flex-grow relative">
        {state.fileExists ? (
          <>
            <div className="absolute inset-0">
              <DocumentObject
                url={state.fileUrl}
                isExcelFile={state.isExcelFile}
                storagePath={storagePath}
                documentId={documentId}
              />
            </div>
            <div className="absolute bottom-4 right-4">
              <PreviewControls
                url={state.fileUrl}
                title={title}
                isAnalyzing={analysis.analyzing}
                onAnalyzeClick={() => analysis.handleAnalyzeDocument()}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center p-8 bg-muted rounded-md">
            <ErrorDisplay 
              message="Document file not found" 
              details="The file may have been moved or deleted"
              showDiagnostics={true}
              documentId={documentId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
