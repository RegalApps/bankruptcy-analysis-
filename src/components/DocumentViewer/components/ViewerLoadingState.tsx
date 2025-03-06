
import React from "react";
import { LoadingState } from "../LoadingState";

export const ViewerLoadingState: React.FC = () => {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-4">
      <LoadingState size="large" message="Loading document details..." />
      <p className="text-muted-foreground mt-2">
        This may take a moment for large documents or during initial processing.
      </p>
    </div>
  );
};
