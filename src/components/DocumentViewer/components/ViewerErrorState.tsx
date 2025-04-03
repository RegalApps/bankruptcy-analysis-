
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewerErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ViewerErrorState = ({ error, onRetry }: ViewerErrorStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Document Error</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {error || "There was a problem loading this document."}
      </p>
      <Button onClick={onRetry} className="flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};
