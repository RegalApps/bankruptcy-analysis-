
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
        console.log("Checking file at path:", storagePath);
        
        // Get public URL for file
        const { data } = await supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);
        
        if (data?.publicUrl) {
          console.log("File found with URL:", data.publicUrl);
          setFileExists(true);
          setFileUrl(data.publicUrl);
          
          // Check if it's an Excel file based on extension
          const isExcel = storagePath.toLowerCase().endsWith('.xlsx') || 
                         storagePath.toLowerCase().endsWith('.xls') ||
                         storagePath.toLowerCase().endsWith('.csv');
                         
          setIsExcelFile(isExcel);
          setPreviewError(null);
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
