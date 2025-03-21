import { useState, useEffect, useCallback, useRef } from "react";
import { useDocumentDetails } from "./useDocumentDetails";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { DocumentDetails } from "../types";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { startTiming, endTiming } from "@/utils/performanceMonitor";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast } = useToast();
  const fetchAttempts = useRef(0);
  const cachedDocumentId = useRef<string | null>(null);

  const handleDocumentSuccess = useCallback((data: DocumentDetails) => {
    console.log("Document loaded successfully:", data.id);
    setDocument(data);
    setLoading(false);
    setLoadingError(null);
    fetchAttempts.current = 0;
    
    // End timing if we started it
    endTiming(`document-load-${documentId}`);
  }, [documentId]);

  const handleDocumentError = useCallback((error: any) => {
    console.error("Error loading document:", error, "DocumentID:", documentId);
    
    // Only show the error toast once after multiple attempts
    if (fetchAttempts.current >= 2) {
      setLoading(false);
      setLoadingError(`Failed to load document: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Document Loading Error",
        description: "There was a problem loading this document. Please try refreshing."
      });
      
      // End timing if we started it
      endTiming(`document-load-${documentId}`);
    } else {
      // For the first few attempts, keep the loading state true
      // and don't show an error message to the user
      fetchAttempts.current += 1;
    }
  }, [documentId, toast]);

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: handleDocumentSuccess,
    onError: handleDocumentError
  });

  // Call fetchDocumentDetails initially - but only if the document ID changes
  useEffect(() => {
    // Skip fetching if document ID is null or undefined
    if (!documentId) return;
    
    // Avoid repeated fetches for the same document ID
    if (cachedDocumentId.current === documentId && document) {
      console.log("Using cached document details for ID:", documentId);
      return;
    }
    
    console.log("Fetching document details for ID:", documentId);
    setLoading(true);
    setLoadingError(null);
    fetchAttempts.current = 0;
    cachedDocumentId.current = documentId;
    
    // Start timing for performance tracking
    startTiming(`document-load-${documentId}`);
    fetchDocumentDetails();
    
    // Cleanup function
    return () => {
      // Cancel any in-progress timing if component unmounts
      endTiming(`document-load-${documentId}`, false);
    };
  }, [documentId, fetchDocumentDetails]);

  // Reduced retry intervals to avoid long waits
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2;
    
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading && retryCount < maxRetries) {
          console.log(`Document still loading after ${(retryCount + 1) * 2} seconds, retrying...`);
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
      }, 2000); // Reduced from 5000 to 2000ms (2 second timeout before retry)
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading, fetchDocumentDetails, toast]);

  // Set up real-time subscriptions - but only if we have a valid document
  useEffect(() => {
    if (document) {
      return useDocumentRealtime(documentId, fetchDocumentDetails);
    }
  }, [documentId, fetchDocumentDetails, document]);

  const handleRefresh = useCallback(() => {
    sonnerToast.info("Refreshing document...");
    setLoading(true);
    setLoadingError(null);
    fetchAttempts.current = 0;
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
