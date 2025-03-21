
import { useState, useEffect, useCallback } from "react";
import { useDocumentDetails } from "./useDocumentDetails";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { DocumentDetails } from "../types";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDocumentSuccess = useCallback((data: DocumentDetails) => {
    console.log("Document loaded successfully:", data.id);
    setDocument(data);
    setLoading(false);
    setLoadingError(null);
  }, []);

  const handleDocumentError = useCallback((error: any) => {
    console.error("Error loading document:", error, "DocumentID:", documentId);
    setLoading(false);
    setLoadingError(`Failed to load document: ${error.message}`);
    toast({
      variant: "destructive",
      title: "Document Loading Error",
      description: "There was a problem loading this document. Please try refreshing."
    });
  }, [documentId, toast]);

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: handleDocumentSuccess,
    onError: handleDocumentError
  });

  // Call fetchDocumentDetails initially
  useEffect(() => {
    console.log("Fetching document details for ID:", documentId);
    setLoading(true);
    setLoadingError(null);
    fetchDocumentDetails();
  }, [documentId, fetchDocumentDetails]);

  // Retry mechanism for stalled document loading
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading && retryCount < maxRetries) {
          console.log(`Document still loading after ${(retryCount + 1) * 5} seconds, retrying...`);
          fetchDocumentDetails();
          retryCount++;
        } else if (loading && retryCount >= maxRetries) {
          setLoading(false);
          setLoadingError("Document is taking too long to load. It might still be processing.");
          toast({
            title: "Long Loading Time",
            description: "This document is taking longer than expected to process. You can try refreshing the page.",
          });
        }
      }, 5000); // 5 second timeout before retry
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading, fetchDocumentDetails, toast]);

  // Set up real-time subscriptions
  useDocumentRealtime(documentId, fetchDocumentDetails);

  const handleRefresh = useCallback(() => {
    sonnerToast.info("Refreshing document...");
    setLoading(true);
    setLoadingError(null);
    fetchDocumentDetails();
  }, [fetchDocumentDetails]);

  return {
    document,
    loading,
    loadingError,
    fetchDocumentDetails,
    handleRefresh
  };
};
