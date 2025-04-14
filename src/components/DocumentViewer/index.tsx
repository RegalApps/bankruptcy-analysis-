
import { useEffect, useCallback } from "react";
import { ViewerLayout } from "./layouts/ViewerLayout";
import { DocumentDetails } from "./types";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { ViewerNotFoundState } from "./components/ViewerNotFoundState";
import { ViewerContent } from "./components/ViewerContent";
import { useDocumentViewerState } from "./hooks/useDocumentViewerState";
import { useDocumentDetails } from "./hooks/useDocumentDetails";
import { createForm47DemoDocument } from "./utils/demoDocuments";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/lib/supabase";

interface DocumentViewerProps {
  documentId: string;
  bypassProcessing?: boolean;
  onLoadFailure?: () => void;
  documentTitle?: string | null;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  bypassProcessing = false,
  onLoadFailure,
  documentTitle,
  isForm47 = false,
  isForm31GreenTech = false
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

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: (doc) => {
      setDocument(doc);
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Error fetching document details:", err);
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
    if (documentId) {
      setIsLoading(true);
      fetchDocumentDetails();
    }
  }, [documentId, fetchDocumentDetails]);

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
        <ViewerErrorState error={error} onRetry={refreshDocumentDetails} />
      </ViewerLayout>
    );
  }

  if (!document && (documentId !== 'form47' && !isForm47)) {
    if (onLoadFailure) {
      onLoadFailure();
    }
    return (
      <ViewerLayout documentId={documentId} documentTitle={documentTitle}>
        <ViewerNotFoundState />
      </ViewerLayout>
    );
  }

  // Special handling for Form 47 when no document is found but form47 is requested
  if (!document && (documentId === 'form47' || isForm47)) {
    const mockDocument = createForm47DemoDocument(session?.user?.id);
    
    return (
      <ViewerLayout 
        documentId={documentId} 
        documentTitle={documentTitle || "Form 47 - Consumer Proposal"}
      >
        <ViewerContent
          documentId={documentId}
          storagePath="demo/form47-consumer-proposal.pdf"
          title="Form 47 - Consumer Proposal"
          selectedRiskId={selectedRiskId}
          onRiskSelect={handleSelectRisk}
          bypassProcessing={bypassProcessing}
          onLoadFailure={onLoadFailure}
          isForm47={true}
          analysis={mockDocument.analysis?.[0]?.content}
        />
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
        isForm31GreenTech={isForm31GreenTech}
        isForm47={isForm47}
        analysis={document?.analysis?.[0]?.content}
      />
    </ViewerLayout>
  );
};

