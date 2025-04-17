import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UploadProgress {
  documentId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
}

const activeUploads = new Map<string, UploadProgress>();

// Create an event emitter for upload progress
const uploadProgressEvents = new EventTarget();

export const trackUpload = (documentId: string, initialProgress: number = 0) => {
  activeUploads.set(documentId, {
    documentId,
    progress: initialProgress,
    status: 'uploading',
    message: 'Starting upload...'
  });
  
  // Emit an upload started event
  uploadProgressEvents.dispatchEvent(
    new CustomEvent('upload-progress', { 
      detail: activeUploads.get(documentId) 
    })
  );
  
  return {
    updateProgress: (progress: number, message?: string) => {
      const currentUpload = activeUploads.get(documentId);
      if (currentUpload) {
        activeUploads.set(documentId, {
          ...currentUpload,
          progress,
          message: message || currentUpload.message
        });
        
        // Emit progress update event
        uploadProgressEvents.dispatchEvent(
          new CustomEvent('upload-progress', { 
            detail: activeUploads.get(documentId) 
          })
        );
      }
    },
    
    setProcessing: (message: string = 'Processing document...') => {
      const currentUpload = activeUploads.get(documentId);
      if (currentUpload) {
        activeUploads.set(documentId, {
          ...currentUpload,
          status: 'processing',
          message
        });
        
        // Emit processing event
        uploadProgressEvents.dispatchEvent(
          new CustomEvent('upload-status-change', { 
            detail: activeUploads.get(documentId) 
          })
        );
      }
    },
    
    completeUpload: (message: string = 'Upload complete') => {
      const currentUpload = activeUploads.get(documentId);
      if (currentUpload) {
        activeUploads.set(documentId, {
          ...currentUpload,
          progress: 100,
          status: 'complete',
          message
        });
        
        // Emit complete event
        uploadProgressEvents.dispatchEvent(
          new CustomEvent('upload-complete', { 
            detail: activeUploads.get(documentId) 
          })
        );
        
        // Remove from active uploads after a delay
        setTimeout(() => {
          activeUploads.delete(documentId);
        }, 5000);
      }
    },
    
    setError: (errorMessage: string) => {
      const currentUpload = activeUploads.get(documentId);
      if (currentUpload) {
        activeUploads.set(documentId, {
          ...currentUpload,
          status: 'error',
          message: errorMessage
        });
        
        // Emit error event
        uploadProgressEvents.dispatchEvent(
          new CustomEvent('upload-error', { 
            detail: activeUploads.get(documentId) 
          })
        );
        
        // Keep failed uploads in the list for a while
        setTimeout(() => {
          activeUploads.delete(documentId);
        }, 30000);
      }
    }
  };
};

// Subscribe to document processing status updates
export const setupDocumentProcessingListener = () => {
  const channel = supabase
    .channel('document_processing')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `ai_processing_status=in.(processing,completed,error)`
      },
      (payload) => {
        const document = payload.new as any;
        const documentId = document.id;
        
        // Check if we're tracking this document
        const trackedUpload = activeUploads.get(documentId);
        if (trackedUpload) {
          if (document.ai_processing_status === 'completed') {
            const tracker = trackUpload(documentId);
            tracker.completeUpload('Document processed successfully');
            toast.success('Document processing complete');
          } else if (document.ai_processing_status === 'error') {
            const tracker = trackUpload(documentId);
            tracker.setError('Error processing document');
            toast.error('Document processing failed');
          } else if (document.ai_processing_status === 'processing') {
            const tracker = trackUpload(documentId);
            tracker.setProcessing('Processing document content...');
          }
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Hook for components to listen to upload progress
export const useUploadProgress = (onProgressUpdate?: (uploads: UploadProgress[]) => void) => {
  // Return all active uploads
  const getActiveUploads = () => Array.from(activeUploads.values());
  
  // Listen for upload progress events
  const listenToUploadEvents = (callback: (uploads: UploadProgress[]) => void) => {
    const handleProgress = () => {
      callback(getActiveUploads());
    };
    
    uploadProgressEvents.addEventListener('upload-progress', handleProgress);
    uploadProgressEvents.addEventListener('upload-status-change', handleProgress);
    uploadProgressEvents.addEventListener('upload-complete', handleProgress);
    uploadProgressEvents.addEventListener('upload-error', handleProgress);
    
    return () => {
      uploadProgressEvents.removeEventListener('upload-progress', handleProgress);
      uploadProgressEvents.removeEventListener('upload-status-change', handleProgress);
      uploadProgressEvents.removeEventListener('upload-complete', handleProgress);
      uploadProgressEvents.removeEventListener('upload-error', handleProgress);
    };
  };
  
  return {
    getActiveUploads,
    listenToUploadEvents
  };
};
