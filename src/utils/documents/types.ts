
// Define the UploadMetric type that's used by uploadAnalytics
export interface UploadMetric {
  documentId: string;
  timestamp: number;
  duration: number;
  fileType: string;
  fileSize: number;
  success: boolean;
  errorMessage?: string;
}
