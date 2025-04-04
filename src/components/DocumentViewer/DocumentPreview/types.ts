
import { Risk } from "../types";

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
    networkStatus: 'online' | 'offline' | 'unknown';
    attemptCount: number;
    documentRisks: Risk[];
  };
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

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
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

export interface UseRetryStrategyReturn {
  attemptCount: number;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  lastAttempt: Date | null;
  setLastAttempt: (date: Date | null) => void;
  shouldRetry: (currentAttempt: number) => boolean;
  getRetryDelay: (attempt: number) => number;
}

export interface UseNetworkMonitorReturn {
  networkStatus: 'online' | 'offline';
  handleOnline: () => void;
  handleOffline: () => void;
}

export interface UseFileCheckerReturn {
  checkFile: (path?: string) => Promise<void>;
  handleFileCheckError: (error: any, publicUrl?: string | null) => void;
}
