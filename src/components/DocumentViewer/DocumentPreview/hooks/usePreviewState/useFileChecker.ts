
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UseFileCheckerReturn } from "../../types";

export const useFileChecker = (
  setFileExists: (exists: boolean) => void,
  setFileUrl: (url: string | null) => void,
  setIsExcelFile: (isExcel: boolean) => void,
  setPreviewError: (error: string | null) => void,
  setNetworkStatus: (status: 'online' | 'offline') => void
): UseFileCheckerReturn => {
  
  const getFileExtension = (path: string): string => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const isPdfFile = useCallback((path: string): boolean => {
    return getFileExtension(path) === 'pdf';
  }, []);

  const isExcelFile = useCallback((path: string): boolean => {
    const ext = getFileExtension(path);
    return ['xlsx', 'xls', 'csv'].includes(ext);
  }, []);

  const isDocFile = useCallback((path: string): boolean => {
    const ext = getFileExtension(path);
    return ['doc', 'docx'].includes(ext);
  }, []);

  // Main function to check file existence and properties
  const checkFile = useCallback(async (storagePath: string): Promise<void> => {
    if (!storagePath) {
      setFileExists(false);
      setFileUrl(null);
      setPreviewError('No storage path provided');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error getting file URL:', error);
        setFileExists(false);
        setFileUrl(null);
        
        // Check if error is network-related
        if (error.message.includes('network') || error.message.includes('connect')) {
          setNetworkStatus('offline');
          setPreviewError('Network connection issue. Please check your internet connection.');
        } else {
          setNetworkStatus('online');
          setPreviewError(`Error accessing file: ${error.message}`);
        }
        return;
      }

      if (!data?.signedUrl) {
        setFileExists(false);
        setFileUrl(null);
        setPreviewError('File not found or access denied');
        return;
      }

      // File exists and URL retrieved successfully
      setFileExists(true);
      setFileUrl(data.signedUrl);
      setNetworkStatus('online');
      setIsExcelFile(isExcelFile(storagePath));
    } catch (error: any) {
      console.error('Exception when checking file:', error);
      setFileExists(false);
      setFileUrl(null);
      
      // Categorize error as network-related or other
      if (error.message?.includes('network') || 
          error.message?.includes('fetch') || 
          error.message?.includes('connection')) {
        setNetworkStatus('offline');
        setPreviewError('Network connection error. Please check your internet connection and try again.');
      } else {
        setNetworkStatus('online');
        setPreviewError(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    }
  }, [setFileExists, setFileUrl, setIsExcelFile, setPreviewError, setNetworkStatus, isExcelFile]);

  return {
    fileExists: false,
    fileUrl: null,
    isPdfFile,
    isExcelFile,
    isDocFile,
    checkFile
  };
};
