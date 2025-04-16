import React, { useEffect, useState } from "react";
import usePreviewState from "./hooks/usePreviewState";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { PDFViewer } from "./components/PDFViewer";
import { DocumentViewerFrame } from "./components/DocumentViewerFrame";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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

  const {
    analyzing,
    analysisStep,
    progress,
    handleAnalyzeDocument,
    processingStage,
    error: analysisError
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  useEffect(() => {
    if (!bypassAnalysis && fileExists && session && !analyzing) {
      console.log("Starting document analysis");
      handleAnalyzeDocument(session);
    }
  }, [bypassAnalysis, fileExists, session, analyzing, handleAnalyzeDocument]);

  useEffect(() => {
    if (previewError && onLoadFailure) {
      onLoadFailure();
    }
  }, [previewError, onLoadFailure]);

  const convertedRisks = documentRisks.map(risk => ({
    ...risk,
    position: {
      x: risk.position?.x || 0,
      y: risk.position?.y || 0,
      width: risk.position?.width || 0,
      height: risk.position?.height || 0,
      page: risk.position?.page,
      rect: risk.position?.rect
    }
  }));

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

    return (
      <PDFViewer
        fileUrl={fileUrl}
        activeRiskId={activeRiskId}
        onRiskSelect={onRiskSelect}
        risks={convertedRisks}
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
