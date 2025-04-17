
import { useEffect, useCallback } from "react";
import { ViewerLayout } from "./layouts/ViewerLayout";
import { DocumentDetails } from "./types";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { ViewerNotFoundState } from "./components/ViewerNotFoundState";
import { ViewerContent } from "./components/ViewerContent";
import { useDocumentViewerState } from "./hooks/useDocumentViewerState";
import { useDocumentDetails } from "./hooks/useDocumentDetails";
import { createForm47DemoDocument, createForm31DemoDocument } from "./utils/demoDocuments";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/lib/supabase";
import { isDocumentForm31 } from "./utils/documentTypeUtils";
import { toast } from "sonner";

interface DocumentViewerProps {
  documentId: string;
  bypassProcessing?: boolean;
  onLoadFailure?: () => void;
  documentTitle?: string | null;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  onAnalysisComplete?: (id: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  bypassProcessing = false,
  onLoadFailure,
  documentTitle,
  isForm47 = false,
  isForm31GreenTech = false,
  onAnalysisComplete
}) => {
  const { session } = useAuthState();
  const {
    document,
    setDocument,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedRiskId,
    setSelectedRiskId
  } = useDocumentViewerState();

  // Enhanced Form 31 detection using our centralized utility
  const detectedForm31 = isDocumentForm31(
    document,
    documentId,
    document?.storage_path,
    documentTitle || document?.title
  );

  const finalIsForm31GreenTech = isForm31GreenTech || detectedForm31;

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: (doc) => {
      console.log("Document details fetched successfully:", doc.id);
      setDocument(doc);
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Error fetching document details:", err);
      
      // For Form 31 documents, don't show the error but use the mock document
      if (finalIsForm31GreenTech) {
        console.log("Form 31 document fetch failed, using mock document");
        const mockDocument = createForm31DemoDocument(session?.user?.id);
        setDocument(mockDocument);
        setIsLoading(false);
        return;
      }
      
      setError(typeof err === 'string' ? err : err.message || "Unknown error");
      setIsLoading(false);
      onLoadFailure?.();
    }
  });

  // Function to refresh document details
  const refreshDocumentDetails = useCallback(() => {
    setIsLoading(true);
    fetchDocumentDetails();
  }, [fetchDocumentDetails]);

  useEffect(() => {
    console.log("DocumentViewer initializing with ID:", documentId, 
      "isForm47:", isForm47, 
      "isForm31GreenTech:", finalIsForm31GreenTech);
    
    // Special case for demo documents
    if (isForm47 || finalIsForm31GreenTech) {
      console.log("Using demo document for Form 47 or Form 31");
      setIsLoading(false);
      return;
    }
    
    if (documentId) {
      setIsLoading(true);
      fetchDocumentDetails();
    }
  }, [documentId, fetchDocumentDetails, isForm47, finalIsForm31GreenTech]);

  // Create subscription to document changes
  useEffect(() => {
    if (!documentId) return;
    
    const channel = supabase
      .channel(`document-${documentId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'documents',
        filter: `id=eq.${documentId}`
      }, () => {
        console.log('Document updated, refreshing...');
        refreshDocumentDetails();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, refreshDocumentDetails]);

  const handleSelectRisk = useCallback((riskId: string) => {
    setSelectedRiskId((prevId) => (prevId === riskId ? null : riskId));
  }, []);

  const handleAnalysisComplete = useCallback((id: string) => {
    console.log("Analysis completed for document:", id);
    if (onAnalysisComplete) {
      onAnalysisComplete(id);
    }
  }, [onAnalysisComplete]);

  // Error handling and retry
  const handleRetryLoading = useCallback(() => {
    toast.info("Retrying document load...");
    setError(null);
    setIsLoading(true);
    fetchDocumentDetails();
  }, [fetchDocumentDetails]);
  
  // Enhanced error handling with Form 31 fallback
  useEffect(() => {
    if (error && finalIsForm31GreenTech) {
      console.log("Error loading Form 31 document, using fallback");
      const mockDocument = createForm31DemoDocument(session?.user?.id);
      setDocument(mockDocument);
      setError(null);
    }
  }, [error, finalIsForm31GreenTech, session?.user?.id]);

  // Fast-path for Form 47 and Form 31 documents
  if (isForm47 || finalIsForm31GreenTech) {
    const mockDocument = isForm47 ? 
      createForm47DemoDocument(session?.user?.id) : 
      createForm31DemoDocument(session?.user?.id);
    
    const demoPath = isForm47 ? 
      "demo/form47-consumer-proposal.pdf" : 
      "demo/greentech-form31-proof-of-claim.pdf";
    
    const demoTitle = isForm47 ? 
      "Form 47 - Consumer Proposal" : 
      "Form 31 - GreenTech Proof of Claim";
    
    return (
      <ViewerLayout 
        documentId={documentId} 
        documentTitle={documentTitle || demoTitle}
      >
        <ViewerContent
          documentId={documentId}
          storagePath={demoPath}
          title={documentTitle || demoTitle}
          selectedRiskId={selectedRiskId}
          onRiskSelect={handleSelectRisk}
          bypassProcessing={true}
          onLoadFailure={onLoadFailure}
          isForm47={isForm47}
          isForm31GreenTech={finalIsForm31GreenTech}
          analysis={mockDocument.analysis?.[0]?.content}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </ViewerLayout>
    );
  }

  if (isLoading) {
    return (
      <ViewerLayout documentId={documentId} documentTitle={documentTitle}>
        <ViewerLoadingState />
      </ViewerLayout>
    );
  }

  if (error) {
    return (
      <ViewerLayout documentId={documentId} documentTitle={documentTitle}>
        <ViewerErrorState error={error} onRetry={handleRetryLoading} />
      </ViewerLayout>
    );
  }

  if (!document) {
    if (onLoadFailure) {
      onLoadFailure();
    }
    return (
      <ViewerLayout documentId={documentId} documentTitle={documentTitle}>
        <ViewerNotFoundState />
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout 
      documentId={documentId} 
      documentTitle={documentTitle || document?.title}
    >
      <ViewerContent
        documentId={documentId}
        storagePath={document?.storage_path || ""}
        title={documentTitle || document?.title}
        selectedRiskId={selectedRiskId}
        onRiskSelect={handleSelectRisk}
        bypassProcessing={bypassProcessing}
        onLoadFailure={onLoadFailure}
        isForm31GreenTech={finalIsForm31GreenTech}
        isForm47={isForm47}
        analysis={document?.analysis?.[0]?.content}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </ViewerLayout>
  );
};
