
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Document } from '../types';
import { toast } from 'sonner';

export const useDocuments = () => {
  const [state, setState] = useState({
    documents: [] as Document[],
    isLoading: true,
    searchQuery: ''
  });

  const fetchDocuments = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        documents: data || [],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchDocuments();

    // Set up real-time subscription
    const channel = supabase
      .channel('document_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDocuments]);

  return {
    documents: state.documents,
    isLoading: state.isLoading,
    searchQuery: state.searchQuery,
    setSearchQuery,
    refetch: fetchDocuments // Expose fetchDocuments as refetch
  };
};
