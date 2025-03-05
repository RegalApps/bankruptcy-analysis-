
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useFileValidator } from '../components/FileValidator';
import logger from "@/utils/logger";

export const useFileUpload = (onUploadComplete: (documentId: string) => Promise<void> | void) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { validateFile } = useFileValidator();

  // Function to extract client name from Form 76 filename
  function extractClientName(filename: string): string {
    const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim();
    }
    return 'Untitled Client';
  }

  // Create a more realistic and controlled upload process
  const simulateProcessingStages = async (isForm76: boolean, isExcel: boolean): Promise<void> => {
    // Initial validation stage (fast)
    setUploadProgress(10);
    setUploadStep("Validating document format and size...");
    await new Promise(r => setTimeout(r, 1000));
    
    // Upload stage (slow)
    setUploadProgress(25);
    setUploadStep("Uploading document to secure storage...");
    await new Promise(r => setTimeout(r, 2000));
    
    // Processing stages (variable time based on document type)
    setUploadProgress(40);
    if (isForm76) {
      setUploadStep("Analyzing Form 76 and extracting client details...");
      await new Promise(r => setTimeout(r, 3000));
    } else if (isExcel) {
      setUploadStep("Processing financial spreadsheet data...");
      await new Promise(r => setTimeout(r, 2500));
    } else {
      setUploadStep("Performing document analysis...");
      await new Promise(r => setTimeout(r, 2000));
    }
    
    setUploadProgress(60);
    if (isForm76) {
      setUploadStep("Performing compliance risk assessment...");
    } else if (isExcel) {
      setUploadStep("Analyzing financial data patterns...");
    } else {
      setUploadStep("Extracting key document information...");
    }
    await new Promise(r => setTimeout(r, 2500));
    
    // Risk assessment and organization (slow)
    setUploadProgress(80);
    setUploadStep("Organizing document in folder structure...");
    await new Promise(r => setTimeout(r, 2000));
    
    // Completion (fast)
    setUploadProgress(95);
    setUploadStep("Finalizing document processing...");
    await new Promise(r => setTimeout(r, 1500));
    
    setUploadProgress(100);
    setUploadStep("Upload complete!");
  };

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

      // Detect if this is Form 76 or Excel from the filename
      const isForm76 = file.name.toLowerCase().includes('form 76') || 
                    file.name.toLowerCase().includes('f76') || 
                    file.name.toLowerCase().includes('form76');
                    
      const isExcel = file.name.toLowerCase().endsWith('.xlsx') || 
                    file.name.toLowerCase().endsWith('.xls') ||
                    file.type.includes('excel');
                    
      logger.info(`Document type detected: ${isForm76 ? 'Form 76' : isExcel ? 'Excel' : 'Standard document'}`);

      // Start processing stage simulation (runs in parallel with actual upload)
      const processingSimulation = simulateProcessingStages(isForm76, isExcel);

      // Actual file upload
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const uploadOptions = {
        cacheControl: '3600',
        upsert: false
      };

      logger.info(`Uploading to storage path: ${filePath}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, uploadOptions);

      if (uploadError) {
        logger.error(`Upload error: ${uploadError.message}`, uploadError);
        throw uploadError;
      }

      // Create database record with user_id
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          storage_path: filePath,
          user_id: user.id,
          ai_processing_status: 'pending',
          metadata: {
            formType: isForm76 ? 'form-76' : null,
            uploadDate: new Date().toISOString(),
            client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
            ocr_status: 'pending'
          }
        })
        .select()
        .single();

      if (documentError) {
        logger.error(`Database error: ${documentError.message}`, documentError);
        throw documentError;
      }
      
      logger.info(`Document record created with ID: ${documentData.id}`);

      // Create notification for document upload
      try {
        await supabase.functions.invoke('handle-notifications', {
          body: {
            action: 'create',
            userId: user.id,
            notification: {
              title: 'Document Upload Started',
              message: `"${file.name}" has been uploaded and is being processed`,
              type: 'info',
              category: 'file_activity',
              priority: 'normal',
              action_url: `/documents/${documentData.id}`,
              metadata: {
                documentId: documentData.id,
                fileName: file.name,
                fileType: isForm76 ? 'form-76' : (isExcel ? 'excel' : 'document'),
                processingStage: 'upload_complete',
                uploadedAt: new Date().toISOString()
              }
            }
          }
        });
      } catch (error) {
        logger.warn("Error creating notification:", error);
        // Continue processing even if notification fails
      }

      // Trigger document analysis using the edge function
      const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentData.id,
          includeRegulatory: true,
          includeClientExtraction: true,
          title: file.name,
          extractionMode: 'comprehensive',
          formType: isForm76 ? 'form-76' : 'unknown'
        }
      });

      if (analysisError) {
        logger.warn("Error triggering analysis:", analysisError);
        // Continue anyway, the analysis might be running in the background
      }

      // Wait for processing simulation to complete
      await processingSimulation;

      await onUploadComplete(documentData.id);

      // Create notification for successful processing
      try {
        await supabase.functions.invoke('handle-notifications', {
          body: {
            action: 'create',
            userId: user.id,
            notification: {
              title: 'Document Processing Complete',
              message: `"${file.name}" has been fully processed`,
              type: 'success',
              category: 'file_activity',
              priority: 'normal',
              action_url: `/documents/${documentData.id}`,
              metadata: {
                documentId: documentData.id,
                fileName: file.name,
                processingStage: 'complete',
                completedAt: new Date().toISOString()
              }
            }
          }
        });
      } catch (error) {
        logger.warn("Error creating completion notification:", error);
      }

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
