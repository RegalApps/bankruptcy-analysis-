
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
  const timeoutRef = useRef<number | null>(null);

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
    fetchAttempts.current += 1;
    
    // Only show the error toast after multiple attempts
    if (fetchAttempts.current >= 2) {
      setLoading(false);
      setLoadingError(`Failed to load document: ${error.message}`);
      
      // Provide more specific error message based on error type
      let errorMessage = "There was a problem loading this document. Please try refreshing.";
      if (error.message?.includes("not found")) {
        errorMessage = "Document not found. It may have been deleted or moved.";
      } else if (error.message?.includes("permission")) {
        errorMessage = "You don't have permission to view this document.";
      } else if (error.message?.includes("network") || error.message?.includes("connection")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Document Loading Error",
        description: errorMessage
      });
      
      // End timing if we started it
      endTiming(`document-load-${documentId}`);
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
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
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
      
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [documentId, fetchDocumentDetails, document]);

  // Reduced retry intervals to avoid long waits
  useEffect(() => {
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (loading) {
      // Faster retry for first attempt
      const retryTime = fetchAttempts.current === 0 ? 1500 : 3000;
      
      timeoutRef.current = window.setTimeout(() => {
        if (loading && fetchAttempts.current < 2) {
          console.log(`Document still loading after ${(fetchAttempts.current + 1) * (retryTime/1000)} seconds, retrying...`);
          fetchDocumentDetails();
        } else if (loading && fetchAttempts.current >= 2) {
          setLoading(false);
          setLoadingError("Document is taking too long to load. It might still be processing.");
          toast({
            title: "Long Loading Time",
            description: "This document is taking longer than expected to process. You can try refreshing the page.",
          });
        }
      }, retryTime);
      
      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [loading, fetchDocumentDetails, toast, fetchAttempts]);

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
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset the timing
    startTiming(`document-load-${documentId}`);
    fetchDocumentDetails();
  }, [fetchDocumentDetails, documentId]);

  return {
    document,
    loading,
    loadingError,
    fetchDocumentDetails,
    handleRefresh
  };
};
