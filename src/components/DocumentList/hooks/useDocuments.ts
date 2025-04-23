import { useState, useEffect, useCallback } from "react";
import { Document } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getDocuments } from "@/utils/documentOperations";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const analytics = useAnalytics();

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      analytics.trackEvent('documents_fetch_started');
      
      // Get documents from local storage
      const data = await getDocuments();
      
      // Transform data to match Document interface
      const transformedData: Document[] = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled Document',
        created_at: item.created_at,
        updated_at: item.created_at, // Use created_at as updated_at
        is_folder: false,
        folder_type: null,
        parent_folder_id: null,
        storage_path: null,
        metadata: {
          formType: item.analysis?.formType || null,
          riskLevel: item.analysis?.riskLevel || null,
          status: item.status
        },
        type: item.type,
        size: item.size || 0,
      }));
      
      setDocuments(transformedData);
      analytics.trackEvent('documents_fetch_success', { count: transformedData.length });
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      analytics.trackEvent('documents_fetch_error', { error: err instanceof Error ? err.message : 'Unknown error' });
      
      toast({
        variant: "destructive",
        title: "Failed to load documents",
        description: err instanceof Error ? err.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, analytics]);

  const refetch = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, isLoading, error, refetch };
}
