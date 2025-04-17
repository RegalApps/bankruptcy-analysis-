
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DocumentRecord } from '../types';

export const useAnalysisStatus = (documentId: string) => {
  const [status, setStatus] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Initial fetch
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('ai_processing_status')
        .eq('id', documentId)
        .single();
        
      if (error) {
        console.error('Error fetching analysis status:', error);
        return;
      }
      
      setStatus(data.ai_processing_status);
      setIsComplete(data.ai_processing_status === 'completed');
    };

    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`
        },
        (payload: any) => {
          const newStatus = payload.new.ai_processing_status;
          setStatus(newStatus);
          setIsComplete(newStatus === 'completed');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return { status, isComplete };
};
