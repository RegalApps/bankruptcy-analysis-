
import { useState, useCallback } from "react";
import { UseRetryStrategyReturn } from "../../types";

/**
 * Hook to manage retry attempts with exponential backoff
 */
export const useRetryStrategy = (maxAttempts = 5): UseRetryStrategyReturn => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  
  const incrementAttempt = useCallback(() => {
    setAttemptCount(count => Math.min(count + 1, maxAttempts));
    setLastAttempt(new Date());
  }, [maxAttempts]);
  
  const resetAttempts = useCallback(() => {
    setAttemptCount(0);
    setLastAttempt(null);
  }, []);
  
  /**
   * Determine if another retry should be attempted based on the current count
   */
  const shouldRetry = useCallback((currentAttempt: number): boolean => {
    return currentAttempt < maxAttempts;
  }, [maxAttempts]);
  
  /**
   * Calculate delay for the next retry using exponential backoff
   * Returns delay in milliseconds
   */
  const getRetryDelay = useCallback((attempt: number): number => {
    // Progressive backoff: 2s, 4s, 8s, etc. with a max of 15s
    return Math.min(2000 * Math.pow(2, attempt - 1), 15000);
  }, []);
  
  return {
    attemptCount,
    incrementAttempt,
    resetAttempts,
    lastAttempt,
    setLastAttempt,
    shouldRetry,
    getRetryDelay
  };
};
