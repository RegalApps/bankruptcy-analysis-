import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFilePreview } from "./useFilePreview";

interface PreviewStateProps {
  storagePath: string;
}

export const usePreviewState = ({ storagePath }: PreviewStateProps) => {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileType, setFileType] = useState("unknown");
  const [url, setUrl] = useState<string | null>(null);
  const [isExcelFile, setIsExcelFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFallbackToDirectUrl, setHasFallbackToDirectUrl] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLocalFile, setIsLocalFile] = useState(true); // Always true in local-only mode

  // Use the FilePreview hook with the correct props shape
  const { 
    checkFile, 
    networkStatus, 
    attemptCount,
    hasFileLoadStarted,
    resetRetries
  } = useFilePreview({
    storagePath,
    setFileExists,
    setFileUrl: (url) => {
      setUrl(url);
      setDownloadUrl(url);
    },
    setIsExcelFile, 
    setPreviewError
  });

  // When file information changes, update loading state
  useEffect(() => {
    if (url) {
      // If we have a file URL, we can consider loading complete
      setIsLoading(false);
    }
  }, [url]);

  // Determine file type based on storage path
  useEffect(() => {
    if (storagePath) {
      const extension = storagePath.split('.').pop()?.toLowerCase() || '';
      
      if (extension === 'pdf') {
        setFileType('pdf');
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        setFileType('image');
      } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
        setFileType('excel');
        setIsExcelFile(true);
      } else if (['doc', 'docx'].includes(extension)) {
        setFileType('word');
      } else if (['ppt', 'pptx'].includes(extension)) {
        setFileType('powerpoint');
      } else {
        setFileType('other');
      }
    }
  }, [storagePath]);

  // Log network status changes for debugging
  useEffect(() => {
    console.log(`Network status: ${networkStatus}, attempt count: ${attemptCount}`);
  }, [networkStatus, attemptCount]);

  // Auto-fallback to direct URL mode after multiple failures with preview
  useEffect(() => {
    if (previewError && !hasFallbackToDirectUrl) {
      console.log("Preview error detected, trying fallback");
      setHasFallbackToDirectUrl(true);
      // Force an additional check
      setTimeout(checkFile, 1000);
    }
  }, [previewError, hasFallbackToDirectUrl, checkFile]);

  // Initial file check
  useEffect(() => {
    if (storagePath) {
      checkFile();
    }
  }, [storagePath, checkFile]);

  return {
    url,
    downloadUrl,
    fileExists,
    isExcelFile,
    fileType,
    error: previewError,
    isLoading,
    networkStatus,
    checkFile,
    resetRetries,
    isLocalFile
  };
};
