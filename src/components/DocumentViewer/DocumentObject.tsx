
import React, { useState, useEffect } from "react";
import { AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { isDocumentForm31, getEffectiveStoragePath, diagnoseDocumentLoadIssue } from "./utils/documentTypeUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getDocumentPublicUrl } from "@/utils/documentOperations";

// Define the DocumentObjectProps interface
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
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = () => {
    console.error('Error loading document in iframe');
    const diagnosticMessage = diagnoseDocumentLoadIssue(storagePath, new Error('Document failed to load'));
    
    setLoadError(`The document couldn't be displayed. ${diagnosticMessage}`);
    setLoadAttempts(prev => prev + 1);
    
    // Try generating a new signed URL as a fallback
    if (storagePath && loadAttempts < 2) {
      refreshSignedUrl();
    }
    
    if (onError) onError();
  };
  
  // Function to refresh the signed URL
  const refreshSignedUrl = async () => {
    if (!storagePath) return;
    
    setIsLoading(true);
    try {
      const newUrl = await getDocumentPublicUrl(storagePath);
      if (newUrl) {
        setFallbackUrl(`${newUrl}?t=${Date.now()}`);
        setLoadError(null); // Clear error since we have a new URL
        console.log("Generated new signed URL for document");
      } else {
        console.error("Failed to generate new signed URL");
      }
    } catch (error) {
      console.error("Error refreshing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("DocumentObject rendered with:", { 
      publicUrl: publicUrl ? "exists" : "null", 
      storagePath, 
      documentId, 
      loadAttempts,
      fallbackUrl: fallbackUrl ? "exists" : "null"
    });
  }, [publicUrl, storagePath, documentId, loadAttempts, fallbackUrl]);

  // Cache-bust the URL to ensure fresh content
  const cacheBustedUrl = publicUrl ? `${publicUrl}?t=${Date.now()}` : '';
  const effectiveUrl = fallbackUrl || cacheBustedUrl;

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
          <FileText className="h-12 w-12 mb-3 text-muted-foreground mx-auto" />
          <p className="font-medium">Excel Viewer Not Available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Excel files cannot be previewed directly. Please download the file to view its contents.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => {
              if (effectiveUrl) {
                window.open(effectiveUrl, '_blank');
              } else {
                toast.error("Download link unavailable");
              }
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Excel
          </Button>
        </div>
      </div>
    );
  }

  // If there's no URL at all, show appropriate message
  if (!effectiveUrl && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-md max-w-md text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium">Document preview unavailable</p>
          <p className="text-xs text-muted-foreground mt-2">
            The document couldn't be loaded from storage. Storage path may be invalid or inaccessible.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={refreshSignedUrl}
            disabled={isLoading}
          >
            {isLoading ? "Retrying..." : "Retry Loading"}
          </Button>
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
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Try downloading the document directly if you need to view its contents.
              </p>
              {loadAttempts > 0 && (
                <p className="text-xs text-muted-foreground">
                  Attempt: {loadAttempts} of 3
                </p>
              )}
              <div className="flex justify-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshSignedUrl}
                  disabled={isLoading || loadAttempts >= 3}
                >
                  {isLoading ? "Retrying..." : "Retry Loading"}
                </Button>
                {effectiveUrl && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => window.open(effectiveUrl, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-5">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm">Loading document...</p>
          </div>
        </div>
      )}
      
      <iframe
        className="w-full h-full border-0"
        title="Document Preview"
        src={effectiveUrl}
        onError={handleError}
        onLoad={() => console.log("Document loaded successfully from URL:", effectiveUrl ? "exists" : "null")}
      />
    </div>
  );
};
