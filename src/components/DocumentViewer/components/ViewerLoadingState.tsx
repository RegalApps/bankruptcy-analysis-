
import React, { memo } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const ViewerLoadingState: React.FC = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-6">
      <LoadingSpinner size="large" />
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium mb-2">Loading Document</h3>
        <p className="text-muted-foreground">
          This may take a moment for large documents or during initial processing.
        </p>
      </div>
    </div>
  );
});

ViewerLoadingState.displayName = "ViewerLoadingState";
