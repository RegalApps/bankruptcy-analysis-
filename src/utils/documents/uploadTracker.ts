
import { toast } from "sonner";

type ProgressCallback = (id: string, progress: number, stage: string) => void;

interface UploadTracker {
  updateProgress: (progress: number, stage: string) => void;
  setProcessing: (message: string) => void;
  completeUpload: (message: string) => void;
  setError: (message: string) => void;
}

const activeUploads = new Map<string, {
  toastId: string;
  progress: number;
  stage: string;
}>();

const globalCallbacks: ProgressCallback[] = [];

export const addUploadProgressCallback = (callback: ProgressCallback) => {
  globalCallbacks.push(callback);
  return () => {
    const index = globalCallbacks.indexOf(callback);
    if (index > -1) {
      globalCallbacks.splice(index, 1);
    }
  };
};

export const trackUpload = (
  documentId: string,
  initialProgress = 0
): UploadTracker => {
  // Create a toast to track the progress
  const toastId = toast.loading("Preparing upload...", {
    id: `upload-${documentId}`,
    duration: Infinity,
  });
  
  // Store the upload info
  activeUploads.set(documentId, {
    toastId,
    progress: initialProgress,
    stage: "Initializing...",
  });
  
  const updateProgress = (progress: number, stage: string) => {
    const uploadInfo = activeUploads.get(documentId);
    if (!uploadInfo) return;
    
    activeUploads.set(documentId, {
      ...uploadInfo,
      progress,
      stage,
    });
    
    // Update the toast
    toast.loading(stage, {
      id: uploadInfo.toastId,
      duration: Infinity,
    });
    
    // Notify global callbacks - make sure stage is always a string
    globalCallbacks.forEach(cb => cb(documentId, progress, stage.toString()));
  };
  
  const setProcessing = (message: string) => {
    const uploadInfo = activeUploads.get(documentId);
    if (!uploadInfo) return;
    
    // Update the toast to processing state
    toast.loading(message, {
      id: uploadInfo.toastId,
      duration: Infinity,
    });
    
    // Update the stored state
    activeUploads.set(documentId, {
      ...uploadInfo,
      progress: 80,
      stage: message,
    });
    
    // Notify global callbacks
    globalCallbacks.forEach(cb => cb(documentId, 80, message));
  };
  
  const completeUpload = (message: string) => {
    const uploadInfo = activeUploads.get(documentId);
    if (!uploadInfo) return;
    
    // Update the toast to success state
    toast.success(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    // Notify global callbacks
    globalCallbacks.forEach(cb => cb(documentId, 100, message));
    
    // Remove from active uploads after a delay
    setTimeout(() => {
      activeUploads.delete(documentId);
    }, 5000);
  };
  
  const setError = (message: string) => {
    const uploadInfo = activeUploads.get(documentId);
    if (!uploadInfo) return;
    
    // Update the toast to error state
    toast.error(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    // Notify global callbacks - ensure we're passing a string for the stage parameter
    globalCallbacks.forEach(cb => cb(documentId, 0, `Error: ${message}`));
    
    // Remove from active uploads after a delay
    setTimeout(() => {
      activeUploads.delete(documentId);
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
  const uploadInfo = activeUploads.get(documentId);
  if (!uploadInfo) return null;
  
  return {
    progress: uploadInfo.progress,
    stage: uploadInfo.stage,
  };
};

export const getAllActiveUploads = () => {
  return Array.from(activeUploads.entries()).map(([id, info]) => ({
    id,
    progress: info.progress,
    stage: info.stage,
  }));
};
