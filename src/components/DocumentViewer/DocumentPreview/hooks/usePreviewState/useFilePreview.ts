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

  // Check if file exists and get its URL
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
      
      console.log("Checking file at path:", storagePath);
      
      // Get public URL for file
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);
      
      if (data?.publicUrl) {
        console.log("File found with URL:", data.publicUrl);
        
        // Set the URL regardless of fetch success
        setFileUrl(data.publicUrl);
        
        try {
          // Use a combination of fetch API and timeout to check accessibility
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(data.publicUrl, { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: controller.signal
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
            
            // Show toast to inform user
            toast.warning("Network connectivity issues detected. Document preview might be limited.");
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
      setFileExists(false);
      setFileUrl(null);
      setPreviewError(error.message || "Failed to check file existence");
    }
  }, [storagePath, setFileExists, setFileUrl, setIsExcelFile, setPreviewError]);

  // Initial file check
  useEffect(() => {
    checkFile();
  }, [checkFile]);

  return {
    checkFile,
    lastAttempt,
    attemptCount
  };
};
