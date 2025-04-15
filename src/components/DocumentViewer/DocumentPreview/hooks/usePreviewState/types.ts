
import { Session } from "@supabase/supabase-js";

export interface PreviewStateProps {
  storagePath: string;
  title?: string;
  onAnalysisComplete?: (id: string) => void; // Updated to accept id parameter
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
  processingStage: string;
  loading: boolean;
  bypassAnalysis: boolean;
  setBypassAnalysis: (bypass: boolean) => void;
  handleRefreshPreview: () => void;
  handleIframeError: () => void;
  handleAnalyzeDocument: (session?: Session | null) => void;
  diagnosticsMode?: boolean;
  toggleDiagnosticsMode?: () => void;
}
