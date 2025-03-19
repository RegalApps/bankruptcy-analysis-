
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "../../types";
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      {hasStoragePath ? (
        <div className="h-64 overflow-hidden rounded-md border">
          <DocumentPreview 
            storagePath={getStoragePath()}
            documentId={effectiveDocumentId}
            title={document.title}
          />
        </div>
      ) : (
        <div className="bg-muted rounded-md p-8 h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Document preview not available.
            <br />
            <Button 
              variant="link" 
              className="mt-2"
              onClick={handleDocumentOpen}
            >
              Open in Document Viewer
            </Button>
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">AI Summary</h4>
        <Card>
          <CardContent className="p-3 text-sm">
            <p>This document appears to be a {document.type || 'standard document'} related to client {document.title.includes('Form') ? 'financial information' : 'case details'}.</p>
            <p className="mt-2 text-muted-foreground text-xs">AI summary is a preview feature and may not be accurate.</p>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground mt-3">
          Tip: Double-click on a document in the list to open it in the document viewer.
        </p>
      </div>
    </>
  );
};
