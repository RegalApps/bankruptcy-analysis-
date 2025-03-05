
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSearch, RotateCw, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewErrorAlertProps {
  error: string;
  onRefresh: () => void;
  publicUrl: string;
  documentId?: string;
  onRunDiagnostics?: () => void;
}

export const PreviewErrorAlert = ({
  error,
  onRefresh,
  publicUrl,
  documentId,
  onRunDiagnostics
}: PreviewErrorAlertProps) => {
  // Identify the error type to provide more contextual help
  const isNetworkError = error.includes('network') || 
                         error.includes('connection') || 
                         error.includes('Failed to fetch');
                         
  const isFormatError = error.includes('format') || 
                        error.includes('unsupported') || 
                        error.includes('corrupted');
                        
  const isDatabaseError = error.includes('Database error') || 
                          error.includes('SQL');

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="space-y-4">
        <div>
          <span className="font-medium">Error: </span>{error}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-1">
          {isNetworkError && <Badge variant="outline">Network Issue</Badge>}
          {isFormatError && <Badge variant="outline">Format Problem</Badge>}
          {isDatabaseError && <Badge variant="outline">Database Error</Badge>}
        </div>
        
        <div className="text-sm opacity-80 mt-2">
          {isNetworkError && (
            <p>Check your internet connection and try again. The document server may be temporarily unavailable.</p>
          )}
          {isFormatError && (
            <p>This document may be in an unsupported format. Try downloading it directly to view with a compatible application.</p>
          )}
          {isDatabaseError && (
            <p>There was a problem accessing the document data. This is likely a temporary server issue.</p>
          )}
          {!isNetworkError && !isFormatError && !isDatabaseError && (
            <p>An unexpected error occurred. Try refreshing the preview or downloading the document directly.</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="default"
            size="sm"
            onClick={onRefresh}
            className="gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </Button>
          
          {documentId && onRunDiagnostics && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRunDiagnostics}
              className="gap-2"
            >
              <FileSearch className="h-4 w-4" />
              Diagnostics
            </Button>
          )}
          
          {publicUrl && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(publicUrl, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = publicUrl;
                  link.download = publicUrl.split('/').pop() || 'document';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
