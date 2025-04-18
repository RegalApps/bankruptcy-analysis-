
import { toast } from "sonner";
import { UploadTracker } from './types';
import { uploadStore } from './uploadStore';
import { uploadAnalytics } from './uploadAnalytics';
import { uploadCallbacks } from './uploadCallbacks';

export const addUploadProgressCallback = uploadCallbacks.add.bind(uploadCallbacks);

export const trackUpload = (
  documentId: string | number,
  initialProgress = 0,
  metadata?: Record<string, any>
): UploadTracker => {
  // Ensure documentId is converted to a string
  const id = String(documentId);
  
  // Create a toast to track the progress
  const toastId = toast.loading("Preparing upload...", {
    id: `upload-${id}`,
    duration: Infinity,
  });
  
  // Store the upload info with timestamp
  uploadStore.set(id, {
    toastId,
    progress: initialProgress,
    stage: "Initializing...",
    startTime: Date.now(),
    metadata
  });
  
  const updateProgress = (progress: number, stage: string | number) => {
    const uploadInfo = uploadStore.get(id);
    if (!uploadInfo) return;
    
    // Convert stage to string to maintain consistent typing
    const stageString = String(stage);
    
    uploadStore.set(id, {
      ...uploadInfo,
      progress,
      stage: stageString,
    });
    
    // Update the toast
    toast.loading(stageString, {
      id: uploadInfo.toastId,
      duration: Infinity,
    });
    
    // Notify global callbacks
    uploadCallbacks.notify(id, progress, stageString);
  };
  
  const setProcessing = (message: string) => {
    const uploadInfo = uploadStore.get(id);
    if (!uploadInfo) return;
    
    toast.loading(message, {
      id: uploadInfo.toastId,
      duration: Infinity,
    });
    
    uploadStore.set(id, {
      ...uploadInfo,
      progress: 80,
      stage: message,
    });
    
    uploadCallbacks.notify(id, 80, message);
  };
  
  const completeUpload = (message: string) => {
    const uploadInfo = uploadStore.get(id);
    if (!uploadInfo) return;
    
    const endTime = Date.now();
    const duration = uploadInfo.startTime ? endTime - uploadInfo.startTime : 0;
    
    toast.success(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    uploadCallbacks.notify(id, 100, message);
    
    // Save upload metrics before removal
    if (uploadInfo.startTime) {
      uploadAnalytics.logMetric({
        documentId: id,
        timestamp: endTime,
        duration,
        fileType: uploadInfo.metadata?.fileType || 'unknown',
        fileSize: uploadInfo.metadata?.fileSize || 0,
        success: true
      });
    }
    
    // Remove from active uploads after a delay
    setTimeout(() => {
      uploadStore.delete(id);
    }, 5000);
  };
  
  const setError = (message: string) => {
    const uploadInfo = uploadStore.get(id);
    if (!uploadInfo) return;
    
    const endTime = Date.now();
    const duration = uploadInfo.startTime ? endTime - uploadInfo.startTime : 0;
    
    toast.error(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    uploadCallbacks.notify(id, 0, `Error: ${message}`);
    
    if (uploadInfo.startTime) {
      uploadAnalytics.logMetric({
        documentId: id,
        timestamp: endTime,
        duration,
        fileType: uploadInfo.metadata?.fileType || 'unknown',
        fileSize: uploadInfo.metadata?.fileSize || 0,
        success: false,
        errorMessage: message
      });
    }
    
    setTimeout(() => {
      uploadStore.delete(id);
    }, 5000);
  };
  
  return {
    updateProgress,
    setProcessing,
    completeUpload,
    setError,
  };
};

export const getUploadProgress = (documentId: string) => {
  const uploadInfo = uploadStore.get(documentId);
  if (!uploadInfo) return null;
  
  return {
    progress: uploadInfo.progress,
    stage: uploadInfo.stage,
  };
};

export const getAllActiveUploads = uploadStore.getAll.bind(uploadStore);
export const getUploadAnalytics = uploadAnalytics.getAnalytics.bind(uploadAnalytics);
export const getUploadSpeedTrend = uploadAnalytics.getTrendData.bind(uploadAnalytics);
