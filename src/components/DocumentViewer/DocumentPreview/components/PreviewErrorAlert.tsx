
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, RefreshCcw } from "lucide-react";

interface PreviewErrorAlertProps {
  error: string;
  onRefresh: () => void;
  publicUrl: string;
}

export const PreviewErrorAlert: React.FC<PreviewErrorAlertProps> = ({
  error,
  onRefresh,
  publicUrl
}) => {
  return (
    <Alert className="mb-4" variant="destructive">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-semibold mb-1">Preview Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        <p className="text-sm text-muted-foreground">
          This could be due to an unsupported file format, a corrupted file, or temporary server issues.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
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
        </div>
      </AlertDescription>
    </Alert>
  );
};
