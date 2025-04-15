
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export const useFileChecker = (
  setFileExists: (exists: boolean) => void,
  setFileUrl: (url: string | null) => void,
  setIsExcelFile: (isExcel: boolean) => void,
  setPreviewError: (error: string | null) => void,
  setNetworkStatus: (status: 'online' | 'offline') => void
) => {
  const checkFile = useCallback(async (storagePath: string) => {
    console.log("Checking file access for:", storagePath);
    
    if (!storagePath) {
      console.error("No storage path provided!");
      setPreviewError("No storage path provided");
      setFileExists(false);
      setFileUrl(null);
      return;
    }

    try {
      // Special handling for demo paths
      if (storagePath.includes('demo/')) {
        console.log("Demo document detected: ", storagePath);
        
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(storagePath, 3600);
          
        if (error) {
          console.error("Error getting demo file:", error);
          setPreviewError(`Error loading demo: ${error.message}`);
          setFileExists(false);
          setFileUrl(null);
          return;
        }
        
        if (data && data.signedUrl) {
          console.log("Successfully got signed URL for demo document");
          setFileExists(true);
          setFileUrl(data.signedUrl);
          setNetworkStatus('online');
          
          // Check if Excel file
          const isExcel = storagePath.toLowerCase().match(/\.(xlsx|xls|csv)$/i);
          setIsExcelFile(!!isExcel);
        } else {
          setPreviewError("Could not generate URL for demo file");
          setFileExists(false);
          setFileUrl(null);
        }
        return;
      }

      // Regular document check
      console.log("Requesting signed URL for:", storagePath);
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600);
        
      if (error) {
        console.error("Error getting file access:", error);
        setPreviewError(`Error loading document: ${error.message}`);
        setFileExists(false);
        setFileUrl(null);
        setNetworkStatus(error.message.includes("network") ? 'offline' : 'online');
        return;
      }
      
      if (data && data.signedUrl) {
        console.log("File exists, URL created successfully");
        setFileExists(true);
        setFileUrl(data.signedUrl);
        setNetworkStatus('online');
        
        // Check if Excel file
        const isExcel = storagePath.toLowerCase().match(/\.(xlsx|xls|csv)$/i);
        setIsExcelFile(!!isExcel);
      } else {
        setPreviewError("File access denied or not found");
        setFileExists(false);
        setFileUrl(null);
      }
    } catch (error: any) {
      console.error("Exception checking file access:", error);
      setPreviewError(`Error: ${error.message || "Unknown error"}`);
      setFileExists(false);
      setFileUrl(null);
      setNetworkStatus(
        error.message?.includes("network") || 
        error.message?.includes("fetch") || 
        error.message?.includes("connection")
          ? 'offline' 
          : 'online'
      );
    }
  }, [setFileExists, setFileUrl, setIsExcelFile, setPreviewError, setNetworkStatus]);

  return { checkFile };
};
