import { useState, useEffect } from "react";
import logger from "@/utils/logger";
import { getJson } from "@/utils/storage";

interface UsePreviewStateProps {
  storagePath: string;
}

export const usePreviewState = ({ storagePath }: UsePreviewStateProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileType, setFileType] = useState<string>('unknown');
  const [isLocalFile, setIsLocalFile] = useState(false);
  
  // Check if the file is an Excel file
  const isExcelFile = !!storagePath && /\.(xlsx|xls|csv)$/i.test(storagePath);

  useEffect(() => {
    const fetchFileUrl = async () => {
      if (!storagePath) {
        setError("No storage path provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // For local files, we need to check if the file exists in localStorage
        const documents = getJson<Record<string, any>>('uploaded_documents') || {};
        const documentId = storagePath.includes('/') ? storagePath.split('/').pop() : storagePath;
        
        if (!documentId) {
          setError("Invalid document path");
          setIsLoading(false);
          setFileExists(false);
          return;
        }
        
        const documentData = documents[documentId];
        
        if (!documentData || !documentData.dataUrl) {
          // If we can't find the document in localStorage, check if it's a public file
          if (storagePath.startsWith('/') || storagePath.startsWith('./') || storagePath.startsWith('../')) {
            // This is a relative path to a file in the public directory
            setUrl(storagePath);
            setDownloadUrl(storagePath);
            setFileExists(true);
            setIsLocalFile(false);
            
            // Determine file type from extension
            determineFileType(storagePath);
            
            setIsLoading(false);
            return;
          }
          
          setError("File not found in local storage");
          setIsLoading(false);
          setFileExists(false);
          return;
        }
        
        // File exists in localStorage
        setUrl(documentData.dataUrl);
        setDownloadUrl(documentData.dataUrl);
        setFileExists(true);
        setIsLocalFile(true);
        
        // Determine file type
        determineFileType(documentData.name || storagePath);
      } catch (error: any) {
        logger.error("Error in fetch file URL:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    const determineFileType = (fileName: string) => {
      const lowerFileName = fileName.toLowerCase();
      if (lowerFileName.endsWith('.pdf')) {
        setFileType('pdf');
      } else if (lowerFileName.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/i)) {
        setFileType('image');
      } else if (lowerFileName.match(/\.(xlsx?|csv)$/i)) {
        setFileType('excel');
      } else if (lowerFileName.match(/\.(docx?|txt|rtf)$/i)) {
        setFileType('document');
      } else {
        setFileType('other');
      }
    };

    fetchFileUrl();
  }, [storagePath]);

  return {
    url,
    downloadUrl,
    isLoading,
    error,
    fileExists,
    fileType,
    isExcelFile,
    isLocalFile
  };
};

export default usePreviewState;
