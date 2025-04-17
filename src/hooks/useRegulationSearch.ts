
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RegulationResult {
  title: string;
  text: string;
  url: string;
  score: number;
}

export const useRegulationSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RegulationResult[]>([]);

  const searchRegulations = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('search-regulations', {
        body: { query }
      });

      if (error) throw error;

      setResults(data.results);
    } catch (err: any) {
      console.error('Error searching regulations:', err);
      setError(err.message || 'Failed to search regulations');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchRegulations,
    results,
    isLoading,
    error
  };
};
