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
  const maxAttempts = 2; // Limit the number of retries to prevent infinite loops

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error("Authentication error:", error);
        setLoadingError("Authentication required: Please log in to view documents");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to view documents"
        });
      }
    };
    
    checkAuth();
  }, [toast]);

  const handleDocumentSuccess = useCallback((data: DocumentDetails) => {
    console.log("Document loaded successfully:", data.id);
    setDocument(data);
    setLoading(false);
    setLoadingError(null);
    setIsNetworkError(false);
    fetchAttempts.current = 0;
    
    // End timing if we started it
    endTiming(`document-load-${documentId}`);
  }, [documentId]);

  const handleDocumentError = useCallback((error: any) => {
    console.error("Error loading document:", error, "DocumentID:", documentId);
    fetchAttempts.current += 1;
    
    // Check if this is the Form 47 special case
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
    
    // Check if this is a network error
    const isNetwork = error.message?.includes('Failed to fetch') ||
                     error.message?.includes('NetworkError') ||
                     error.message?.includes('network') ||
                     error.message?.includes('connect') ||
                     error.message?.includes('CORS');
    
    setIsNetworkError(isNetwork);
    
    // Check if this is an authentication error
    const isAuthError = error.message?.includes('JWT') || 
                       error.message?.includes('auth') || 
                       error.message?.includes('token') || 
                       error.message?.includes('permission') ||
                       error.message?.includes('authorization') ||
                       error.status === 401 || 
                       error.status === 403;
    
    if (isAuthError) {
      setLoadingError("Authentication error: Please log in and try again");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Your session may have expired. Please log in again."
      });
      
      // Try to refresh session
      supabase.auth.refreshSession();
      
      // End timing if we started it
      endTiming(`document-load-${documentId}`);
      return;
    }
    
    // Only show the error toast after retries or when max attempts reached
    if (fetchAttempts.current >= maxAttempts) {
      setLoading(false);
      
      // Provide more specific error message based on error type
      let errorMessage = "There was a problem loading this document. Please try refreshing.";
      if (error.message?.includes("not found")) {
        errorMessage = "Document not found. It may have been deleted or moved.";
        setLoadingError(errorMessage);
      } else if (error.message?.includes("permission")) {
        errorMessage = "You don't have permission to view this document.";
        setLoadingError(errorMessage);
      } else if (isNetwork) {
        errorMessage = "Network error. Please check your connection and try again.";
        setLoadingError("Network connection error. Unable to reach the server.");
      } else {
        setLoadingError(`Failed to load document: ${error.message}`);
      }
      
      toast({
        variant: "destructive",
        title: "Document Loading Error",
        description: errorMessage
      });
      
      // End timing if we started it
      endTiming(`document-load-${documentId}`);
    }
  }, [documentId, toast, handleDocumentSuccess]);

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: handleDocumentSuccess,
    onError: handleDocumentError
  });

  useEffect(() => {
    // Skip fetching if document ID is null or undefined
    if (!documentId) return;
    
    // Cancel any running timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Special case for Form 47
    if (documentId === "form47" && cachedDocumentId.current === documentId) {
      // We already tried to load Form 47, no need to keep trying
      return;
    }
    
    // Avoid repeated fetches for the same document ID
    if (cachedDocumentId.current === documentId && document) {
      console.log("Using cached document details for ID:", documentId);
      return;
    }
    
    console.log("Fetching document details for ID:", documentId);
    setLoading(true);
    setLoadingError(null);
    setIsNetworkError(false);
    fetchAttempts.current = 0;
    cachedDocumentId.current = documentId;
    
    // Start timing for performance tracking
    startTiming(`document-load-${documentId}`);
    fetchDocumentDetails();
    
    // Cleanup function
    return () => {
      // Cancel any in-progress timing if component unmounts
      endTiming(`document-load-${documentId}`);
      
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [documentId, fetchDocumentDetails, document]);

  useEffect(() => {
    // Special case for form47 - we don't want to keep retrying
    if (documentId === "form47") {
      return;
    }
    
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (loading && fetchAttempts.current < maxAttempts) {
      // Faster retry for first attempt, slower for network errors
      const retryTime = isNetworkError ? 3000 : (fetchAttempts.current === 0 ? 1500 : 3000);
      
      timeoutRef.current = window.setTimeout(() => {
        if (loading && fetchAttempts.current < maxAttempts) {
          console.log(`Document still loading after ${(fetchAttempts.current + 1) * (retryTime/1000)} seconds, retrying...`);
          fetchDocumentDetails();
        } else if (loading && fetchAttempts.current >= maxAttempts) {
          setLoading(false);
          
          const errorMsg = isNetworkError 
            ? "Network connection issues detected. Please check your internet connection and try again." 
            : "Document is taking too long to load. It might still be processing or doesn't exist.";
          
          setLoadingError(errorMsg);
          
          toast({
            title: isNetworkError ? "Network Error" : "Document Not Found",
            description: errorMsg,
          });
          
          // End timing
          endTiming(`document-load-${documentId}`);
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
  }, [loading, fetchDocumentDetails, toast, documentId, isNetworkError]);

  useDocumentRealtime(documentId !== "form47" ? documentId : null, document ? fetchDocumentDetails : null);

  const handleRefresh = useCallback(async () => {
    sonnerToast.info("Refreshing document...");
    
    // Check authentication first
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      sonnerToast.error("Authentication required to refresh");
      setLoadingError("Authentication required: Please log in to view documents");
      return;
    }
    
    setLoading(true);
    setLoadingError(null);
    setIsNetworkError(false);
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
    isNetworkError,
    fetchDocumentDetails,
    handleRefresh
  };
};
