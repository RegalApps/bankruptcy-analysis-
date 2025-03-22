
import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  onRetry: () => void;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  isOnline,
  onRetry
}) => {
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-4 right-4 flex items-center p-3 bg-destructive/80 text-destructive-foreground rounded-md shadow-lg animate-pulse">
      <WifiOff className="h-4 w-4 mr-2" />
      <span className="text-sm font-medium mr-2">Offline</span>
      <Button 
        variant="secondary" 
        size="sm" 
        className="ml-2" 
        onClick={onRetry}
      >
        <Wifi className="h-3 w-3 mr-1" />
        Retry
      </Button>
    </div>
  );
};
