
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook that provides network resilience helpers for document loading
 * @param storagePath The storage path of the document
 * @returns Functions and state for network resilience
 */
export const useNetworkResilience = (storagePath: string) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online. Retrying document load...");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You're offline. Document loading paused.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Retry logic with exponential backoff
  const shouldRetry = useCallback((error: any): boolean => {
    // Already retried too many times
    if (retryCount >= 3) return false;
    
    // Check if error seems retriable
    const isNetworkError = error?.message?.includes('fetch') || 
                          error?.message?.includes('network') || 
                          error?.message?.includes('connection');
                          
    // Implement exponential backoff
    if (lastAttempt) {
      const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.
      const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();
      return isNetworkError && timeSinceLastAttempt > backoffTime;
    }
    
    return isNetworkError;
  }, [retryCount, lastAttempt]);

  const resetRetries = useCallback(() => {
    setRetryCount(0);
    setLastAttempt(null);
  }, []);

  const incrementRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setLastAttempt(new Date());
  }, []);
  
  return {
    isOnline,
    retryCount,
    shouldRetry,
    resetRetries,
    incrementRetry
  };
};
