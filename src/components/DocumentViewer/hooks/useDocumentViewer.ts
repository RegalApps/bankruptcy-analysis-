
import { useState, useEffect } from "react";
import { useDocumentDetails } from "./useDocumentDetails";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { DocumentDetails } from "../types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: (data) => {
      setDocument(data);
      setLoading(false);
      setLoadingError(null);
    },
    onError: (error) => {
      console.error("Document loading error:", error);
      setLoading(false);
      setLoadingError(`Failed to load document: ${error.message}`);
      
      if (error.message?.includes("Document not found")) {
        toast.error("Document not found. It may have been deleted or you don't have access.");
      } else {
        uiToast({
          variant: "destructive",
          title: "Document Loading Error",
          description: "There was a problem loading this document. Please try refreshing."
        });
      }
    }
  });

  // Initial document load
  useEffect(() => {
    if (documentId) {
      setLoading(true);
      setLoadingError(null);
      fetchDocumentDetails();
    } else {
      setLoadingError("No document ID provided");
      setLoading(false);
    }
  }, [documentId, fetchDocumentDetails]);

  // Retry mechanism for stalled document loading
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2;
    
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading && retryCount < maxRetries) {
          console.log(`Document still loading after ${(retryCount + 1) * 5} seconds, retrying...`);
          fetchDocumentDetails();
          retryCount++;
        } else if (loading && retryCount >= maxRetries) {
          setLoading(false);
          setLoadingError("Document could not be found. It may have been deleted or you don't have access.");
          toast.error("Document not found", {
            description: "This document may have been deleted or moved."
          });
        }
      }, 5000); // 5 second timeout before retry
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading, fetchDocumentDetails]);

  // Set up real-time subscriptions
  useDocumentRealtime(documentId, fetchDocumentDetails);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingError(null);
    fetchDocumentDetails();
  };

  return {
    document,
    loading,
    loadingError,
    fetchDocumentDetails,
    handleRefresh
  };
};
