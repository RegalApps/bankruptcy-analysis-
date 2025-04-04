
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
