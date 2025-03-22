
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorDisplayProps } from "../types";

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/30 rounded-md">
      <div className="text-center max-w-md">
        <div className="mb-4 text-destructive">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Document Preview Issue</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onRetry} className="mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};
