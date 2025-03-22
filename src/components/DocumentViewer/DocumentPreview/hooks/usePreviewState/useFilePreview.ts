
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseFilePreviewProps {
  storagePath: string;
  setFileExists: (exists: boolean) => void;
  setFileUrl: (url: string | null) => void;
  setIsExcelFile: (isExcel: boolean) => void;
  setPreviewError: (error: string | null) => void;
}

export const useFilePreview = ({
  storagePath,
  setFileExists,
  setFileUrl,
  setIsExcelFile,
  setPreviewError
}: UseFilePreviewProps) => {
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline');
  const [hasFileLoadStarted, setHasFileLoadStarted] = useState(false);
  
  // Enhanced network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      // Only show toast if we were previously offline and now coming back online
      if (networkStatus === 'offline') {
        toast.success("Connection restored. Retrying document load...");
        // Auto-retry when connection is restored
        setTimeout(() => checkFile(), 1000);
      }
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      toast.error("You're offline. Document loading paused.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networkStatus]);

  // Check if file exists and get its URL with improved error handling
  const checkFile = useCallback(async () => {
    if (!storagePath) {
      setFileExists(false);
      setFileUrl(null);
      setPreviewError("No storage path provided");
      return;
    }

    try {
      // Record attempt
      setLastAttempt(new Date());
      setAttemptCount(count => count + 1);
      setHasFileLoadStarted(true);
      
      console.log("Checking file at path:", storagePath);
      
      // Get public URL for file with specific options to prevent caching
      const { data, error } = await supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);
      
      if (error) throw error;
      
      if (data?.publicUrl) {
        console.log("File found with URL:", data.publicUrl);
        
        // Set the URL regardless of fetch success
        setFileUrl(data.publicUrl);
        
        try {
          // Generate a unique URL to avoid browser caching issues
          const cacheBreakingUrl = `${data.publicUrl}?cache=${Date.now()}`;
          
          // Use a combination of fetch API and timeout to check accessibility
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(cacheBreakingUrl, { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: controller.signal,
            // Add credentials to ensure cookies are sent with the request
            credentials: 'same-origin'
          });
          
          clearTimeout(timeoutId);
          
          console.log("File accessibility check response:", response.status);
          
          if (response.ok) {
            setFileExists(true);
            
            // Check file type
            const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                           storagePath.toLowerCase().endsWith('.xls') ||
                           storagePath.toLowerCase().endsWith('.csv');
                           
            setIsExcelFile(isExcel);
            setPreviewError(null);
            setNetworkStatus('online'); // Explicitly set online status on success
          } else {
            // Status code error
            setFileExists(false);
            setPreviewError(`File accessibility error: HTTP ${response.status}`);
            
            // Try no-cors mode as fallback
            try {
              await fetch(data.publicUrl, { 
                method: 'HEAD',
                mode: 'no-cors' 
              });
              
              // If we get here, assume file might exist
              console.log("No-cors fetch didn't throw, assuming file exists");
              setFileExists(true);
              
              // Check file type
              const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                            storagePath.toLowerCase().endsWith('.xls') ||
                            storagePath.toLowerCase().endsWith('.csv');
                            
              setIsExcelFile(isExcel);
              setPreviewError(null);
            } catch (corsError) {
              console.error("No-cors fetch also failed:", corsError);
            }
          }
        } catch (fetchError: any) {
          console.error("Error fetching file:", fetchError);
          
          if (fetchError.name === 'AbortError') {
            setPreviewError("Request timed out. The server might be busy or the file too large.");
            // Still try to show the file
            setFileExists(true);
          } else if (fetchError.message?.includes('network') || 
                    fetchError.message?.includes('fetch')) {
            // Network error, but we'll still try to show the file
            setFileExists(true);
            setPreviewError("Network issue detected. Preview might be limited.");
            
            // Check if it's an Excel file anyway
            const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                          storagePath.toLowerCase().endsWith('.xls') ||
                          storagePath.toLowerCase().endsWith('.csv');
            setIsExcelFile(isExcel);
            
            // Update network status
            setNetworkStatus('offline');
          } else {
            // Other errors
            setFileExists(false);
            setPreviewError(`Error accessing file: ${fetchError.message || "Unknown error"}`);
          }
        }
      } else {
        console.error("No public URL returned for file:", storagePath);
        setFileExists(false);
        setFileUrl(null);
        setPreviewError("File not found in storage or not accessible");
      }
    } catch (error: any) {
      console.error("Error checking file existence:", error);
      
      // More specific error handling
      if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
        setPreviewError(`Network error: ${navigator.onLine ? "Server connection issue" : "You appear to be offline"}`);
        setNetworkStatus('offline');
        
        // In case of network error but URL is already set, we'll still try to display
        try {
          const result = await supabase.storage
            .from('documents')
            .getPublicUrl(storagePath);
          
          if (result.data?.publicUrl) {
            setFileExists(true);
            setFileUrl(result.data.publicUrl);
          } else {
            setFileExists(false);
            setFileUrl(null);
          }
        } catch (innerError) {
          console.error("Failed to get URL in offline fallback:", innerError);
          setFileExists(false);
          setFileUrl(null);
        }
      } else {
        setFileExists(false);
        setFileUrl(null);
        setPreviewError(`Database error: ${error.message || "Failed to check file existence"}`);
      }
    }
  }, [storagePath, setFileExists, setFileUrl, setIsExcelFile, setPreviewError]);

  // Initial file check
  useEffect(() => {
    checkFile();
  }, [checkFile]);

  // Periodically check file accessibility when loading hasn't started yet or has failed
  useEffect(() => {
    // Only apply this check to PDF documents to avoid unnecessary retries for Excel files
    const isPdf = storagePath.toLowerCase().endsWith('.pdf');
    
    if (isPdf && (hasFileLoadStarted && attemptCount < 3)) {
      const checkInterval = setTimeout(() => {
        console.log("Doing periodic file accessibility check");
        checkFile();
      }, 5000);
      
      return () => clearTimeout(checkInterval);
    }
  }, [hasFileLoadStarted, attemptCount, checkFile, storagePath]);

  // Enhanced auto-retry with progressive backoff
  useEffect(() => {
    // Only retry if we're online and have had a previous attempt
    if (networkStatus === 'online' && attemptCount > 0 && attemptCount < 4) {
      // Calculate backoff time: 2s, 4s, 8s for progressive retries
      const retryDelay = Math.min(2000 * Math.pow(2, attemptCount - 1), 8000);
      
      console.log(`Network is online, scheduling retry #${attemptCount} in ${retryDelay/1000}s`);
      
      const timeoutId = setTimeout(() => {
        console.log("Auto-retrying file check");
        checkFile();
      }, retryDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [networkStatus, attemptCount, checkFile]);

  // Handle special retry after longer delay when all previous attempts failed
  useEffect(() => {
    if (attemptCount === 4) {
      console.log("All regular retries failed, scheduling one final attempt after longer delay");
      const finalRetryTimeout = setTimeout(() => {
        checkFile();
      }, 15000); // Wait 15 seconds
      
      return () => clearTimeout(finalRetryTimeout);
    }
  }, [attemptCount, checkFile]);

  return {
    checkFile,
    lastAttempt,
    attemptCount,
    networkStatus,
    hasFileLoadStarted
  };
};
