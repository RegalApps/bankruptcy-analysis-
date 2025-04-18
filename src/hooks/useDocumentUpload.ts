
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { trackUpload } from '@/utils/documents/uploadTracker';
import { toast } from 'sonner';

interface UseDocumentUploadOptions {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
  onUploadError?: (error: Error) => void;
}

export const useDocumentUpload = (options?: UseDocumentUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadDocument = useCallback(async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      // Validate file before proceeding
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error("File size should be less than 10MB");
      }
      
      const acceptedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];
      
      if (!acceptedTypes.includes(file.type) && 
          !file.name.endsWith('.pdf') && 
          !file.name.endsWith('.doc') && 
          !file.name.endsWith('.docx') && 
          !file.name.endsWith('.xls') && 
          !file.name.endsWith('.xlsx')) {
        throw new Error("Unsupported file type. Please upload PDF, Word, or Excel documents.");
      }
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Create document record first to get the ID
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          ai_processing_status: 'uploading',
          metadata: {
            client_id: options?.clientId,
            client_name: options?.clientName,
            original_filename: file.name,
            upload_timestamp: new Date().toISOString(),
            document_type: determineDocumentType(file)
          }
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Set up upload tracking
      const uploadTracker = trackUpload(document.id, 0);
      uploadTracker.updateProgress(5, 'Preparing upload...');
      
      // Start file upload
      uploadTracker.updateProgress(10, 'Uploading file...');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      uploadTracker.updateProgress(70, 'Upload complete, processing document...');
      
      // Get the URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
      
      // Update the document with the storage path
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          storage_path: filePath,
          url: urlData?.signedUrl || null,
          ai_processing_status: 'processing'
        })
        .eq('id', document.id);
      
      if (updateError) throw updateError;
      
      uploadTracker.setProcessing('Document uploaded, now processing content...');
      
      // Simulate document analysis and completion (would be handled by a serverless function in production)
      setTimeout(async () => {
        await supabase
          .from('documents')
          .update({
            ai_processing_status: 'completed',
            ai_confidence_score: 0.95
          })
          .eq('id', document.id);
        
        uploadTracker.completeUpload('Document processed successfully');
      }, 3000);
      
      toast.success('Document uploaded successfully', {
        description: 'The document is now being processed'
      });
      
      // Call the onUploadComplete callback if provided
      if (options?.onUploadComplete) {
        options.onUploadComplete(document.id);
      }
      
      return document;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      
      toast.error('Upload failed', {
        description: error.message || 'An error occurred during upload'
      });
      
      if (options?.onUploadError) {
        options.onUploadError(error);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [isUploading, options]);
  
  return {
    uploadDocument,
    isUploading
  };
};

function determineDocumentType(file: File): string {
  const name = file.name.toLowerCase();
  
  if (name.includes('form 76') || name.includes('form76')) {
    return 'form76';
  }
  if (name.includes('form 47') || name.includes('form47')) {
    return 'form47';
  }
  if (name.includes('form 31') || name.includes('form31')) {
    return 'form31';
  }
  
  // Check file extension
  if (name.endsWith('.pdf')) {
    return 'pdf';
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return 'spreadsheet';
  }
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return 'document';
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')) {
    return 'image';
  }
  
  return 'other';
}
