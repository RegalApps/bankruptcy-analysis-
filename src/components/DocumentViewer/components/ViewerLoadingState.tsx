
import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ViewerLoadingStateProps {
  onRetry?: () => void;
}

export const ViewerLoadingState: React.FC<ViewerLoadingStateProps> = ({ onRetry }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  
  // Track loading time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const newTime = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(newTime);
      
      // Show retry button after 15 seconds
      if (newTime > 15 && !showRetry) {
        setShowRetry(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Different messages based on loading time
  const getLoadingMessage = () => {
    if (loadingTime > 20) {
      return "This document is taking longer than expected to load. You can try refreshing the page or clicking the retry button below.";
    } else if (loadingTime > 10) {
      return "Still loading document... This may take a moment for large files or if the system is busy.";
    } else if (loadingTime > 5) {
      return "Loading document content... This may take a moment for large files.";
    }
    return "This may take a moment for large documents or during initial processing. Preparing document viewer...";
  };
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      setLoadingTime(0);
      setShowRetry(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-6">
      <LoadingSpinner size="large" />
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium mb-2">Loading Document</h3>
        <p className="text-muted-foreground mb-4">
          {getLoadingMessage()}
        </p>
        {loadingTime > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Loading for {loadingTime} seconds...
          </p>
        )}
        
        {showRetry && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4" 
            onClick={handleRetry}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry Loading
          </Button>
        )}
      </div>
    </div>
  );
};
