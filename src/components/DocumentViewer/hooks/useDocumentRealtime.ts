
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Sets up real-time subscriptions for document updates
 */
export const useDocumentRealtime = (
  documentId: string,
  onUpdate: () => void
) => {
  useEffect(() => {
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

    return () => {
      console.log("Cleaning up real-time subscription for channel:", channelName);
      supabase.removeChannel(channel);
    };
  }, [documentId, onUpdate]);
};
