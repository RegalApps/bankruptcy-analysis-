
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "./types";

export const useDocumentViewer = (documentId: string) => {
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

  useEffect(() => {
    fetchDocumentDetails();

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

    return () => {
      console.log("Cleaning up real-time subscription for channel:", channelName);
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return {
    document,
    loading,
    fetchDocumentDetails
  };
};
