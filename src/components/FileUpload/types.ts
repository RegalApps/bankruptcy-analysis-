
export interface FileUploadProps {
  onUploadComplete: (documentId: string) => Promise<void> | void;
}
