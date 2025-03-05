
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, RefreshCcw, FileSearch, Database, WifiOff } from "lucide-react";

interface PreviewErrorAlertProps {
  error: string;
  onRefresh: () => void;
  publicUrl: string;
  documentId?: string;
  onRunDiagnostics?: () => void;
}

export const PreviewErrorAlert: React.FC<PreviewErrorAlertProps> = ({
  error,
  onRefresh,
  publicUrl,
  documentId,
  onRunDiagnostics
}) => {
  // Determine if it's a database or network error
  const isDatabaseError = error.toLowerCase().includes('database') || error.toLowerCase().includes('failed to fetch');
  const isNetworkError = error.toLowerCase().includes('network') || error.toLowerCase().includes('connection') || error.toLowerCase().includes('failed to fetch');
  
  return (
    <Alert className="mb-4" variant="destructive">
      {isDatabaseError ? <Database className="h-5 w-5" /> : 
       isNetworkError ? <WifiOff className="h-5 w-5" /> : 
       <AlertTriangle className="h-5 w-5" />}
       
      <AlertTitle className="font-semibold mb-1">
        {isDatabaseError ? "Database Connection Error" : 
         isNetworkError ? "Network Connection Error" : 
         "Preview Error"}
      </AlertTitle>
      
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        
        {isDatabaseError && (
          <p className="text-sm text-muted-foreground">
            There was a problem connecting to the database. This is usually a temporary issue. 
            Please try again in a few moments.
          </p>
        )}
        
        {isNetworkError && !isDatabaseError && (
          <p className="text-sm text-muted-foreground">
            There was a problem with your network connection. Please check your internet connection and try again.
          </p>
        )}
        
        {!isDatabaseError && !isNetworkError && (
          <p className="text-sm text-muted-foreground">
            This could be due to an unsupported file format, a corrupted file, or temporary server issues.
          </p>
        )}
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          
          {publicUrl && (
            <Button variant="default" size="sm" asChild className="gap-2">
              <a 
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download Document
              </a>
            </Button>
          )}
          
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
        </div>
      </AlertDescription>
    </Alert>
  );
};
