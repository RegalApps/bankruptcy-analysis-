
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
            const response = await fetch(data.publicUrl, { 
              method: 'HEAD',
              mode: 'no-cors' // Add no-cors mode to avoid CORS issues
            });
            
            console.log("File accessibility check response:", response.status);
            
            // Consider the file exists even with CORS restrictions
            setFileExists(true);
            
            // Check if it's an Excel file based on extension
            const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                           storagePath.toLowerCase().endsWith('.xls') ||
                           storagePath.toLowerCase().endsWith('.csv');
                           
            setIsExcelFile(isExcel);
            setPreviewError(null);
          } catch (fetchError: any) {
            console.error("Error fetching file:", fetchError);
            // Even if fetch fails, we'll consider the file exists
            // This allows the iframe to try loading it anyway
            setFileExists(true);
            setPreviewError(null);
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
