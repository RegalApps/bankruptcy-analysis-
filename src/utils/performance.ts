
import { toast } from "sonner";
import { startTiming, endTiming } from "./performanceMonitor";

/**
 * Shows a performance toast for a specific page or operation
 */
export const showPerformanceToast = (pageName: string) => {
  // End timing for page load
  const loadTime = endTiming(`page-load-${pageName}`, false);
  
  if (loadTime > 500) {
    toast.info(
      `${pageName} loaded in ${(loadTime / 1000).toFixed(1)}s`, 
      { duration: 3000, position: 'bottom-right' }
    );
  }
  
  // Start timing for page interactions
  startTiming(`page-interact-${pageName}`);
};

/**
 * Measures and reports navigation performance
 */
export const measureRouteChange = (from: string, to: string) => {
  endTiming(`page-interact-${from}`, false);
  startTiming(`page-load-${to}`);
  
  // Reset document load timings when changing routes
  try {
    performance.clearMarks('document-load-start');
    performance.clearMarks('document-load-end');
  } catch (e) {
    // Ignore errors in browsers that don't support this
  }
};

/**
 * Measures document loading performance
 */
export const measureDocumentLoad = (documentId: string) => {
  startTiming(`document-load-${documentId}`);
  return () => {
    const loadTime = endTiming(`document-load-${documentId}`, false);
    if (loadTime > 1000) {
      console.warn(`Document ${documentId} took ${(loadTime / 1000).toFixed(1)}s to load`);
    }
  };
};
