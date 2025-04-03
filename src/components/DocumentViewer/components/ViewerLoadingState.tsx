
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ViewerLoadingStateProps {
  onRetry: () => void;
  networkError?: boolean;
}

export const ViewerLoadingState = ({ onRetry, networkError }: ViewerLoadingStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {networkError ? (
        <>
          <WifiOff className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Issue</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            There appears to be a network issue. Please check your connection and try again.
          </p>
        </>
      ) : (
        <>
          <LoadingSpinner size="large" className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Loading Document</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Please wait while we prepare your document for viewing.
          </p>
        </>
      )}
      
      <Button 
        onClick={onRetry} 
        variant={networkError ? "default" : "outline"} 
        className="flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reload
      </Button>
    </div>
  );
};
