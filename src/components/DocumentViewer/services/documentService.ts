
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "../types";
import { useToast } from "@/hooks/use-toast";

/**
 * Fetches document details from Supabase
 */
export const fetchDocument = async (documentId: string) => {
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
  return document;
};

/**
 * Sets up a real-time subscription for document updates
 */
export const subscribeToDocumentUpdates = (
  documentId: string, 
  onUpdate: () => void
) => {
  console.log("Setting up real-time subscription for document:", documentId);
  
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
        await onUpdate();
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
        await onUpdate();
      }
    )
    .subscribe((status) => {
      console.log(`Subscription status for ${channelName}:`, status);
    });

  // Return cleanup function
  return () => {
    console.log("Cleaning up real-time subscription for channel:", channelName);
    supabase.removeChannel(channel);
  };
};

/**
 * Triggers document analysis based on document content and title
 */
export const triggerAnalysisForDocument = async (documentId: string, formNumber?: string, formType?: string) => {
  try {
    console.log(`Triggering analysis for document ID: ${documentId}, Form: ${formNumber}, Type: ${formType}`);
    
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId,
        formNumber,
        formType,
        forceReanalysis: true, // Force fresh analysis regardless of existing data
        includeRegulatory: true,
        includeClientExtraction: true,
        extractionMode: 'comprehensive'
      }
    });

    if (error) {
      console.error('Error triggering document analysis:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to trigger document analysis:', error);
    throw error;
  }
};
