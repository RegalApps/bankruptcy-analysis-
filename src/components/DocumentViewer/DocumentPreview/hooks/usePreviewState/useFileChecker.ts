import { useCallback } from "react";
import { UseFileCheckerReturn } from "../../types";

// Sample document paths for local development
const LOCAL_DOCUMENT_PATHS = {
  'sample-documents/form-47-consumer-proposal.pdf': '/sample-documents/form-47-consumer-proposal.pdf',
  'sample-documents/form-31-proof-of-claim.pdf': '/sample-documents/form-31-proof-of-claim.pdf',
  'sample-documents/bankruptcy-form-1.pdf': '/sample-documents/bankruptcy-form-1.pdf',
  'sample-documents/bankruptcy-form-2.pdf': '/sample-documents/bankruptcy-form-2.pdf',
};

/**
 * Hook for checking file existence and accessibility in local storage
 */
export const useFileChecker = (
  setFileExists: (exists: boolean) => void,
  setFileUrl: (url: string | null) => void,
  setIsExcelFile: (isExcel: boolean) => void,
  setPreviewError: (error: string | null) => void,
  setNetworkStatus: (status: 'online' | 'offline') => void
): UseFileCheckerReturn => {
  
  /**
   * Handle errors that occur during file checking
   */
  const handleFileCheckError = useCallback((error: any, publicUrl?: string | null) => {
    console.error("Error checking file existence:", error);
    
    // More specific error handling
    if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
      setPreviewError(`Network error: ${navigator.onLine ? "Server connection issue" : "You appear to be offline"}`);
      setNetworkStatus('offline');
      
      // In case of network error but URL is already set, we'll still try to display
      if (publicUrl) {
        setFileExists(true);
        setFileUrl(publicUrl);
      } else {
        setFileExists(false);
        setFileUrl(null);
      }
    } else {
      setFileExists(false);
      setFileUrl(null);
      setPreviewError(`Error: ${error.message || "Failed to check file existence"}`);
    }
  }, [setFileExists, setFileUrl, setPreviewError, setNetworkStatus]);
  
  /**
   * Check if file exists locally and get its URL
   */
  const checkFile = useCallback(async (storagePath: string) => {
    if (!storagePath) {
      setFileExists(false);
      setFileUrl(null);
      setPreviewError("No storage path provided");
      return;
    }

    try {
      console.log("Checking file at path:", storagePath);
      
      // For local-only mode, map storage paths to local file URLs
      let localUrl: string;
      
      // Check if this is one of our predefined sample documents
      if (storagePath in LOCAL_DOCUMENT_PATHS) {
        localUrl = LOCAL_DOCUMENT_PATHS[storagePath as keyof typeof LOCAL_DOCUMENT_PATHS];
      } else {
        // For other documents, construct a local URL
        // Remove any bucket prefixes if present
        const cleanPath = storagePath.replace(/^(documents|public)\//, '');
        localUrl = `/sample-documents/${cleanPath}`;
      }
      
      console.log("Using local URL:", localUrl);
      
      // Set the URL
      setFileUrl(localUrl);
      setFileExists(true);
      
      // Check file type
      const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                     storagePath.toLowerCase().endsWith('.xls') ||
                     storagePath.toLowerCase().endsWith('.csv');
                     
      setIsExcelFile(isExcel);
      setPreviewError(null);
      setNetworkStatus('online');
    } catch (error: any) {
      handleFileCheckError(error);
    }
  }, [
    setFileExists, 
    setFileUrl, 
    setIsExcelFile, 
    setPreviewError, 
    setNetworkStatus, 
    handleFileCheckError
  ]);

  return {
    checkFile,
    handleFileCheckError
  };
};
