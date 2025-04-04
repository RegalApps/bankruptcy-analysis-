
import { Risk } from "../types";

export interface DocumentPreviewProps {
  storagePath: string;
  documentId: string;
  title: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export interface DocumentObjectProps {
  publicUrl: string | null;
  isExcelFile: boolean;
  storagePath: string;
  documentId: string;
  onError?: () => void;
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

export interface DocumentPreviewContentProps {
  storagePath: string;
  documentId: string;
  title: string;
  previewState: {
    fileExists: boolean;
    fileUrl: string | null;
    isPdfFile: boolean;
    isExcelFile: boolean;
    isDocFile: boolean;
    isLoading: boolean;
    previewError: string | null;
    setPreviewError: (error: string | null) => void;
    checkFile: () => Promise<void>;
    documentRisks: Risk[];
  };
}

export interface UseFileCheckerReturn {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: boolean;
  isExcelFile: boolean;
  isDocFile: boolean;
  checkFile: () => Promise<void>;
}

export interface UseNetworkMonitorReturn {
  networkStatus: 'online' | 'offline' | 'unknown';
  isOnline: boolean;
}

export interface UseRetryStrategyReturn {
  retryCount: number;
  isRetrying: boolean;
  retry: () => void;
  reset: () => void;
}
