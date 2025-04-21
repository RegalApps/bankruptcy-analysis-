
import React from "react";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ViewerLoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
  onRetry?: () => void;
  networkError?: boolean;
}

export const ViewerLoadingState: React.FC<ViewerLoadingStateProps> = ({
  message = "Loading document...",
  size = "medium",
  onRetry,
  networkError = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "min-h-[100px] p-3";
      case "large":
        return "min-h-[300px] p-8";
      default:
        return "min-h-[200px] p-6";
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${getSizeClasses()}`}>
      {networkError ? (
        <WifiOff className="h-10 w-10 text-destructive/80" />
      ) : (
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};
