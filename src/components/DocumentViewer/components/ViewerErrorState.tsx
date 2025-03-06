
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewerErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ViewerErrorState: React.FC<ViewerErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-4">
      <div className="max-w-md mx-auto text-center p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-medium mb-3">Document Loading Error</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Loading
        </Button>
      </div>
    </div>
  );
};
