
export interface ExcelPreviewProps {
  storagePath: string;
  title?: string;
}

export interface ExcelData {
  headers: string[];
  rows: any[][];
}

export interface ExcelTableProps {
  data: ExcelData;
  enableSorting?: boolean;
  enableFiltering?: boolean;
}

export interface ExcelHeaderActionsProps {
  title?: string;
  onRefresh: () => void;
  publicUrl: string;
}

export interface ExcelErrorDisplayProps {
  error: string;
  onRefresh: () => void;
  publicUrl: string;
}
