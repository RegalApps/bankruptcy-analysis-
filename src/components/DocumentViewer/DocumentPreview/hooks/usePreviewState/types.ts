
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
  loading: boolean;
  handleRefreshPreview: () => void;
  handleIframeError: () => void;
  handleAnalyzeDocument: () => void;
}
