
import { toast } from 'sonner';
import { UploadInfo, UploadMetric } from './types';

// In-memory storage for active uploads
const activeUploads = new Map<string, UploadInfo>();

// Track upload metrics for analytics
const uploadMetrics: UploadMetric[] = [];

// Initialize a new upload tracker
export function trackUpload(documentId: string, initialProgress = 0, metadata?: Record<string, any>) {
  const toastId = `upload-${documentId}-${Date.now()}`;
  
  // Show initial toast
  toast.loading('Preparing upload...', { id: toastId });
  
  // Create upload info object
  const uploadInfo: UploadInfo = {
    toastId,
    progress: initialProgress,
    stage: 'Initializing...',
    startTime: Date.now(),
    metadata
  };
  
  // Store in active uploads
  activeUploads.set(documentId, uploadInfo);
  
  // Return tracker object with methods to update status
  return {
    updateProgress: (progress: number, stage: string | number) => {
      // Ensure both progress and stage are converted to strings
      const currentInfo = activeUploads.get(documentId);
      if (currentInfo) {
        currentInfo.progress = progress;
        // Convert stage to string to fix the type error
        currentInfo.stage = String(stage);
        
        // Update toast
        toast.loading(`${currentInfo.stage} (${Math.round(progress)}%)`, {
          id: toastId
        });
        
        // Update in map
        activeUploads.set(documentId, currentInfo);
      }
    },
    
    setProcessing: (message: string) => {
      const currentInfo = activeUploads.get(documentId);
      if (currentInfo) {
        currentInfo.stage = message;
        toast.loading(message, { id: toastId });
        activeUploads.set(documentId, currentInfo);
      }
    },
    
    completeUpload: (message: string) => {
      const currentInfo = activeUploads.get(documentId);
      if (currentInfo) {
        // Calculate duration
        const duration = Date.now() - (currentInfo.startTime || Date.now());
        
        // Record metrics
        uploadMetrics.push({
          documentId,
          timestamp: Date.now(),
          duration,
          fileType: currentInfo.metadata?.fileType || 'unknown',
          fileSize: currentInfo.metadata?.fileSize || 0,
          success: true,
          errorMessage: undefined
        });
        
        // Show success message
        toast.success(message, { id: toastId });
        
        // Remove from active uploads
        activeUploads.delete(documentId);
      }
    },
    
    setError: (message: string) => {
      const currentInfo = activeUploads.get(documentId);
      if (currentInfo) {
        // Calculate duration
        const duration = Date.now() - (currentInfo.startTime || Date.now());
        
        // Record metrics with error
        uploadMetrics.push({
          documentId,
          timestamp: Date.now(),
          duration,
          fileType: currentInfo.metadata?.fileType || 'unknown',
          fileSize: currentInfo.metadata?.fileSize || 0,
          success: false,
          errorMessage: message
        });
        
        // Show error message
        toast.error(message, { id: toastId });
        
        // Remove from active uploads
        activeUploads.delete(documentId);
      }
    }
  };
}

// Get the current upload progress
export function getUploadProgress(documentId: string) {
  return activeUploads.get(documentId);
}

// Get all active uploads
export function getActiveUploads() {
  return Array.from(activeUploads.values());
}

// Get upload metrics for analytics
export function getUploadMetrics() {
  return [...uploadMetrics];
}
