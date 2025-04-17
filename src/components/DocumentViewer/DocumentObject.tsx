
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { isDocumentForm31, getEffectiveStoragePath } from "./utils/documentTypeUtils";

// Define the DocumentObjectProps interface directly in this file
export interface DocumentObjectProps {
  publicUrl: string | null;
  isExcelFile?: boolean;
  storagePath?: string | null;
  documentId?: string | null;
  onError?: () => void;
}

export const DocumentObject: React.FC<DocumentObjectProps> = ({ 
  publicUrl, 
  isExcelFile,
  storagePath,
  documentId,
  onError
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const handleError = () => {
    console.error('Error loading document in iframe');
    setLoadError("The document couldn't be displayed. It may be in an unsupported format or inaccessible.");
    setLoadAttempts(prev => prev + 1);
    
    if (onError) onError();
  };
  
  useEffect(() => {
    console.log("DocumentObject rendered with:", { 
      publicUrl: publicUrl ? "exists" : "null", 
      storagePath, 
      documentId, 
      loadAttempts 
    });
  }, [publicUrl, storagePath, documentId, loadAttempts]);

  // Cache-bust the URL to ensure fresh content
  const cacheBustedUrl = publicUrl ? `${publicUrl}?t=${Date.now()}` : '';

  // Use the centralized utility function to detect Form 31 documents
  const isGreenTechForm31 = isDocumentForm31(
    null, 
    documentId,
    storagePath, 
    null
  );
                            
  if (isGreenTechForm31) {
    console.log("Using fallback path for GreenTech Form 31");
    // Always use local path for Form 31 demo documents to ensure reliability
    const localPath = "/documents/sample-form31-greentech.pdf";
    console.log("Loading Form 31 from local path:", localPath);
    return (
      <div className="relative w-full h-full rounded-md overflow-hidden border">
        <iframe
          className="w-full h-full border-0"
          title="Document Preview"
          src={localPath}
          onError={handleError}
          onLoad={() => console.log("Form 31 document loaded successfully")}
        />
      </div>
    );
  }

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
            {loadAttempts > 0 && (
              <p className="text-xs text-muted-foreground">
                Attempt: {loadAttempts} of 3
              </p>
            )}
          </div>
        </div>
      )}
      
      <iframe
        className="w-full h-full border-0"
        title="Document Preview"
        src={cacheBustedUrl}
        onError={handleError}
        onLoad={() => console.log("Document loaded successfully from URL:", cacheBustedUrl ? "exists" : "null")}
      />
    </div>
  );
};
