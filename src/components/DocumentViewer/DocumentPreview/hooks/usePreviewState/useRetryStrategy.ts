
import { useState, useCallback } from "react";
import { UseRetryStrategyReturn } from "../../types";

export const useRetryStrategy = (maxRetries: number = 3): UseRetryStrategyReturn => {
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  const incrementAttempt = useCallback(() => {
    setAttemptCount(prev => prev + 1);
  }, []);

  const resetAttempts = useCallback(() => {
    setAttemptCount(0);
    setLastAttempt(null);
  }, []);

  const shouldRetry = useCallback((count: number) => {
    return count < maxRetries;
  }, [maxRetries]);

  const getRetryDelay = useCallback((count: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, count - 1), 10000);
  }, []);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retryCount,
    isRetrying,
    retry,
    reset,
    attemptCount,
    incrementAttempt,
    resetAttempts,
    lastAttempt,
    setLastAttempt,
    shouldRetry,
    getRetryDelay
  };
};
