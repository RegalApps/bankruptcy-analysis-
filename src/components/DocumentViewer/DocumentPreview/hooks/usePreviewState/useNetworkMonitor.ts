
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UseNetworkMonitorReturn } from "../../types";

/**
 * Hook to monitor network status changes
 */
export const useNetworkMonitor = (
  onNetworkStatusChange?: (status: 'online' | 'offline') => void
): UseNetworkMonitorReturn => {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>(
    navigator.onLine ? 'online' : 'offline'
  );

  const handleOnline = () => {
    setNetworkStatus('online');
    // Only show toast if we were previously offline and now coming back online
    if (networkStatus === 'offline') {
      toast.success("Connection restored. Retrying document load...");
      if (onNetworkStatusChange) {
        onNetworkStatusChange('online');
      }
    }
  };
  
  const handleOffline = () => {
    setNetworkStatus('offline');
    toast.error("You're offline. Document loading paused.");
    if (onNetworkStatusChange) {
      onNetworkStatusChange('offline');
    }
  };
  
  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networkStatus]);
  
  return {
    networkStatus,
    handleOnline,
    handleOffline
  };
};
