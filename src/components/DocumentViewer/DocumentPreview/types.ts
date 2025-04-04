
import { Risk } from "../types";

export interface DocumentPreviewContentProps {
  storagePath: string;
  documentId: string;
  title: string;
  previewState: {
    fileExists: boolean;
    fileUrl: string | null;
    isPdfFile: (path: string) => boolean;
    isExcelFile: (path: string) => boolean;
    isDocFile: (path: string) => boolean;
    isLoading: boolean;
    previewError: string | null;
    setPreviewError: (error: string | null) => void;
    checkFile: () => Promise<void>;
    documentRisks: Risk[];
  };
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
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

export interface UseFileCheckerReturn {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: (path: string) => boolean;
  isExcelFile: (path: string) => boolean;
  isDocFile: (path: string) => boolean;
  checkFile: (storagePath: string) => Promise<void>;
}

export interface UseNetworkMonitorReturn {
  networkStatus: 'online' | 'offline' | 'unknown';
  isOnline: boolean;
  handleOnline: () => void;
}

export interface UseRetryStrategyReturn {
  retryCount: number;
  isRetrying: boolean;
  retry: () => void;
  reset: () => void;
  attemptCount: number;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  lastAttempt: Date | null;
  setLastAttempt: (date: Date) => void;
  shouldRetry: (attemptCount: number) => boolean;
  getRetryDelay: (attemptCount: number) => number;
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
  iframeRef: React.RefObject<HTMLIFrameElement>;
  forceReload: number;
  onOpenInNewTab: () => void;
  onDownload: () => void;
}
