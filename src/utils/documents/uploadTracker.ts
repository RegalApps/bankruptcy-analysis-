import { toast } from "sonner";

type ProgressCallback = (id: string, progress: number, stage: string) => void;

interface UploadTracker {
  updateProgress: (progress: number, stage: string | number) => void;
  setProcessing: (message: string) => void;
  completeUpload: (message: string) => void;
  setError: (message: string) => void;
}

const activeUploads = new Map<string, {
  toastId: string;
  progress: number;
  stage: string;
  startTime?: number;
  metadata?: Record<string, any>;
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
  activeUploads.set(id, {
    toastId,
    progress: initialProgress,
    stage: "Initializing...",
    startTime: Date.now(),
    metadata
  });
  
  const updateProgress = (progress: number, stage: string | number) => {
    const uploadInfo = activeUploads.get(id);
    if (!uploadInfo) return;
    
    // Convert stage to string to maintain consistent typing
    const stageString = String(stage);
    
    activeUploads.set(id, {
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
    globalCallbacks.forEach(cb => cb(id, progress, stageString));
  };
  
  const setProcessing = (message: string) => {
    const uploadInfo = activeUploads.get(id);
    if (!uploadInfo) return;
    
    // Update the toast to processing state
    toast.loading(message, {
      id: uploadInfo.toastId,
      duration: Infinity,
    });
    
    // Update the stored state
    activeUploads.set(id, {
      ...uploadInfo,
      progress: 80,
      stage: message,
    });
    
    // Notify global callbacks
    globalCallbacks.forEach(cb => cb(id, 80, message));
  };
  
  const completeUpload = (message: string) => {
    const uploadInfo = activeUploads.get(id);
    if (!uploadInfo) return;
    
    const endTime = Date.now();
    const duration = uploadInfo.startTime ? endTime - uploadInfo.startTime : 0;
    
    // Update the toast to success state
    toast.success(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    // Notify global callbacks
    globalCallbacks.forEach(cb => cb(id, 100, message));
    
    // Save upload metrics before removal
    if (uploadInfo.startTime) {
      logUploadMetrics(id, {
        duration,
        fileType: uploadInfo.metadata?.fileType || 'unknown',
        fileSize: uploadInfo.metadata?.fileSize || 0,
        success: true
      });
    }
    
    // Remove from active uploads after a delay
    setTimeout(() => {
      activeUploads.delete(id);
    }, 5000);
  };
  
  const setError = (message: string) => {
    const uploadInfo = activeUploads.get(id);
    if (!uploadInfo) return;
    
    const endTime = Date.now();
    const duration = uploadInfo.startTime ? endTime - uploadInfo.startTime : 0;
    
    // Update the toast to error state
    toast.error(message, {
      id: uploadInfo.toastId,
      duration: 5000,
    });
    
    // Notify global callbacks - ensure we're passing a string for the stage parameter
    globalCallbacks.forEach(cb => cb(id, 0, `Error: ${message}`));
    
    // Save upload metrics for failed uploads
    if (uploadInfo.startTime) {
      logUploadMetrics(id, {
        duration,
        fileType: uploadInfo.metadata?.fileType || 'unknown',
        fileSize: uploadInfo.metadata?.fileSize || 0,
        success: false,
        errorMessage: message
      });
    }
    
    // Remove from active uploads after a delay
    setTimeout(() => {
      activeUploads.delete(id);
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

// Upload metrics storage
const uploadMetrics: Array<{
  documentId: string;
  timestamp: number;
  duration: number;
  fileType: string;
  fileSize: number;
  success: boolean;
  errorMessage?: string;
}> = [];

// Function to log upload metrics
function logUploadMetrics(documentId: string, data: {
  duration: number;
  fileType: string;
  fileSize: number;
  success: boolean;
  errorMessage?: string;
}) {
  uploadMetrics.push({
    documentId,
    timestamp: Date.now(),
    ...data
  });
  
  // Keep only the last 100 upload metrics
  if (uploadMetrics.length > 100) {
    uploadMetrics.shift();
  }
}

// Analytics functions
export const getUploadAnalytics = () => {
  if (uploadMetrics.length === 0) {
    return {
      totalUploads: 0,
      successRate: 0,
      averageDuration: 0,
      byFileType: {},
      recent: []
    };
  }
  
  const successful = uploadMetrics.filter(m => m.success);
  const averageDuration = successful.reduce((sum, m) => sum + m.duration, 0) / (successful.length || 1);
  
  // Group by file type
  const byFileType: Record<string, { count: number, successCount: number, averageDuration: number }> = {};
  
  uploadMetrics.forEach(metric => {
    if (!byFileType[metric.fileType]) {
      byFileType[metric.fileType] = { count: 0, successCount: 0, averageDuration: 0 };
    }
    
    byFileType[metric.fileType].count++;
    
    if (metric.success) {
      byFileType[metric.fileType].successCount++;
      // Running average calculation
      const current = byFileType[metric.fileType];
      current.averageDuration = 
        (current.averageDuration * (current.successCount - 1) + metric.duration) / current.successCount;
    }
  });
  
  return {
    totalUploads: uploadMetrics.length,
    successRate: successful.length / uploadMetrics.length,
    averageDuration,
    byFileType,
    recent: uploadMetrics.slice(-10) // Last 10 uploads
  };
};

// Get upload speed over time (last 24 hours)
export const getUploadSpeedTrend = () => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  
  // Filter uploads from last 24 hours
  const recentUploads = uploadMetrics.filter(
    m => m.timestamp >= oneDayAgo && m.success
  );
  
  // Group by hour
  const hourlyData: Record<number, { count: number, totalSize: number, timestamp: number }> = {};
  
  recentUploads.forEach(upload => {
    const hour = Math.floor((upload.timestamp - oneDayAgo) / (60 * 60 * 1000));
    
    if (!hourlyData[hour]) {
      hourlyData[hour] = {
        count: 0,
        totalSize: 0,
        timestamp: oneDayAgo + hour * 60 * 60 * 1000
      };
    }
    
    hourlyData[hour].count++;
    hourlyData[hour].totalSize += upload.fileSize;
  });
  
  return Object.values(hourlyData).sort((a, b) => a.timestamp - b.timestamp);
};
