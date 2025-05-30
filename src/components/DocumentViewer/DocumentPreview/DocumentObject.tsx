
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DocumentObjectProps {
  url: string | null;
  isExcelFile: boolean;
  storagePath: string;
  documentId: string;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  url, 
  isExcelFile,
  storagePath,
  documentId
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleError = () => {
    console.error('Error loading document in iframe');
    setLoadError("The document couldn't be displayed. It may be in an unsupported format or inaccessible.");
  };

  // Cache-bust the URL to ensure fresh content
  const cacheBustedUrl = url ? `${url}?t=${Date.now()}` : '';

  if (isExcelFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="font-medium">Excel Viewer Not Available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Excel files cannot be previewed directly. Please download the file to view its contents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border">
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md max-w-md text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm font-medium">{loadError}</p>
            <p className="text-xs text-muted-foreground">
              Try downloading the document directly if you need to view its contents.
            </p>
          </div>
        </div>
      )}
      
      <iframe
        className="w-full h-full border-0"
        title="Document Preview"
        src={cacheBustedUrl}
        onError={handleError}
      />
    </div>
  );
};
