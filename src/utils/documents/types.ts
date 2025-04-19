
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

// Re-export everything from the types/index.ts file for backward compatibility
export * from './types/index';
