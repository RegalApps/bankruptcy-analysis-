
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { trackUpload } from '@/utils/documents/uploadTracker';
import { toast } from 'sonner';

// Define the useDocumentUpload hook
export const useDocumentUpload = (options?: {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
  onUploadError?: (error: Error) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadDocument = useCallback(async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      // Create document record first to get the ID
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          ai_processing_status: 'pending',
          metadata: {
            client_id: options?.clientId,
            client_name: options?.clientName,
            original_filename: file.name,
            upload_timestamp: new Date().toISOString()
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
        .getPublicUrl(filePath);
      
      // Update the document with the storage path
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          storage_path: filePath,
          url: urlData?.publicUrl || null,
          ai_processing_status: 'processing'
        })
        .eq('id', document.id);
      
      if (updateError) throw updateError;
      
      uploadTracker.setProcessing('Document uploaded, now processing content...');
      
      // Optional: Trigger document analysis (you might want a separate function for this)
      
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
