import React from "react";
import { RefreshCw, AlertTriangle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewerErrorStateProps {
  error?: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ViewerErrorState: React.FC<ViewerErrorStateProps> = ({ 
  error, 
  title, 
  description, 
  onRetry 
}) => {
  const errorMessage = error || description || "An error occurred while loading the document";
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                         errorMessage.toLowerCase().includes('connection') ||
                         errorMessage.toLowerCase().includes('fetch');
  
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-4">
      <div className="max-w-md mx-auto text-center p-6 bg-muted rounded-lg">
        {isNetworkError ? (
          <div className="p-2 bg-destructive/10 rounded-full inline-block mb-3">
            <WifiOff className="h-6 w-6 text-destructive" />
          </div>
        ) : (
          <div className="p-2 bg-amber-100 rounded-full inline-block mb-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
        )}
        
        <h3 className="text-lg font-medium mb-3">
          {title || (isNetworkError ? "Network Connection Error" : "Document Loading Error")}
        </h3>
        
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        
        {isNetworkError && (
          <p className="text-sm text-muted-foreground mb-4">
            Please check your internet connection and try again. If the problem persists, the server may be temporarily unavailable.
          </p>
        )}
        
        {onRetry && (
          <Button onClick={onRetry} className="mx-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </Button>
        )}
      </div>
    </div>
  );
};
