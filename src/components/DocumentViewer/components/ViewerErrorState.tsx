
import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ViewerErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ViewerErrorState: React.FC<ViewerErrorStateProps> = ({ 
  error,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="bg-red-50 text-red-500 p-3 rounded-full mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Unable to load document</h3>
      
      <p className="text-center text-muted-foreground mb-6 max-w-md">
        {error || "There was a problem loading this document. Please try again later."}
      </p>

      <Button 
        onClick={onRetry} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};
