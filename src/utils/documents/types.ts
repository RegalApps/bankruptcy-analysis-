
export type ProgressCallback = (id: string, progress: number, stage: string) => void;

export interface UploadTracker {
  updateProgress: (progress: number, stage: string | number) => void;
  setProcessing: (message: string) => void;
  completeUpload: (message: string) => void;
  setError: (message: string) => void;
}

export interface UploadInfo {
  toastId: string;
  progress: number;
  stage: string;
  startTime?: number;
  metadata?: Record<string, any>;
}

export interface UploadMetric {
  documentId: string;
  timestamp: number;
  duration: number;
  fileType: string;
  fileSize: number;
  success: boolean;
  errorMessage?: string;
}
