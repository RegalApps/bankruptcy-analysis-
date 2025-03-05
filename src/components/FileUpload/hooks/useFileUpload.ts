
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useFileValidator } from '../components/FileValidator';

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

  const handleUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadStep("Validating document format and size...");

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

      setUploadProgress(25);
      setUploadStep("Uploading document to secure storage...");

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Create upload options with onUploadProgress callback
      const uploadOptions = {
        cacheControl: '3600',
        upsert: false
      };

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, uploadOptions);

      if (uploadError) throw uploadError;

      setUploadProgress(50);
      setUploadStep("Processing document and extracting information...");

      // Try to detect if this is Form 76 from the filename
      const isForm76 = file.name.toLowerCase().includes('form 76') || 
                     file.name.toLowerCase().includes('f76') || 
                     file.name.toLowerCase().includes('form76');

      // Create database record with user_id
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          storage_path: filePath,
          user_id: user.id, // Add user_id field to fix RLS policy
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

      if (documentError) throw documentError;

      setUploadProgress(70);
      
      // Different message based on file type      
      if (isForm76) {
        setUploadStep("Analyzing Form 76 and extracting client details...");
      } else if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadStep("Processing financial spreadsheet data...");
      } else {
        setUploadStep("Performing document analysis and risk assessment...");
      }

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
                fileType: isForm76 ? 'form-76' : (file.type.includes('excel') ? 'excel' : 'document'),
                processingStage: 'upload_complete',
                uploadedAt: new Date().toISOString()
              }
            }
          }
        });
      } catch (error) {
        console.error("Error creating notification:", error);
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
        console.error("Error triggering analysis:", analysisError);
        // Continue anyway, the analysis might be running in the background
      }

      setUploadProgress(90);
      setUploadStep("Organizing document in folder structure...");

      await onUploadComplete(documentData.id);

      setUploadProgress(100);
      setUploadStep("Upload complete!");

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
        console.error("Error creating completion notification:", error);
      }

      toast({
        title: "Success",
        description: isForm76 
          ? "Form 76 uploaded and analyzed successfully" 
          : "Document uploaded and processed successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStep("");
      }, 2000);
    }
  }, [onUploadComplete, toast, validateFile]);

  return {
    handleUpload,
    isUploading,
    uploadProgress,
    uploadStep
  };
};
