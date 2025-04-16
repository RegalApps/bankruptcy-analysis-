
export interface ExcelPreviewProps {
  storageUrl: string;
  storagePath?: string;
  title?: string;
  documentId?: string;
}

export interface ExcelData {
  headers: string[];
  rows: any[][];
  length?: number;
  sheets?: string[];
}

export interface ExcelHeaderActionsProps {
  title?: string;
  onRefresh: () => void;
  publicUrl: string;
  sheetNames?: string[];
  currentSheet?: number;
  onSheetChange?: (sheet: number) => void;
}

export interface ExcelErrorDisplayProps {
  error: string;
  onRefresh: () => void;
  onRetry?: () => void;
  publicUrl: string;
}
