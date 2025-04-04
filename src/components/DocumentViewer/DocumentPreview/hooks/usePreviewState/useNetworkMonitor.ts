
import { useState, useEffect, useCallback } from "react";
import { UseNetworkMonitorReturn } from "../../types";

export const useNetworkMonitor = (onStatusChange?: (status: 'online' | 'offline' | 'unknown') => void): UseNetworkMonitorReturn => {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'unknown'>(
    navigator.onLine ? 'online' : 'offline'
  );
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const handleOnline = useCallback(() => {
    setNetworkStatus('online');
    setIsOnline(true);
    if (onStatusChange) onStatusChange('online');
  }, [onStatusChange]);

  const handleOffline = useCallback(() => {
    setNetworkStatus('offline');
    setIsOnline(false);
    if (onStatusChange) onStatusChange('offline');
  }, [onStatusChange]);

  useEffect(() => {
    // Set initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return {
    networkStatus,
    isOnline,
    handleOnline
  };
};
