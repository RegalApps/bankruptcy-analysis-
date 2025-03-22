
import { RefObject } from "react";

export interface DocumentPreviewProps {
  storagePath: string;
  documentId: string;
  title: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export interface PreviewState {
  fileExists: boolean;
  fileUrl: string | null;
  isExcelFile: boolean;
  previewError: string | null;
  setPreviewError: (error: string | null) => void;
  analyzing: boolean;
  error: string | null;
  analysisStep: string;
  progress: number;
  processingStage: string;
  session: any;
  setSession: (session: any) => void;
  handleAnalyzeDocument: (session: any) => void;
  isAnalysisStuck: {
    stuck: boolean;
    minutesStuck: number;
  };
  checkFile: () => Promise<void>;
  isLoading: boolean;
  handleAnalysisRetry: () => void;
}

export interface DocumentPreviewContentProps {
  storagePath: string;
  documentId: string;
  title: string;
  previewState: PreviewState;
}

export interface DocumentViewerFrameProps {
  fileUrl: string;
  title: string;
  isLoading: boolean;
  useDirectLink: boolean;
  zoomLevel: number;
  isPdfFile: boolean;
  isDocFile: boolean;
  onIframeLoad: () => void;
  onIframeError: () => void;
  iframeRef: RefObject<HTMLIFrameElement>;
  forceReload: number;
  onOpenInNewTab?: () => void;
  onDownload?: () => void;
}

export interface ViewerToolbarProps {
  title: string;
  zoomLevel: number;
  isRetrying: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}
