
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry
}) => {
  return (
    <Alert className="mt-4" variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Analysis Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button 
        onClick={onRetry} 
        className="mt-2" 
        variant="outline" 
        size="sm"
      >
        Try Analysis Again
      </Button>
    </Alert>
  );
};
