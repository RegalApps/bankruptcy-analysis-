
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ErrorDisplayProps } from "../types";

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-full bg-muted/10">
      <div className="text-center max-w-md p-6">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Document</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onRetry} className="mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};
