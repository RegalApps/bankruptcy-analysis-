
export interface PreviewStateProps {
  storagePath: string;
  title?: string;
  onAnalysisComplete?: () => void;
}

export interface PreviewState {
  previewError: string | null;
  setPreviewError: (error: string | null) => void;
  publicUrl: string;
  isExcelFile: boolean;
  fileExists: boolean;
  analyzing: boolean;
  error: string | null;
  analysisStep: string;
  progress: number;
  processingStage?: string;
  loading: boolean;
  handleRefreshPreview: () => void;
  handleIframeError: () => void;
  handleAnalyzeDocument: () => void;
}

export interface AnalysisInitializationProps {
  storagePath: string;
  fileExists: boolean;
  isExcelFile: boolean;
  analyzing: boolean;
  error: string | null;
  setSession: (session: any) => void;
  handleAnalyzeDocument: () => void;
  setPreviewError: (error: string | null) => void;
  onAnalysisComplete?: () => void;
}

export interface RealtimeSubscriptionsProps {
  storagePath: string;
  setSession: (session: any) => void;
  onAnalysisComplete?: () => void;
}
