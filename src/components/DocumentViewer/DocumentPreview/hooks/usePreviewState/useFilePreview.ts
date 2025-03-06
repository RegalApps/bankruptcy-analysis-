
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  // Check if file exists and get its URL
  useEffect(() => {
    if (!storagePath) {
      setFileExists(false);
      setFileUrl(null);
      setPreviewError("No storage path provided");
      return;
    }

    const checkFile = async () => {
      try {
        console.log("Checking file at path:", storagePath);
        
        // Get public URL for file - this doesn't return an error property
        const { data } = await supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);
        
        if (data?.publicUrl) {
          console.log("File found with URL:", data.publicUrl);
          
          // Always set the URL even if the fetch check fails
          setFileUrl(data.publicUrl);
          
          // Try to verify the file is accessible with a HEAD request
          try {
            // First try a standard HEAD request
            const response = await fetch(data.publicUrl, { 
              method: 'HEAD',
              cache: 'no-cache' // Avoid caching issues
            });
            
            console.log("File accessibility check response:", response.status);
            
            if (response.ok) {
              setFileExists(true);
              
              // Check if it's an Excel file based on extension
              const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                             storagePath.toLowerCase().endsWith('.xls') ||
                             storagePath.toLowerCase().endsWith('.csv');
                             
              setIsExcelFile(isExcel);
              setPreviewError(null);
            } else {
              // If standard request fails, try with no-cors mode
              console.log("Standard fetch failed, trying with no-cors mode");
              await fetch(data.publicUrl, { 
                method: 'HEAD',
                mode: 'no-cors' // Fall back to no-cors mode
              });
              
              // If we get here without exception, assume file exists
              setFileExists(true);
              
              // Check Excel file
              const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                             storagePath.toLowerCase().endsWith('.xls') ||
                             storagePath.toLowerCase().endsWith('.csv');
                             
              setIsExcelFile(isExcel);
              setPreviewError(null);
            }
          } catch (fetchError: any) {
            console.error("Error fetching file:", fetchError);
            // Even with fetch error, we'll still consider the file exists
            // so the iframe can try to load it
            setFileExists(true);
            setPreviewError("File accessibility check failed. Trying to load anyway.");
            
            // Check Excel file
            const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                          storagePath.toLowerCase().endsWith('.xls') ||
                          storagePath.toLowerCase().endsWith('.csv');
                          
            setIsExcelFile(isExcel);
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
    };
    
    checkFile();
  }, [storagePath, setFileExists, setFileUrl, setIsExcelFile, setPreviewError]);
};
