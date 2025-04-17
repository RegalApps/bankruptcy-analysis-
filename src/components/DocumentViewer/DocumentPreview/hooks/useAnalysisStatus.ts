
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { DocumentRecord } from '@/utils/documents/types/documentTypes';

interface UseAnalysisStatusProps {
  documentId: string;
  onAnalysisComplete?: () => void;
}

export const useAnalysisStatus = ({ documentId, onAnalysisComplete }: UseAnalysisStatusProps) => {
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [document, setDocument] = useState<DocumentRecord | null>(null);

  // Fetch initial document status
  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();
        
        if (error) throw error;
        
        setDocument(data);
        const status = data?.ai_processing_status;
        setIsProcessing(status === 'pending' || status === 'processing');
        setIsAnalyzed(status === 'completed' || status === 'complete');
        
        if (status === 'completed' || status === 'complete') {
          onAnalysisComplete?.();
        }
      } catch (error) {
        console.error('Error fetching document status:', error);
      }
    };

    if (documentId) {
      fetchDocumentStatus();
    }
  }, [documentId, onAnalysisComplete]);

  // Set up real-time subscription for document status updates
  useEffect(() => {
    if (!documentId) return;

    const channel = supabase
      .channel(`document_status_${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`
        },
        (payload) => {
          console.log('Document status update:', payload);
          const updatedDoc = payload.new as DocumentRecord;
          setDocument(updatedDoc);
          
          const status = updatedDoc.ai_processing_status;
          setIsProcessing(status === 'pending' || status === 'processing');
          
          if (status === 'completed' || status === 'complete') {
            setIsAnalyzed(true);
            onAnalysisComplete?.();
            toast.success("Document analysis complete");
          } else if (status === 'error') {
            toast.error("Error analyzing document");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, onAnalysisComplete]);

  return {
    isAnalyzed,
    isProcessing,
    document
  };
};
