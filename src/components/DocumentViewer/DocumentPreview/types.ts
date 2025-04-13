
import { Risk } from '../RiskAssessment/types';

export interface DocumentPreviewContentProps {
  documentId: string;
  storagePath: string;
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
    networkStatus?: 'online' | 'offline' | 'unknown';
    attemptCount?: number;
  };
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
  onLoadFailure?: () => void;
  isForm31GreenTech?: boolean;
}

export interface DocumentObjectProps {
  publicUrl: string | null;
  isExcelFile: boolean;
  storagePath: string;
  documentId: string;
  onError?: () => void;
}

export interface DocumentViewerFrameProps {
  url?: string;
  title?: string;
  isFullscreen?: boolean;
  onError?: () => void;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export interface UseFileCheckerReturn {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: (path: string) => boolean;
  isExcelFile: (path: string) => boolean;
  isDocFile: (path: string) => boolean;
  checkFile: (storagePath: string) => Promise<void>;
}

export interface PreviewControlsProps {
  publicUrl: string;
  onRefresh: () => void;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export interface ViewerToolbarProps {
  title: string;
  zoomLevel: number;
  isRetrying?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onDownload: () => void;
  onPrint: () => void;
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
  setLastAttempt: (date: Date | null) => void;
  shouldRetry: (count: number) => boolean;
  getRetryDelay: (count: number) => number;
}
