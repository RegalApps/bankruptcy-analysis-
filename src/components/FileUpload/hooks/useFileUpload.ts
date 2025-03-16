
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useFileValidator } from '../components/FileValidator';
import logger from "@/utils/logger";
import { 
  simulateProcessingStages, 
  createDocumentRecord, 
  uploadToStorage, 
  triggerDocumentAnalysis,
  createNotification
} from '../utils/uploadProcessor';
import { detectDocumentType } from '../utils/fileTypeDetector';

export const useFileUpload = (onUploadComplete: (documentId: string) => Promise<void> | void) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { validateFile } = useFileValidator();

  const handleUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(5);
      setUploadStep("Preparing document for upload...");
      
      logger.info(`Starting upload process for: ${file.name}, size: ${file.size} bytes`);

      // Get user ID for document ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to upload documents"
        });
        setIsUploading(false);
        return;
      }

      // Detect file type
      const { isForm76, isExcel } = detectDocumentType(file);
      logger.info(`Document type detected: ${isForm76 ? 'Form 76' : isExcel ? 'Excel' : 'Standard document'}`);

      // Start processing stage simulation (runs in parallel with actual upload)
      const processingSimulation = simulateProcessingStages(
        isForm76, 
        isExcel, 
        setUploadProgress, 
        setUploadStep
      );

      // Create database record
      const { data: documentData, error: documentError } = await createDocumentRecord(
        file, 
        user.id, 
        undefined, // client name will be extracted if it's Form 76
        isForm76
      );

      if (documentError) {
        throw documentError;
      }
      
      logger.info(`Document record created with ID: ${documentData.id}`);

      // Upload file to storage
      const filePath = `${user.id}/${documentData.id}/${file.name}`;
      const { error: uploadError } = await uploadToStorage(file, user.id, filePath);

      if (uploadError) {
        throw uploadError;
      }

      // Update document with storage path
      const { error: updateError } = await supabase
        .from('documents')
        .update({ storage_path: filePath })
        .eq('id', documentData.id);

      if (updateError) {
        throw updateError;
      }

      // Create notification for document upload
      await createNotification(
        user.id,
        'Document Upload Started',
        `"${file.name}" has been uploaded and is being processed`,
        'info',
        documentData.id,
        file.name,
        'upload_complete'
      );

      // Trigger document analysis
      await triggerDocumentAnalysis(documentData.id, file.name, isForm76);

      // Wait for processing simulation to complete
      await processingSimulation;

      // Call the completion callback
      await onUploadComplete(documentData.id);

      // Create notification for successful processing
      await createNotification(
        user.id,
        'Document Processing Complete',
        `"${file.name}" has been fully processed`,
        'success',
        documentData.id,
        file.name,
        'complete'
      );

      toast({
        title: "Success",
        description: isForm76 
          ? "Form 76 uploaded and analyzed successfully" 
          : "Document uploaded and processed successfully",
      });
    } catch (error) {
      logger.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document. Please try again.",
      });
    } finally {
      // Delay resetting the state to let users see the completion message
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStep("");
      }, 3000); // Show completion for 3 seconds
    }
  }, [onUploadComplete, toast, validateFile]);

  return {
    handleUpload,
    isUploading,
    uploadProgress,
    uploadStep
  };
};
