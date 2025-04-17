
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
      console.log('Invoking search-regulations function with query:', query);
      
      const { data, error } = await supabase.functions.invoke('search-regulations', {
        body: { query }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Received regulation search results:', data);
      setResults(data.results);
    } catch (err: any) {
      console.error('Error searching regulations:', err);
      setError(err.message || 'Failed to search regulations');
      setResults([]);
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
