
import React, { useEffect, useState } from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { PDFViewer } from "./components/PDFViewer";
import { DocumentViewerFrame } from "./components/DocumentViewerFrame";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast"; // Fixed import path
import { ExcelPreview } from "../ExcelPreview";

interface DocumentPreviewProps {
  documentId: string;
  storagePath: string;
  title: string;
  activeRiskId?: string | null;
  onRiskSelect?: (id: string) => void;
  bypassAnalysis?: boolean;
  onLoadFailure?: () => void;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  onAnalysisComplete?: (id: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  storagePath,
  title,
  activeRiskId,
  onRiskSelect,
  bypassAnalysis = false,
  onLoadFailure,
  isForm47 = false,
  isForm31GreenTech = false,
  onAnalysisComplete
}) => {
  const previewState = usePreviewState(storagePath, documentId, title, bypassAnalysis, onAnalysisComplete);
  const {
    fileExists,
    fileUrl,
    isPdfFile,
    isExcelFile,
    isLoading,
    previewError,
    setPreviewError,
    checkFile,
    networkStatus,
    attemptCount,
    documentRisks
  } = previewState;

  // Log important props and state for debugging
  useEffect(() => {
    console.log("DocumentPreview component rendered with:", {
      documentId,
      storagePath,
      title,
      isForm31GreenTech,
      isForm47,
      hasAnalysisCompleteCallback: !!onAnalysisComplete,
      fileExists,
      fileUrl: fileUrl ? "exists" : "not available"
    });
  }, [documentId, storagePath, title, isForm31GreenTech, isForm47, onAnalysisComplete, fileExists, fileUrl]);

  // Fetch session information for document analysis
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session || null);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, []);

  // Initialize document analysis
  const {
    analyzing,
    analysisStep,
    progress,
    handleAnalyzeDocument,
    processingStage,
    error: analysisError
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  // Start analysis if not bypassed
  useEffect(() => {
    if (!bypassAnalysis && fileExists && session && !analyzing) {
      console.log("Starting document analysis");
      handleAnalyzeDocument(session);
    }
  }, [bypassAnalysis, fileExists, session, analyzing, handleAnalyzeDocument]);

  // Handle load failure
  useEffect(() => {
    if (previewError && onLoadFailure) {
      onLoadFailure();
    }
  }, [previewError, onLoadFailure]);

  // Render document based on file type
  const renderDocument = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full">Loading document...</div>;
    }

    if (previewError) {
      return <PreviewErrorAlert 
        error={previewError} 
        onRefresh={checkFile} 
        publicUrl={fileUrl || ""}
        documentId={documentId}
      />;
    }

    if (!fileExists || !fileUrl) {
      return <div className="flex justify-center items-center h-full">Document not found</div>;
    }

    if (isExcelFile(storagePath)) {
      return <ExcelPreview storageUrl={fileUrl} />;
    }

    // Default to PDF viewer
    return (
      <PDFViewer
        fileUrl={fileUrl}
        activeRiskId={activeRiskId}
        onRiskSelect={onRiskSelect}
        risks={documentRisks}
      />
    );
  };

  return (
    <DocumentViewerFrame>
      {!bypassAnalysis && analyzing && (
        <AnalysisProgress
          progress={progress}
          analysisStep={analysisStep}
          processingStage={processingStage}
        />
      )}
      {renderDocument()}
    </DocumentViewerFrame>
  );
};
