
import React, { useState, useEffect, useCallback } from "react";
import { DocumentPreviewContent } from "./components/DocumentPreviewContent";
import { PreviewControls } from "./PreviewControls";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { ViewerLoadingState } from "../components/ViewerLoadingState";
import { ViewerErrorState } from "../components/ViewerErrorState";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { Risk } from "../types";
import usePreviewState from "./hooks/usePreviewState";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DocumentPreviewProps {
  documentId: string;
  storagePath?: string;
  title?: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
  bypassAnalysis?: boolean;
  onLoadFailure?: () => void;
  isForm31GreenTech?: boolean;
  isForm47?: boolean;
  onAnalysisComplete?: (id: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  storagePath = "",
  title = "Document",
  activeRiskId = null,
  onRiskSelect,
  bypassAnalysis = false,
  onLoadFailure,
  isForm31GreenTech = false,
  isForm47 = false,
  onAnalysisComplete
}) => {
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  
  const effectiveStoragePath = isForm31GreenTech 
    ? "demo/greentech-form31-proof-of-claim.pdf" 
    : (isForm47 ? "demo/form47-consumer-proposal.pdf" : storagePath);

  useEffect(() => {
    if ((!storagePath || storagePath.trim() === "") && 
        (isForm31GreenTech || documentId === "greentech-form31" || documentId === "form31")) {
      console.log("Using demo Form 31 document path");
    } else if ((!storagePath || storagePath.trim() === "") && 
        (isForm47 || documentId === "form47")) {
      console.log("Using demo Form 47 document path");
    } else if (!storagePath || storagePath.trim() === "") {
      console.error("No storage path provided for document:", documentId);
    }
  }, [storagePath, documentId, isForm31GreenTech, isForm47]);

  // Create a wrapper function that handles the callback if it exists
  const handleAnalysisComplete = useCallback((id: string) => {
    console.log("Analysis complete called with ID:", id);
    if (onAnalysisComplete) {
      onAnalysisComplete(id);
    }
  }, [onAnalysisComplete]);

  // Pass the wrapper function to usePreviewState with correct parameter order
  const previewState = usePreviewState(
    effectiveStoragePath,
    documentId,
    title,
    bypassAnalysis,
    handleAnalysisComplete 
  );

  useEffect(() => {
    if (isForm31GreenTech || 
        documentId === "greentech-form31" || 
        documentId === "form31" || 
        documentId === "form-31-greentech") {
      const applyForm31Analysis = async () => {
        try {
          const { data: existingAnalysis } = await supabase
            .from('document_analysis')
            .select('*')
            .eq('document_id', documentId)
            .maybeSingle();
          
          if (!existingAnalysis) {
            const { default: analyzeForm31 } = await import('@/utils/documents/form31Analyzer');
            
            const analysisResult = analyzeForm31('GreenTech Supplies Inc. Proof of Claim Form 31');
            
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData?.user?.id) {
              await supabase
                .from('document_analysis')
                .upsert({
                  document_id: documentId,
                  user_id: userData.user.id,
                  content: analysisResult
                });
                
              console.log('Form 31 analysis added for demo document');
              
              // Pass the ID to our wrapper function
              handleAnalysisComplete(documentId);
            }
          }
        } catch (error) {
          console.error('Error applying Form 31 analysis:', error);
        }
      };
      
      applyForm31Analysis();
    }
  }, [documentId, isForm31GreenTech, handleAnalysisComplete]);
  
  const handleRetry = () => {
    previewState.checkFile();
  };
  
  const handleRunDiagnostics = () => {
    setDiagnosticMode(true);
    toast.info("Running diagnostics on document...");
    
    supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error(`Database error: ${error.message}`);
        } else if (data) {
          toast.success(`Document record found: ${data.title}`);
          console.log("Document database record:", data);
          
          if (!data.storage_path) {
            toast.error("Document has no storage path!");
          }
        }
      });
      
    if (storagePath) {
      supabase.storage
        .from('documents')
        .download(storagePath)
        .then(({ data, error }) => {
          if (error) {
            toast.error(`Storage error: ${error.message}`);
          } else if (data) {
            toast.success("File successfully downloaded from storage");
          }
        });
    }
    
    setTimeout(() => setDiagnosticMode(false), 10000);
  };

  if (previewState.previewError && !previewState.isLoading) {
    return (
      <div className="h-full flex flex-col">
        <PreviewErrorAlert
          error={previewState.previewError}
          onRefresh={previewState.checkFile}
          publicUrl={previewState.fileUrl || ""}
          documentId={documentId}
          onRunDiagnostics={() => setDiagnosticMode(true)}
        />
        
        <ViewerErrorState 
          error={previewState.previewError} 
          onRetry={previewState.checkFile} 
        />
      </div>
    );
  }

  if (previewState.isLoading) {
    return (
      <ViewerLoadingState 
        onRetry={previewState.checkFile}
        networkError={previewState.networkStatus === 'offline'}
      />
    );
  }
  
  return (
    <DocumentPreviewContent
      documentId={documentId}
      storagePath={effectiveStoragePath}
      title={title}
      previewState={previewState}
      activeRiskId={activeRiskId}
      onRiskSelect={onRiskSelect}
      onLoadFailure={onLoadFailure}
      isForm31GreenTech={isForm31GreenTech}
    />
  );
};
