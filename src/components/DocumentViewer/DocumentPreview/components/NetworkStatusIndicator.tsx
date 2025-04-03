
import React from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  onRetry: () => void;
  attemptCount?: number;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  isOnline,
  onRetry,
  attemptCount = 0
}) => {
  // Simply return null to hide the component
  return null;
};
