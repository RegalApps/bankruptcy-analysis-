
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSearch, RotateCw, ExternalLink } from "lucide-react";
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
            <p>This appears to be a network connectivity issue. Please check your internet connection and try again.</p>
          )}
          {isFormatError && (
            <p>The document may be in an unsupported format or corrupted. Try converting it to a standard PDF format.</p>
          )}
          {isDatabaseError && (
            <p>There was a problem accessing document data. This may be a temporary server issue.</p>
          )}
          {!isNetworkError && !isFormatError && !isDatabaseError && (
            <p>An unexpected error occurred while loading the document. Please try refreshing or run diagnostics.</p>
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
            Refresh Document
          </Button>
          
          {documentId && onRunDiagnostics && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRunDiagnostics}
              className="gap-2"
            >
              <FileSearch className="h-4 w-4" />
              Run Diagnostics
            </Button>
          )}
          
          {publicUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(publicUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Directly
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
