
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  file: File;
  documentId?: string;
}

export interface UseFileUploadProps {
  clientName?: string;
  onDocumentUpload?: (documentId: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
}
