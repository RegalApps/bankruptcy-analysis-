import { useState, useEffect, useCallback, useRef } from "react";
import { useDocumentDetails } from "./useDocumentDetails";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { DocumentDetails, Risk } from "../types";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { startTiming, endTiming } from "@/utils/performanceMonitor";
import { supabase } from "@/lib/supabase";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { toast } = useToast();
  const fetchAttempts = useRef(0);
  const cachedDocumentId = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const maxAttempts = 2;

  // Handle successful document load
  const handleDocumentSuccess = useCallback((data: DocumentDetails) => {
    setDocument(data);
    setLoading(false);
    setLoadingError(null);
    setIsNetworkError(false);
    fetchAttempts.current = 0;
    endTiming(`document-load-${documentId}`);
  }, [documentId]);

  // Handle document loading errors
  const handleDocumentError = useCallback((error: any) => {
    console.error("Error loading document:", error, "DocumentID:", documentId);
    fetchAttempts.current += 1;
    
    // Special handling for Form 47
    if (documentId === "form47") {
      // Create a synthetic document for Form 47
      const form47Document: DocumentDetails = {
        id: "form47",
        title: "Form 47 - Consumer Proposal",
        type: "form",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        storage_path: "sample-documents/form-47-consumer-proposal.pdf",
        analysis: [
          {
            id: "form47-analysis-1",
            content: {
              extracted_info: {
                formNumber: "47",
                formType: "consumer-proposal",
                summary: "This is a form used for consumer proposals under the Bankruptcy and Insolvency Act."
              },
              risks: [
                {
                  type: "Missing Information",
                  description: "Please ensure all required fields are completed.",
                  severity: "medium"
                } as Risk
              ]
            }
          }
        ],
        comments: []
      };
      
      handleDocumentSuccess(form47Document);
      return;
    }
    
    // Handle various error types
    const isNetwork = error.message?.includes('Failed to fetch') ||
                     error.message?.includes('NetworkError') ||
                     error.message?.includes('network');
    
    setIsNetworkError(isNetwork);
    
    if (fetchAttempts.current >= maxAttempts) {
      setLoading(false);
      setLoadingError(error.message);
      toast({
        variant: "destructive",
        title: "Document Loading Error",
        description: error.message
      });
      endTiming(`document-load-${documentId}`);
    }
  }, [documentId, toast]);

  // Initialize document details hook
  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: handleDocumentSuccess,
    onError: handleDocumentError
  });

  useEffect(() => {
    if (!documentId) return;
    
    // Cancel any running timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Skip for cached documents
    if (cachedDocumentId.current === documentId && document) {
      console.log("Using cached document details for ID:", documentId);
      return;
    }
    
    // Start new document fetch
    console.log("Fetching document details for ID:", documentId);
    setLoading(true);
    setLoadingError(null);
    setIsNetworkError(false);
    fetchAttempts.current = 0;
    cachedDocumentId.current = documentId;
    
    startTiming(`document-load-${documentId}`);
    fetchDocumentDetails();
    
    // Cleanup function
    return () => {
      endTiming(`document-load-${documentId}`);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [documentId, fetchDocumentDetails, document]);

  // Setup real-time updates
  useDocumentRealtime(documentId !== "form47" ? documentId : null, document ? fetchDocumentDetails : null);

  const handleRefresh = useCallback(async () => {
    sonnerToast.info("Refreshing document...");
    setLoading(true);
    setLoadingError(null);
    setIsNetworkError(false);
    fetchAttempts.current = 0;
    startTiming(`document-load-${documentId}`);
    fetchDocumentDetails();
  }, [documentId, fetchDocumentDetails]);

  return {
    document,
    loading,
    loadingError,
    isNetworkError,
    fetchDocumentDetails,
    handleRefresh
  };
};
