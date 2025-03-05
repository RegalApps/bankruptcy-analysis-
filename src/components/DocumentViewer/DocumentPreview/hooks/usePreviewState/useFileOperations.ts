import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useFileOperations = (storagePath: string, title?: string) => {
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [fileExists, setFileExists] = useState<boolean>(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [diagnosticsMode, setDiagnosticsMode] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
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
      
      setLoading(true);
      setNetworkError(false);
      console.log(`Checking file existence for path: ${storagePath}`);
      
      try {
        // Check if file exists in storage
        const { data, error } = await supabase.storage
          .from('documents')
          .download(storagePath);
        
        if (error) {
          console.error('File existence check error:', error);
          setFileExists(false);
          
          // Differentiate between network and file errors
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            setNetworkError(true);
            setPreviewError(`Network connection error. Please check your internet connection and try again.`);
          } else {
            setPreviewError(`Unable to access the document. ${error.message}`);
          }
          
          setLoading(false);
          return;
        }
        
        setFileExists(true);
        // If file exists, get public URL
        const url = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
        setPublicUrl(url);
        console.log(`File exists, public URL: ${url}`);
        
        // Keep loading true until the object onLoad event fires
      } catch (err: any) {
        console.error('Error checking file existence:', err);
        setFileExists(false);
        
        if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
          setNetworkError(true);
          setPreviewError('Network connection error. Please check your internet connection.');
        } else {
          setPreviewError('Document appears to be missing from storage.');
        }
        
        setLoading(false);
      }
    };
    
    checkFileExistence();
  }, [storagePath]);

  const handleRefreshPreview = useCallback(() => {
    setPreviewError(null);
    setLoading(true);
    setNetworkError(false);
    
    // Force reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = `${iframe.src}?refresh=${new Date().getTime()}`;
    }
    
    // Re-check file existence
    const checkFileAgain = async () => {
      if (!storagePath) return;
      
      try {
        console.log(`Re-checking file existence for path: ${storagePath}`);
        
        // Wait a moment before retrying to allow for network recovery
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data, error } = await supabase.storage
          .from('documents')
          .download(storagePath);
        
        if (error) {
          console.error('File refresh check error:', error);
          setFileExists(false);
          
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            setNetworkError(true);
            setPreviewError(`Network connection error. Please try again when your connection is stable.`);
          } else {
            setPreviewError(`Document still unavailable. ${error.message}`);
          }
          
          setLoading(false);
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
      } catch (err: any) {
        console.error('Error during refresh:', err);
        
        if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
          setNetworkError(true);
          setPreviewError('Network connection error. Please check your internet connection.');
        } else {
          setPreviewError('Could not refresh the document. It may have been deleted.');
        }
        
        setLoading(false);
      }
    };
    
    checkFileAgain();
  }, [storagePath, toast]);

  const handleIframeError = useCallback(() => {
    setPreviewError("There was an issue loading the document preview. The file may be corrupted or in an unsupported format.");
    setLoading(false);
  }, []);

  const toggleDiagnosticsMode = useCallback(() => {
    setDiagnosticsMode(prev => !prev);
  }, []);

  return {
    publicUrl,
    fileExists,
    isExcelFile,
    previewError,
    loading,
    networkError,
    setLoading,
    setPreviewError,
    handleRefreshPreview,
    handleIframeError,
    diagnosticsMode,
    toggleDiagnosticsMode
  };
};
