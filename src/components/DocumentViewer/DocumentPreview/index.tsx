
import React, { useState, useEffect } from "react";
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
  isForm47 = false
}) => {
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  
  // Use Form 31 specific storage path if flag is set
  const effectiveStoragePath = isForm31GreenTech 
    ? "demo/greentech-form31-proof-of-claim.pdf" 
    : (isForm47 ? "demo/form47-consumer-proposal.pdf" : storagePath);

  // If we don't have a storagePath but the document is a special demo one, use demo paths
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

  const previewState = usePreviewState(
    effectiveStoragePath,
    documentId,
    title,
    undefined,
    bypassAnalysis
  );

  const {
    previewError,
    isLoading,
    networkStatus,
    checkFile,
    fileExists,
    fileUrl,
    documentRisks
  } = previewState;

  // Apply local analysis for Form 31 GreenTech demo document
  useEffect(() => {
    if (isForm31GreenTech || 
        documentId === "greentech-form31" || 
        documentId === "form31" || 
        documentId === "form-31-greentech") {
      const applyForm31Analysis = async () => {
        try {
          // Check if analysis exists
          const { data: existingAnalysis } = await supabase
            .from('document_analysis')
            .select('*')
            .eq('document_id', documentId)
            .maybeSingle();
          
          if (!existingAnalysis) {
            // Import the Form 31 analyzer dynamically to avoid circular dependencies
            const { default: analyzeForm31 } = await import('@/utils/documents/form31Analyzer');
            
            // Create analysis result
            const analysisResult = analyzeForm31('GreenTech Supplies Inc. Proof of Claim Form 31');
            
            // Get current user
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData?.user?.id) {
              // Insert analysis
              await supabase
                .from('document_analysis')
                .upsert({
                  document_id: documentId,
                  user_id: userData.user.id,
                  content: analysisResult
                });
                
              console.log('Form 31 analysis added for demo document');
            }
          }
        } catch (error) {
          console.error('Error applying Form 31 analysis:', error);
        }
      };
      
      applyForm31Analysis();
    }
  }, [documentId, isForm31GreenTech]);
  
  const handleRetry = () => {
    checkFile();
  };
  
  const handleRunDiagnostics = () => {
    setDiagnosticMode(true);
    toast.info("Running diagnostics on document...");
    
    // Check document record
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
      
    // See if we can get the file directly
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

  // If there's an error with the preview
  if (previewError && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <PreviewErrorAlert
          error={previewError}
          onRefresh={handleRetry}
          publicUrl={fileUrl || ""}
          documentId={documentId}
          onRunDiagnostics={handleRunDiagnostics}
        />
        
        <ViewerErrorState 
          error={previewError} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  // If the document is still loading
  if (isLoading) {
    return (
      <ViewerLoadingState 
        onRetry={handleRetry}
        networkError={networkStatus === 'offline'}
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
