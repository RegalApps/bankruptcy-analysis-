
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
