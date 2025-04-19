
import { toast } from 'sonner';
import { UploadInfo, UploadMetric } from './types';

// In-memory storage for active uploads
const activeUploads = new Map<string, UploadInfo>();

// Track upload metrics for analytics
const uploadMetrics: UploadMetric[] = [];

// Callbacks for tracking upload progress
const progressCallbacks: Array<(id: string, progress: number, stage: string) => void> = [];

// Add a callback function to be notified of upload progress updates
export function addUploadProgressCallback(
  callback: (id: string, progress: number, stage: string) => void
) {
  progressCallbacks.push(callback);
  
  // Return an unsubscribe function
  return () => {
    const index = progressCallbacks.indexOf(callback);
    if (index !== -1) {
      progressCallbacks.splice(index, 1);
    }
  };
}

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
  
  // Notify callbacks of new upload
  progressCallbacks.forEach(callback => {
    callback(documentId, initialProgress, 'Initializing...');
  });
  
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
        
        // Notify callbacks of progress update
        progressCallbacks.forEach(callback => {
          callback(documentId, progress, currentInfo.stage);
        });
      }
    },
    
    setProcessing: (message: string) => {
      const currentInfo = activeUploads.get(documentId);
      if (currentInfo) {
        currentInfo.stage = message;
        toast.loading(message, { id: toastId });
        activeUploads.set(documentId, currentInfo);
        
        // Notify callbacks of stage change
        progressCallbacks.forEach(callback => {
          callback(documentId, currentInfo.progress, message);
        });
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
        
        // Notify callbacks of completion
        progressCallbacks.forEach(callback => {
          callback(documentId, 100, "Complete");
        });
        
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
        
        // Notify callbacks of error
        progressCallbacks.forEach(callback => {
          callback(documentId, currentInfo.progress, "Error: " + message);
        });
        
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

// Get all active uploads with their document IDs
export function getAllActiveUploads() {
  return Array.from(activeUploads.entries()).map(([documentId, uploadInfo]) => ({
    ...uploadInfo,
    id: documentId
  }));
}

// Get upload metrics for analytics
export function getUploadMetrics() {
  return [...uploadMetrics];
}

// Get upload analytics summary
export function getUploadAnalytics() {
  // Calculate totals and success rate
  const totalUploads = uploadMetrics.length;
  const successfulUploads = uploadMetrics.filter(metric => metric.success).length;
  const successRate = totalUploads > 0 ? successfulUploads / totalUploads : 0;
  
  // Calculate average duration
  const totalDuration = uploadMetrics.reduce((sum, metric) => sum + metric.duration, 0);
  const averageDuration = totalUploads > 0 ? totalDuration / totalUploads : 0;
  
  // Group by file type
  const byFileType: Record<string, { count: number, successCount: number, averageDuration: number }> = {};
  uploadMetrics.forEach(metric => {
    const fileType = metric.fileType || 'unknown';
    if (!byFileType[fileType]) {
      byFileType[fileType] = { count: 0, successCount: 0, averageDuration: 0 };
    }
    byFileType[fileType].count++;
    if (metric.success) {
      byFileType[fileType].successCount++;
    }
    byFileType[fileType].averageDuration = 
      (byFileType[fileType].averageDuration * (byFileType[fileType].count - 1) + metric.duration) / 
      byFileType[fileType].count;
  });
  
  // Return analytics object
  return {
    totalUploads,
    successRate,
    averageDuration,
    byFileType,
    recent: uploadMetrics.slice(-10).reverse() // Last 10 uploads, most recent first
  };
}

// Get upload speed trend
export function getUploadSpeedTrend() {
  // Group uploads by hour for the last 24 hours
  const now = Date.now();
  const hourlyData: Array<{ count: number, totalSize: number, timestamp: number }> = [];
  
  // Create 24 hourly buckets
  for (let i = 0; i < 24; i++) {
    const hourStart = now - (24 - i) * 60 * 60 * 1000;
    const hourEnd = now - (23 - i) * 60 * 60 * 1000;
    
    // Filter metrics for this hour
    const hourMetrics = uploadMetrics.filter(metric => 
      metric.timestamp >= hourStart && metric.timestamp < hourEnd
    );
    
    // Calculate statistics
    const count = hourMetrics.length;
    const totalSize = hourMetrics.reduce((sum, metric) => sum + metric.fileSize, 0);
    
    hourlyData.push({
      count,
      totalSize,
      timestamp: hourStart
    });
  }
  
  return hourlyData;
}
