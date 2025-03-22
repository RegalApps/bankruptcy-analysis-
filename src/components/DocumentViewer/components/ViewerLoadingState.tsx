
import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewerLoadingStateProps {
  onRetry?: () => void;
  networkError?: boolean;
}

export const ViewerLoadingState: React.FC<ViewerLoadingStateProps> = ({ 
  onRetry,
  networkError = false 
}) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Track loading time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const newTime = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(newTime);
      
      // Show retry button earlier (after 5 seconds) when there are network issues
      if ((networkError && newTime > 3) || (!networkError && newTime > 7)) {
        setShowRetry(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [networkError]);
  
  // Different messages based on loading time and network status
  const getLoadingMessage = useCallback(() => {
    if (networkError) {
      return "Network connection issues detected. The server might be unavailable or there may be connectivity problems.";
    }
    
    if (loadingTime > 15) {
      return "This document is taking longer than expected to load. It may be unavailable or the server may be experiencing issues.";
    } else if (loadingTime > 8) {
      return "Still loading document... This may take a moment for large files or if the system is busy.";
    } else if (loadingTime > 3) {
      return "Loading document content... This may take a moment for large files.";
    }
    return "Preparing document viewer...";
  }, [loadingTime, networkError]);
  
  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true);
      
      // Add a small delay to give feedback that retry is happening
      setTimeout(() => {
        onRetry();
        setLoadingTime(0);
        setShowRetry(false);
        setIsRetrying(false);
        toast.info("Retrying document load...");
      }, 300);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-6">
      {networkError ? (
        <div className="p-2 bg-destructive/10 rounded-full">
          <AlertCircle size={40} className="text-destructive" />
        </div>
      ) : (
        <LoadingSpinner size="large" />
      )}
      
      <div className="text-center max-w-md px-4">
        <h3 className="text-lg font-medium mb-2">
          {networkError ? "Connection Error" : "Loading Document"}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {getLoadingMessage()}
        </p>
        
        {loadingTime > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {isRetrying ? "Retrying..." : `Loading for ${loadingTime} seconds...`}
          </p>
        )}
        
        {showRetry && onRetry && (
          <Button 
            variant={networkError ? "default" : "outline"} 
            size="sm" 
            className="mt-4" 
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? "Retrying..." : "Retry Loading"}
          </Button>
        )}
      </div>
      
      {/* Skeleton loading UI to indicate content is being loaded */}
      {!networkError && (
        <div className="w-full max-w-3xl px-6 mt-4">
          <Skeleton className="h-7 w-3/4 mb-4" />
          <Skeleton className="h-32 w-full mb-3" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </div>
  );
};
