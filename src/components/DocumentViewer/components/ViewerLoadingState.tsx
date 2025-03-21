
import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";

export const ViewerLoadingState: React.FC = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  // Track loading time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Different messages based on loading time
  const getLoadingMessage = () => {
    if (loadingTime > 15) {
      return "This document is taking longer than expected to load. You can try refreshing the page if it doesn't load soon.";
    } else if (loadingTime > 5) {
      return "Still loading document... This may take a moment for large files.";
    }
    return "This may take a moment for large documents or during initial processing.";
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-6">
      <LoadingSpinner size="large" />
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium mb-2">Loading Document</h3>
        <p className="text-muted-foreground">
          {getLoadingMessage()}
        </p>
        {loadingTime > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Loading for {loadingTime} seconds...
          </p>
        )}
      </div>
    </div>
  );
};
