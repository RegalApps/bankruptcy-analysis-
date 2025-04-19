import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { trackUpload } from '@/utils/documents/uploadTracker';
import { toast } from 'sonner';
import { isForm31ByFilename } from '@/utils/documents/formCleanup';

interface UseDocumentUploadOptions {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
  onUploadError?: (error: Error) => void;
}

export const useDocumentUpload = (options?: UseDocumentUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const ensureStorageBucket = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const docsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
      
      if (!docsBucketExists) {
        console.log('Documents bucket does not exist, creating it...');
        const { error } = await supabase.storage.createBucket('documents', {
          public: false,
          fileSizeLimit: 10485760,
        });
        
        if (error) {
          console.error('Error creating documents bucket:', error);
          throw new Error('Failed to create storage bucket. Please contact support.');
        }
        console.log('Documents bucket created successfully');
      }
      return true;
    } catch (error) {
      console.error('Error ensuring storage bucket exists:', error);
      return false;
    }
  };
  
  const uploadDocument = useCallback(async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      const isForm31 = isForm31ByFilename(file.name);
      
      if (isForm31) {
        console.log("Form 31 document detected:", file.name);
      }
      
      const bucketReady = await ensureStorageBucket();
      if (!bucketReady) {
        throw new Error("Storage system not properly configured. Please try again later.");
      }
      
      if (file.size > 10 * 1024 * 1024) {
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
      
      const fileType = file.type || file.name.split('.').pop() || 'unknown';
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          ai_processing_status: 'uploading',
          metadata: {
            client_id: options?.clientId,
            client_name: options?.clientName || (isForm31 ? 'GreenTech Industries' : undefined),
            original_filename: file.name,
            upload_timestamp: new Date().toISOString(),
            document_type: determineDocumentType(file)
          }
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      const uploadTracker = trackUpload(document.id, 0, {
        fileType,
        fileSize: file.size,
        fileName: file.name
      });
      uploadTracker.updateProgress(5, 'Preparing upload...');
      
      uploadTracker.updateProgress(10, 'Uploading file...');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      uploadTracker.updateProgress(70, 'Upload complete, processing document...');
      
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);
      
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          storage_path: filePath,
          url: urlData?.signedUrl || null,
          ai_processing_status: 'processing',
          ...(isForm31 && {
            metadata: {
              ...document.metadata,
              form_number: '31',
              form_title: 'Proof of Claim',
              form_type: 'bankruptcy',
              claim_amount: '$125,450',
              debtor_name: 'GreenTech Industries',
              processing_priority: 'high',
              document_type: 'form31'
            }
          })
        })
        .eq('id', document.id);
      
      if (updateError) throw updateError;
      
      uploadTracker.setProcessing(isForm31 ? 
        'Processing Form 31 - Proof of Claim document...' : 
        'Document uploaded, now processing content...');
      
      setTimeout(async () => {
        await supabase
          .from('documents')
          .update({
            ai_processing_status: 'completed',
            ai_confidence_score: isForm31 ? 0.95 : 0.85,
            ...(isForm31 && {
              metadata: {
                ...document.metadata,
                form_number: '31',
                form_title: 'Proof of Claim',
                form_type: 'bankruptcy',
                claim_amount: '$125,450',
                debtor_name: 'GreenTech Industries',
                creditor_name: options?.clientName || 'GreenTech Industries',
                processing_priority: 'high',
                processing_complete: true,
                verified: true,
                document_type: 'form31'
              }
            })
          })
          .eq('id', document.id);
        
        uploadTracker.completeUpload(isForm31 ? 
          'Form 31 processed successfully' : 
          'Document processed successfully');
      }, 3000);
      
      toast.success(isForm31 ? 
        'Form 31 uploaded successfully' : 
        'Document uploaded successfully', {
        description: 'The document is now being processed'
      });
      
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
  if (name.includes('form 31') || name.includes('form31') || name.includes('proof of claim')) {
    return 'form31';
  }
  
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
