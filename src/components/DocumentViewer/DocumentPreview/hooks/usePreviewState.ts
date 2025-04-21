
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UsePreviewStateProps {
  storagePath: string;
}

export const usePreviewState = ({ storagePath }: UsePreviewStateProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  
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
        // First, check if file exists
        const { data, error: checkError } = await supabase
          .storage
          .from('documents')
          .list(storagePath.split('/').slice(0, -1).join('/'), {
            search: storagePath.split('/').pop() || ''
          });

        if (checkError) {
          console.error("Error checking file existence:", checkError);
          setError("Error verifying file existence");
          setIsLoading(false);
          setFileExists(false);
          return;
        }

        // If file doesn't exist or list is empty
        if (!data || data.length === 0) {
          setError("File not found");
          setIsLoading(false);
          setFileExists(false);
          return;
        }

        setFileExists(true);

        // Determine file type
        const fileName = storagePath.toLowerCase();
        if (fileName.endsWith('.pdf')) {
          setFileType('pdf');
        } else if (fileName.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/i)) {
          setFileType('image');
        } else if (fileName.match(/\.(xlsx?|csv)$/i)) {
          setFileType('excel');
        } else if (fileName.match(/\.(docx?|txt|rtf)$/i)) {
          setFileType('document');
        } else {
          setFileType('other');
        }

        // Get the file URL
        const { data: urlData, error: urlError } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

        if (urlError) {
          console.error("Error getting signed URL:", urlError);
          setError("Error generating file URL");
          setIsLoading(false);
          return;
        }

        // Set both URL and downloadUrl
        setUrl(urlData?.signedUrl || null);
        setDownloadUrl(urlData?.signedUrl || null);

      } catch (error: any) {
        console.error("Error in fetch file URL:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
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
    isExcelFile
  };
};

export default usePreviewState;
