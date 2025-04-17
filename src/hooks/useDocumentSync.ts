
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useDocumentSync = (onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document change detected:', payload);
          
          // Show toast notification based on the event
          if (payload.eventType === 'INSERT') {
            toast.success('New document added');
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Document updated');
          } else if (payload.eventType === 'DELETE') {
            toast.info('Document removed');
          }
          
          // Trigger the update callback
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};
