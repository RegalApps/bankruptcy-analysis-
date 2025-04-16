
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
