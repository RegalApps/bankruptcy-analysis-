
import { useState } from 'react';
import { useDocuments } from './useDocuments';

export function useDocumentsWithSearch() {
  const { documents, isLoading, error, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery
  };
}
