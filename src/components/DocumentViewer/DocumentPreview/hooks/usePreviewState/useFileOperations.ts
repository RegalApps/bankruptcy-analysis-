
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useFileOperations = (storagePath: string, title?: string) => {
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [fileExists, setFileExists] = useState<boolean>(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { toast } = useToast();

  // Determine if the file is an Excel file
  const isExcelFile = 
    storagePath?.endsWith('.xlsx') || 
    storagePath?.endsWith('.xls') ||
    title?.endsWith('.xlsx') || 
    title?.endsWith('.xls');

  // Check if the file exists in storage
  useEffect(() => {
    const checkFileExistence = async () => {
      if (!storagePath) return;
      
      try {
        // Check if file exists in storage
        const { data, error } = await supabase.storage
          .from('documents')
          .download(storagePath);
        
        if (error) {
          console.error('File existence check error:', error);
          setFileExists(false);
          setPreviewError(`Unable to access the document. ${error.message}`);
          return;
        }
        
        setFileExists(true);
        // If file exists, get public URL
        const url = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
        setPublicUrl(url);
      } catch (err) {
        console.error('Error checking file existence:', err);
        setFileExists(false);
        setPreviewError('Document appears to be missing from storage.');
      }
    };
    
    checkFileExistence();
  }, [storagePath]);

  const handleRefreshPreview = () => {
    setPreviewError(null);
    // Force reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = `${iframe.src}?refresh=${new Date().getTime()}`;
    }
    
    // Re-check file existence
    const checkFileAgain = async () => {
      if (!storagePath) return;
      
      try {
        const { data, error } = await supabase.storage
          .from('documents')
          .download(storagePath);
        
        if (error) {
          console.error('File refresh check error:', error);
          setFileExists(false);
          setPreviewError(`Document still unavailable. ${error.message}`);
          return;
        }
        
        setFileExists(true);
        // Update the URL with a cache-busting parameter
        const url = `${supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl}?t=${Date.now()}`;
        setPublicUrl(url);
        toast({
          title: "Preview Refreshed",
          description: "Document preview has been refreshed",
          duration: 2000
        });
      } catch (err) {
        console.error('Error during refresh:', err);
        setPreviewError('Could not refresh the document. It may have been deleted.');
      }
    };
    
    checkFileAgain();
  };

  const handleIframeError = () => {
    setPreviewError("There was an issue loading the document preview. The file may be corrupted or in an unsupported format.");
  };

  return {
    publicUrl,
    fileExists,
    isExcelFile,
    previewError,
    setPreviewError,
    handleRefreshPreview,
    handleIframeError
  };
};
