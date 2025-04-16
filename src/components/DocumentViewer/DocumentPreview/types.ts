
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
  numPages?: number | null;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  scale?: number;
  setScale?: (scale: number) => void;
  isFullscreen?: boolean;
  setIsFullscreen?: (isFullscreen: boolean) => void;
}

export interface PreviewControlsProps {
  publicUrl: string;
  onRefresh: () => void;
}

export interface DocumentObjectProps {
  publicUrl: string;
  isExcelFile?: boolean;
  storagePath?: string;
  documentId?: string;
  onError?: () => void;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export interface DocumentViewerFrameProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export interface DocumentPreviewContentProps {
  documentId: string;
  storagePath: string;
  title: string;
  previewState: any;
  activeRiskId?: string | null;
  onRiskSelect?: (id: string) => void;
  onLoadFailure?: () => void;
  isForm31GreenTech?: boolean;
}

export interface UseNetworkMonitorReturn {
  networkStatus: 'online' | 'offline' | 'unknown';
}

export interface UseRetryStrategyReturn {
  attemptCount: number;
  incrementAttempt: () => void;
  resetAttempts: () => void;
}

export interface RiskHighlightOverlayProps {
  risks: any[];
  documentWidth: number;
  documentHeight: number;
  activeRiskId: string | null;
  onRiskClick: (risk: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  currentPage?: number;
}

