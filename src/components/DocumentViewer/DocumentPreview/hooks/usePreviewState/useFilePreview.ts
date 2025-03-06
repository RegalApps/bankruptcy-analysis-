
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
      return;
    }

    const checkFile = async () => {
      try {
        // Check if file exists in storage
        const { data, error } = await supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);
        
        if (error) {
          console.error("Error getting public URL:", error);
          setFileExists(false);
          setFileUrl(null);
          setPreviewError(`Failed to get document URL: ${error.message}`);
          return;
        }
        
        if (data?.publicUrl) {
          setFileExists(true);
          setFileUrl(data.publicUrl);
          
          // Check if it's an Excel file based on extension
          const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                         storagePath.toLowerCase().endsWith('.xls') ||
                         storagePath.toLowerCase().endsWith('.csv');
          setIsExcelFile(isExcel);
          
          // Clear any previous errors
          setPreviewError(null);
        } else {
          setFileExists(false);
          setFileUrl(null);
          setPreviewError("File not found in storage");
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
