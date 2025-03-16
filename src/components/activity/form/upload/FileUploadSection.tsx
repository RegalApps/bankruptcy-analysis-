
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadArea } from "./UploadArea";
import { DocumentList } from "./DocumentList";
import { useFileUpload } from "./hooks/useFileUpload";

interface FileUploadSectionProps {
  clientName?: string;
  onDocumentUpload?: (documentId: string) => void;
}

export const FileUploadSection = ({ clientName, onDocumentUpload }: FileUploadSectionProps) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const { handleUpload, isUploading } = useFileUpload({
    clientName,
    onDocumentUpload,
    setFiles
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Client Documents</CardTitle>
          <CardDescription>
            Upload financial statements, identification, and other documents for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadArea handleFileChange={handleUpload} isUploading={isUploading} />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <DocumentList files={files} />
      )}
    </div>
  );
};

// Types moved to a separate file but included here for context
import { FileInfo } from "./types";
