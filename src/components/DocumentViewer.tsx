
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentHeader } from "./DocumentViewer/DocumentHeader";
import { DocumentDetails } from "./DocumentViewer/DocumentDetails";
import { RiskAssessment } from "./DocumentViewer/RiskAssessment";
import { DeadlineManager } from "./DocumentViewer/DeadlineManager";
import { DocumentPreview } from "./DocumentViewer/DocumentPreview";
import { Comments } from "./DocumentViewer/Comments";
import { DocumentDetails as IDocumentDetails } from "./DocumentViewer/types";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const [document, setDocument] = useState<IDocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocumentDetails = async () => {
    try {
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select(`
          *,
          analysis:document_analysis(content),
          comments:document_comments(id, content, created_at, user_id)
        `)
        .eq('id', documentId)
        .maybeSingle();

      if (docError) throw docError;
      if (!document) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Document not found"
        });
        return;
      }
      
      let extractedInfo = null;
      console.log("Raw document data:", document);

      if (document?.analysis?.[0]?.content) {
        try {
          if (typeof document.analysis[0].content === 'string') {
            extractedInfo = JSON.parse(document.analysis[0].content).extracted_info;
          } else if (document.analysis[0].content.extracted_info) {
            extractedInfo = document.analysis[0].content.extracted_info;
          }
          console.log("Extracted info:", extractedInfo);
        } catch (e) {
          console.error('Error parsing analysis content:', e);
        }
      }

      setDocument({
        ...document,
        analysis: document?.analysis?.map(a => ({
          ...a,
          content: {
            extracted_info: extractedInfo
          }
        }))
      });
      
      console.log('Processed document details:', document);
    } catch (error: any) {
      console.error('Error fetching document details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchDocumentDetails();

    // Create a dedicated channel for this document
    const channelName = `document_updates_${documentId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analysis',
          filter: `document_id=eq.${documentId}`
        },
        async (payload) => {
          console.log("Analysis update detected:", payload);
          await fetchDocumentDetails();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_comments',
          filter: `document_id=eq.${documentId}`
        },
        async (payload) => {
          console.log("Comment update detected:", payload);
          await fetchDocumentDetails();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);
      });

    console.log("Subscribed to real-time updates for document:", documentId);

    return () => {
      console.log("Cleaning up real-time subscription for channel:", channelName);
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const extractedInfo = document.analysis?.[0]?.content?.extracted_info;
  console.log("Final extracted info being passed to components:", extractedInfo);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <DocumentHeader title={document.title} type={document.type} />
          <div className="space-y-4">
            <DocumentDetails
              documentId={document.id}
              formType={extractedInfo?.type ?? document.type}
              clientName={extractedInfo?.clientName}
              trusteeName={extractedInfo?.trusteeName}
              dateSigned={extractedInfo?.dateSigned}
              formNumber={extractedInfo?.formNumber}
              estateNumber={extractedInfo?.estateNumber}
              district={extractedInfo?.district}
              divisionNumber={extractedInfo?.divisionNumber}
              courtNumber={extractedInfo?.courtNumber}
              meetingOfCreditors={extractedInfo?.meetingOfCreditors}
              chairInfo={extractedInfo?.chairInfo}
              securityInfo={extractedInfo?.securityInfo}
              dateBankruptcy={extractedInfo?.dateBankruptcy}
              officialReceiver={extractedInfo?.officialReceiver}
              summary={extractedInfo?.summary}
            />
            <RiskAssessment risks={extractedInfo?.risks} />
            <DeadlineManager 
              document={document}
              onDeadlineUpdated={fetchDocumentDetails}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-6">
        <DocumentPreview 
          storagePath={document.storage_path} 
          onAnalysisComplete={fetchDocumentDetails}
        />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <Comments
          documentId={document.id}
          comments={document.comments}
          onCommentAdded={fetchDocumentDetails}
        />
      </div>
    </div>
  );
};
