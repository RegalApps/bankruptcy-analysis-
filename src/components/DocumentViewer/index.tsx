
import { useEffect, useCallback, useState, useMemo } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { DocumentPreview } from "./DocumentPreview";
import { useDocumentDetails } from "./hooks/useDocumentDetails";
import { ViewerLayout } from "./layouts/ViewerLayout";
import { DocumentDetails } from "./types";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { defaultContext } from "@/lib/default-context";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { useAuthState } from "@/hooks/useAuthState";
import { ViewerNotFoundState } from "./components/ViewerNotFoundState";

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
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const { session } = useAuthState();

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
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log('Could not subscribe to document updates', status);
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, refreshDocumentDetails]);

  // Create subscription to document analysis changes
  useEffect(() => {
    if (!documentId || !session?.user?.id) return;
    
    const channel = supabase
      .channel(`document-analysis-${documentId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'document_analysis',
        filter: `document_id=eq.${documentId} AND user_id=eq.${session.user.id}`
      }, () => {
        console.log('Document analysis updated, refreshing...');
        refreshDocumentDetails();
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log('Could not subscribe to document analysis updates', status);
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, session?.user?.id, refreshDocumentDetails]);

  const handleAnalysisCompleted = useCallback(() => {
    refreshDocumentDetails();
  }, [refreshDocumentDetails]);

  const handleSelectRisk = useCallback((riskId: string) => {
    setSelectedRiskId((prevId) => (prevId === riskId ? null : riskId));
  }, []);

  const storagePath = useMemo(() => {
    if (isForm31GreenTech) {
      return "demo/greentech-form31-proof-of-claim.pdf";
    }
    if (isForm47) {
      return "demo/form47-consumer-proposal.pdf";
    }
    return document?.storage_path || "";
  }, [document?.storage_path, isForm31GreenTech, isForm47]);

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
    const mockDocument: DocumentDetails = {
      id: "form47",
      title: "Form 47 - Consumer Proposal",
      type: "consumer-proposal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: session?.user?.id || "demo-user",
      storage_path: "demo/form47-consumer-proposal.pdf",
      metadata: {
        formNumber: "47",
        formType: "Consumer Proposal"
      }
    };
    
    return (
      <ViewerLayout 
        documentId={documentId} 
        documentTitle={documentTitle || "Form 47 - Consumer Proposal"}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={70} minSize={40} className="h-full">
            <DocumentPreview
              documentId={documentId}
              storagePath="demo/form47-consumer-proposal.pdf"
              title="Form 47 - Consumer Proposal"
              activeRiskId={selectedRiskId}
              onRiskSelect={handleSelectRisk}
              bypassAnalysis={bypassProcessing}
              onLoadFailure={onLoadFailure}
              isForm47={true}
            />
          </ResizablePanel>
          
          <ResizablePanel defaultSize={30} minSize={25} className="h-full p-0 overflow-y-hidden">
            <AnalysisPanel
              documentId={documentId}
              isLoading={false}
              analysis={{
                extracted_info: {
                  clientName: "John Smith",
                  formNumber: "47",
                  formType: "Consumer Proposal",
                  trusteeName: "Jane Doe, LIT",
                  dateSigned: new Date().toLocaleDateString(),
                  summary: "This is a Consumer Proposal form (Form 47) submitted under the Bankruptcy and Insolvency Act."
                },
                risks: [],
                regulatory_compliance: {
                  status: "needs_review",
                  details: "This Consumer Proposal requires review for regulatory compliance.",
                  references: ["BIA Section 66.13(2)", "BIA Section 66.14"]
                }
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout 
      documentId={documentId} 
      documentTitle={documentTitle || document?.title}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={70} minSize={40} className="h-full">
          <DocumentPreview
            documentId={documentId}
            storagePath={storagePath}
            title={documentTitle || document?.title || "Document"}
            activeRiskId={selectedRiskId}
            onRiskSelect={handleSelectRisk}
            bypassAnalysis={bypassProcessing}
            onLoadFailure={onLoadFailure}
            isForm31GreenTech={isForm31GreenTech}
            isForm47={isForm47}
          />
        </ResizablePanel>
        
        <ResizablePanel defaultSize={30} minSize={25} className="h-full p-0 overflow-y-hidden">
          <AnalysisPanel
            documentId={documentId}
            isLoading={isLoading}
            analysis={document?.analysis?.[0]?.content}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ViewerLayout>
  );
};
