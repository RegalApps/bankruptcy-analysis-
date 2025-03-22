
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useNetworkMonitor } from "./useNetworkMonitor";
import { useRetryStrategy } from "./useRetryStrategy";
import { useFileChecker } from "./useFileChecker";

interface UseFilePreviewProps {
  storagePath: string;
  setFileExists: (exists: boolean) => void;
  setFileUrl: (url: string | null) => void;
  setIsExcelFile: (isExcel: boolean) => void;
  setPreviewError: (error: string | null) => void;
}

export const useFilePreview = ({
  storagePath,
  setFileExists,
  setFileUrl,
  setIsExcelFile,
  setPreviewError
}: UseFilePreviewProps) => {
  const [hasFileLoadStarted, setHasFileLoadStarted] = useState(false);
  
  // Use our network monitor hook
  const { networkStatus, handleOnline } = useNetworkMonitor((status) => {
    // Auto-retry when connection is restored
    if (status === 'online') {
      setTimeout(() => checkFile(storagePath), 1000);
    }
  });
  
  // Use our retry strategy hook
  const { 
    attemptCount, 
    incrementAttempt, 
    resetAttempts,
    lastAttempt,
    setLastAttempt,
    shouldRetry,
    getRetryDelay
  } = useRetryStrategy(5);
  
  // Use our file checker hook
  const setNetworkStatusWrapper = useCallback((status: 'online' | 'offline') => {
    if (status === 'online') {
      handleOnline();
    }
  }, [handleOnline]);
  
  const { checkFile } = useFileChecker(
    setFileExists,
    setFileUrl,
    setIsExcelFile,
    setPreviewError,
    setNetworkStatusWrapper
  );

  // Initial file check
  useEffect(() => {
    const doInitialCheck = async () => {
      setHasFileLoadStarted(true);
      setLastAttempt(new Date());
      incrementAttempt();
      await checkFile(storagePath);
    };
    
    doInitialCheck();
  }, [checkFile, storagePath, setLastAttempt, incrementAttempt]);

  // Periodically check file accessibility when loading hasn't started yet or has failed
  useEffect(() => {
    // Only apply this check to PDF documents to avoid unnecessary retries for Excel files
    const isPdf = storagePath.toLowerCase().endsWith('.pdf');
    
    if (isPdf && (hasFileLoadStarted && attemptCount < 3)) {
      const checkInterval = setTimeout(() => {
        console.log("Doing periodic file accessibility check");
        incrementAttempt();
        checkFile(storagePath);
      }, 5000);
      
      return () => clearTimeout(checkInterval);
    }
  }, [hasFileLoadStarted, attemptCount, checkFile, storagePath, incrementAttempt]);

  // Enhanced auto-retry with progressive backoff
  useEffect(() => {
    // Only retry if we're online and have had a previous attempt
    if (networkStatus === 'online' && attemptCount > 0 && shouldRetry(attemptCount)) {
      // Get appropriate backoff delay
      const retryDelay = getRetryDelay(attemptCount);
      
      console.log(`Network is online, scheduling retry #${attemptCount} in ${retryDelay/1000}s`);
      
      const timeoutId = setTimeout(() => {
        console.log("Auto-retrying file check");
        incrementAttempt();
        checkFile(storagePath);
      }, retryDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    networkStatus, 
    attemptCount, 
    checkFile, 
    storagePath,
    shouldRetry,
    getRetryDelay,
    incrementAttempt
  ]);

  // Handle special retry after longer delay when all previous attempts failed
  useEffect(() => {
    if (attemptCount === 4) {
      console.log("All regular retries failed, scheduling one final attempt after longer delay");
      const finalRetryTimeout = setTimeout(() => {
        incrementAttempt();
        checkFile(storagePath);
      }, 15000); // Wait 15 seconds
      
      return () => clearTimeout(finalRetryTimeout);
    }
  }, [attemptCount, checkFile, storagePath, incrementAttempt]);

  return {
    checkFile: () => checkFile(storagePath),
    lastAttempt,
    attemptCount,
    networkStatus,
    hasFileLoadStarted,
    resetRetries: resetAttempts
  };
};
