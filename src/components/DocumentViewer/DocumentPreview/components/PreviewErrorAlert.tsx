
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
    <Alert className="mb-4">
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Try Again
          </Button>
          <Button variant="default" size="sm" asChild>
            <a 
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Document Externally
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
