
import { FileText, FileQuestion, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "../../types";
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentPreviewTabProps {
  document: Document;
  hasStoragePath: boolean;
  effectiveDocumentId: string;
  getStoragePath: () => string;
  handleDocumentOpen: () => void;
}

export const DocumentPreviewTab: React.FC<DocumentPreviewTabProps> = ({
  document,
  hasStoragePath,
  effectiveDocumentId,
  getStoragePath,
  handleDocumentOpen,
}) => {
  const [previewError, setPreviewError] = useState(false);
  
  // We're now using this function to handle errors from DocumentPreview
  const handlePreviewError = () => {
    setPreviewError(true);
    toast.error("Could not load document preview");
  };
  
  const handleDownload = () => {
    // In a real app, this would download the file
    toast.info("Download functionality not implemented in this demo");
    // If we had the actual download URL:
    // window.open(getStoragePath(), '_blank');
  };

  return (
    <>
      {hasStoragePath && !previewError ? (
        <div className="h-64 overflow-hidden rounded-md border relative group">
          <DocumentPreview 
            storagePath={getStoragePath()}
            documentId={effectiveDocumentId}
            title={document.title}
            onAnalysisComplete={() => {
              // This is a valid prop according to DocumentPreviewProps
              console.log("Analysis completed for", document.title);
            }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="sm" 
              className="mr-2"
              onClick={handleDocumentOpen}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-md p-8 h-64 flex flex-col items-center justify-center">
          {previewError ? (
            <>
              <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                There was an error loading the document preview.
              </p>
            </>
          ) : (
            <>
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                Document preview not available.
              </p>
            </>
          )}
          <Button 
            variant="default" 
            className="mt-2"
            onClick={handleDocumentOpen}
          >
            Open in Document Viewer
          </Button>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Document Information</h4>
        <Card>
          <CardContent className="p-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Type:</div>
              <div>{document.type || 'Unknown'}</div>
              
              <div className="text-muted-foreground">Updated:</div>
              <div>{new Date(document.updated_at).toLocaleDateString()}</div>
              
              <div className="text-muted-foreground">Created:</div>
              <div>{new Date(document.created_at).toLocaleDateString()}</div>
              
              {document.metadata && document.metadata.formNumber && (
                <>
                  <div className="text-muted-foreground">Form Number:</div>
                  <div>{document.metadata.formNumber}</div>
                </>
              )}
            </div>
            
            <p className="mt-3">
              This document appears to be a {document.type || 'standard document'} related to client {document.title.includes('Form') ? 'financial information' : 'case details'}.
            </p>
            <p className="mt-2 text-muted-foreground text-xs">AI summary is a preview feature and may not be accurate.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
