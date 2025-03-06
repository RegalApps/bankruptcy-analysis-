
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
        
        // Get public URL for file
        const { data, error } = await supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);
        
        if (error) {
          console.error("Error getting public URL:", error);
          setFileExists(false);
          setFileUrl(null);
          setPreviewError(`Error getting public URL: ${error.message}`);
          return;
        }
        
        if (data?.publicUrl) {
          console.log("File found with URL:", data.publicUrl);
          
          // Additional check - try to fetch the file to verify it's accessible
          try {
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setFileExists(true);
              setFileUrl(data.publicUrl);
              
              // Check if it's an Excel file based on extension
              const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                             storagePath.toLowerCase().endsWith('.xls') ||
                             storagePath.toLowerCase().endsWith('.csv');
                             
              setIsExcelFile(isExcel);
              setPreviewError(null);
            } else {
              console.error("File exists but is not accessible:", response.status, response.statusText);
              setFileExists(false);
              setFileUrl(data.publicUrl);  // Still set the URL so we can display it in error messages
              setPreviewError(`File exists but is not accessible (${response.status}: ${response.statusText})`);
            }
          } catch (fetchError: any) {
            console.error("Error fetching file:", fetchError);
            setFileExists(false);
            setFileUrl(data.publicUrl);  // Still set the URL so we can display it in error messages
            setPreviewError(`Error fetching file: ${fetchError.message}`);
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
