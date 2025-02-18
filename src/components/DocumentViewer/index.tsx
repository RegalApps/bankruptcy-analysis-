
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "./types";
import { AnalysisPanel } from "./AnalysisPanel";
import { DocumentPreview } from "./DocumentPreview";
import { CollaborationPanel } from "./CollaborationPanel";

interface DocumentViewerProps {
  documentId: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <AnalysisPanel 
          document={document} 
          onDeadlineUpdated={fetchDocumentDetails}
        />
      </div>

      <div className="lg:col-span-6">
        <DocumentPreview document={document} />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <CollaborationPanel 
          document={document}
          onCommentAdded={fetchDocumentDetails}
        />
      </div>
    </div>
  );
};
