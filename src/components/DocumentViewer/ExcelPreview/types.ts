
export interface ExcelPreviewProps {
  storagePath: string;
  title?: string;
}

export interface ExcelData {
  headers: string[];
  rows: any[][];
}
