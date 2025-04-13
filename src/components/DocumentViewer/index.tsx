
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
  const [error, setError] = useState<Error | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const { session } = useAuthState();

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: (doc) => {
      setDocument(doc);
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Error fetching document details:", err);
      setError(err);
      setIsLoading(false);
      onLoadFailure?.();
    }
  });

  useEffect(() => {
    if (documentId) {
      setIsLoading(true);
      fetchDocumentDetails();
    }
  }, [documentId]);

  const updateDocumentDetails = useCallback(async () => {
    try {
      const updatedDoc = await fetchDocumentDetails();
      if (updatedDoc) {
        setDocument(updatedDoc);
      }
    } catch (err) {
      console.error("Error updating document details:", err);
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
        updateDocumentDetails();
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log('Could not subscribe to document updates', status);
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, updateDocumentDetails]);

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
        updateDocumentDetails();
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log('Could not subscribe to document analysis updates', status);
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, session?.user?.id, updateDocumentDetails]);

  const handleAnalysisCompleted = useCallback(() => {
    updateDocumentDetails();
  }, [updateDocumentDetails]);

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
      <ViewerLayout documentId={documentId}>
        <ViewerLoadingState />
      </ViewerLayout>
    );
  }

  if (error) {
    return (
      <ViewerLayout documentId={documentId}>
        <ViewerErrorState error={error} />
      </ViewerLayout>
    );
  }

  if (!document) {
    if (onLoadFailure) {
      onLoadFailure();
    }
    return (
      <ViewerLayout documentId={documentId}>
        <ViewerErrorState error={new Error("Document not found")} />
      </ViewerLayout>
    );
  }

  return (
    <ViewerLayout 
      documentId={documentId} 
      documentTitle={documentTitle || document.title}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={70} minSize={40} className="h-full">
          <DocumentPreview
            documentId={documentId}
            storagePath={storagePath}
            title={documentTitle || document.title}
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
            analysis={document.analysis?.[0]}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ViewerLayout>
  );
};
