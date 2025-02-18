
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
          comments:document_comments(
            id, 
            content, 
            created_at, 
            user_id,
            user_email,
            user_name
          )
        `)
        .eq('id', documentId)
        .single();

      if (docError) throw docError;
      setDocument(document);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetails();
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

  const extractedInfo = document.analysis?.[0]?.extracted_info;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <DocumentHeader title={document.title} type={document.type} />
          <div className="space-y-4">
            <DocumentDetails
              clientName={extractedInfo?.clientName}
              trusteeName={extractedInfo?.trusteeName}
              dateSigned={extractedInfo?.dateSigned}
              formNumber={extractedInfo?.formNumber}
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
        <DocumentPreview storagePath={document.storage_path} />
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
