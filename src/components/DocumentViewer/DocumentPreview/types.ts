
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
  url: string;
  title: string;
  isFullscreen?: boolean;
  onError?: () => void;
}

export interface UseFileCheckerReturn {
  fileExists: boolean;
  fileUrl: string | null;
  isPdfFile: (path: string) => boolean;
  isExcelFile: (path: string) => boolean;
  isDocFile: (path: string) => boolean;
  checkFile: (storagePath: string) => Promise<void>;
}
