
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleDocumentUpload, uploadToStorage, cleanupUpload } from '../uploadService';
import { supabase } from '@/lib/supabase';

export const useFileUpload = (onUploadComplete?: (documentId: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ message: string; percentage?: number }>({ 
    message: '', 
    percentage: 0 
  });
  const { toast } = useToast();

  const updateProgress = (message: string, percentage?: number) => {
    setProgress({ message, percentage });
  };

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    let fileName = null;
    let documentData = null;

    try {
      // Step 1: Upload to storage
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data.user?.id || 'anonymous';
      const result = await uploadToStorage(file, userId, updateProgress);
      fileName = result.fileName;
      documentData = result.documentData;

      // Step 2: Process the document
      await handleDocumentUpload(file, documentData.id, updateProgress);

      toast({
        title: "Document uploaded successfully",
        description: "Your document is being analyzed. This may take a few moments."
      });

      if (onUploadComplete) {
        onUploadComplete(documentData.id);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload document"
      });

      if (fileName) {
        await cleanupUpload(fileName);
      }
    } finally {
      setIsUploading(false);
      setProgress({ message: '', percentage: 0 });
    }
  }, [onUploadComplete, toast]);

  return {
    isUploading,
    progress,
    handleUpload
  };
};
