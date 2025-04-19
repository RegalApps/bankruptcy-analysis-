
import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorDisplayProps } from "../types";

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  // Determine if the error is network related
  const isNetworkError = 
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('fetch') ||
    error.toLowerCase().includes('connection') ||
    error.toLowerCase().includes('offline');

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 rounded-md">
      <div className="text-center max-w-md">
        <div className="mb-4 text-destructive">
          <AlertTriangle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          {isNetworkError ? "Network Connection Issue" : "Document Preview Issue"}
        </h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        
        {isNetworkError && (
          <p className="text-sm text-muted-foreground mb-4">
            Check your internet connection and ensure you have access to the document storage.
          </p>
        )}
        
        <Button onClick={onRetry} className="mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};
