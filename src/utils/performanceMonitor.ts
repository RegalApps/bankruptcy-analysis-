/**
 * Optimized performance monitoring utility
 */

// Use a more efficient data structure for performance measurements
const performanceMeasurements: Record<string, { start: number; end?: number }> = {};

// Store historical data for anomaly detection - limit history size to prevent memory issues
const MAX_HISTORY_SIZE = 50;
const performanceHistory: Record<string, number[]> = {};
const anomalyThresholds: Record<string, { mean: number; stdDev: number }> = {};

/**
 * Start timing a specific operation
 */
export const startTiming = (operationName: string): void => {
  performanceMeasurements[operationName] = {
    start: performance.now()
  };
};

/**
 * End timing a specific operation and return the duration
 * @param operationName The name of the operation to end timing for
 * @param logResult Whether to log the result (default: false in production)
 * @returns The duration in milliseconds or undefined if no timing was started
 */
export const endTiming = (operationName: string, logResult: boolean = process.env.NODE_ENV !== 'production'): number | undefined => {
  const measurement = performanceMeasurements[operationName];
  if (!measurement) {
    return undefined;
  }

  if (measurement.end !== undefined) {
    return measurement.end - measurement.start;
  }

  measurement.end = performance.now();
  const duration = measurement.end - measurement.start;
  
  // Only log in development or when explicitly requested
  if (logResult) {
    console.log(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
  }
  
  // Add to history for anomaly detection - limit the history size
  if (!performanceHistory[operationName]) {
    performanceHistory[operationName] = [];
  }
  
  performanceHistory[operationName].push(duration);
  
  // Trim history array if it gets too large
  if (performanceHistory[operationName].length > MAX_HISTORY_SIZE) {
    performanceHistory[operationName] = performanceHistory[operationName].slice(-MAX_HISTORY_SIZE);
  }
  
  // After collecting enough samples, calculate anomaly thresholds
  if (performanceHistory[operationName].length >= 5) {
    updateAnomalyThresholds(operationName);
  }
  
  // Check if this is an anomaly
  const isAnomaly = checkForAnomaly(operationName, duration);
  if (isAnomaly && logResult) {
    console.warn(`ANOMALY DETECTED: ${operationName} (${duration.toFixed(2)}ms) is significantly slower than usual`);
  }
  
  return duration;
};

/**
 * Update anomaly detection thresholds based on historical data - optimized calculation
 */
const updateAnomalyThresholds = (operationName: string): void => {
  const history = performanceHistory[operationName];
  if (history.length < 5) return; // Need enough samples
  
  // Calculate mean more efficiently
  const sum = history.reduce((acc, val) => acc + val, 0);
  const mean = sum / history.length;
  
  // Calculate standard deviation more efficiently
  let sumSquaredDiff = 0;
  for (let i = 0; i < history.length; i++) {
    sumSquaredDiff += Math.pow(history[i] - mean, 2);
  }
  
  const stdDev = Math.sqrt(sumSquaredDiff / history.length);
  
  anomalyThresholds[operationName] = { mean, stdDev };
};

/**
 * Check if a performance measurement is an anomaly
 */
const checkForAnomaly = (operationName: string, duration: number): boolean => {
  const threshold = anomalyThresholds[operationName];
  if (!threshold) return false;
  
  // Consider values beyond 2 standard deviations as anomalies
  const upperBound = threshold.mean + (2 * threshold.stdDev);
  return duration > upperBound;
};

/**
 * Get all performance measurements - memoizes the result by default
 */
let cachedMeasurements: Record<string, number> | null = null;
let lastMeasurementTime = 0;

export const getPerformanceMeasurements = (): Record<string, number> => {
  const now = Date.now();
  
  // Return cached results if less than 1 second has passed since the last calculation
  if (cachedMeasurements !== null && now - lastMeasurementTime < 1000) {
    return cachedMeasurements;
  }
  
  const result: Record<string, number> = {};
  
  Object.entries(performanceMeasurements).forEach(([key, measurement]) => {
    if (measurement.end !== undefined) {
      result[key] = measurement.end - measurement.start;
    }
  });
  
  // Update cache
  cachedMeasurements = result;
  lastMeasurementTime = now;
  
  return result;
};

/**
 * Get anomaly thresholds for all operations
 */
export const getAnomalyThresholds = (): Record<string, { mean: number; stdDev: number }> => {
  return { ...anomalyThresholds };
};

/**
 * Get performance history for a specific operation
 */
export const getPerformanceHistory = (operationName?: string): Record<string, number[]> => {
  if (operationName) {
    return { [operationName]: [...(performanceHistory[operationName] || [])] };
  }
  
  // Create a deep copy to prevent external modification
  const historyCopy: Record<string, number[]> = {};
  
  Object.entries(performanceHistory).forEach(([key, values]) => {
    historyCopy[key] = [...values];
  });
  
  return historyCopy;
};

/**
 * Initialize performance monitoring with optimizations
 */
export const initPerformanceMonitoring = (): void => {
  startTiming('appInitialization');
  
  // Record page load timing
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      endTiming('appInitialization');
      
      // Add navigation timing if available
      if (performance && performance.timing) {
        try {
          const navigationTiming = performance.timing;
          const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Page load time: ${loadTime}ms`);
          }
        } catch (e) {
          // Silent error - timing API might not be available
        }
      }
    });
  }
};

/**
 * Reset performance history and calculated thresholds
 */
export const resetPerformanceHistory = (operationName?: string): void => {
  if (operationName) {
    delete performanceHistory[operationName];
    delete anomalyThresholds[operationName];
  } else {
    // Clear all history
    Object.keys(performanceHistory).forEach(key => {
      delete performanceHistory[key];
      delete anomalyThresholds[key];
    });
  }
  
  // Clear cache
  cachedMeasurements = null;
  lastMeasurementTime = 0;
};

import { toast } from "sonner";
import { analyticsService } from "@/services/analyticsService";

/**
 * Shows a performance toast for a specific page or operation
 */
export const showPerformanceToast = (pageName: string) => {
  // End timing for page load
  const loadTime = endTiming(`page-load-${pageName}`);
  
  // Track the performance metric
  if (loadTime) {
    analyticsService.trackEvent({
      category: 'Performance',
      subcategory: 'Load',
      action: 'PageLoad',
      label: pageName,
      value: Math.round(loadTime)
    });
    
    // Show toast for slow page loads (> 500ms)
    if (loadTime > 500) {
      toast.info(
        `${pageName} loaded in ${(loadTime / 1000).toFixed(1)}s`, 
        { duration: 3000, position: 'bottom-right' }
      );
    }
  }
  
  // Start timing for page interactions
  startTiming(`page-interact-${pageName}`);
};

/**
 * Measures and reports navigation performance
 */
export const measureRouteChange = (from: string, to: string) => {
  // End timing for previous page
  const interactionTime = endTiming(`page-interact-${from}`);
  
  // Track page interaction time
  if (interactionTime) {
    analyticsService.trackEvent({
      category: 'Performance',
      subcategory: 'Interaction',
      action: 'PageInteraction',
      label: from,
      value: Math.round(interactionTime)
    });
  }
  
  // Track navigation event
  analyticsService.trackEvent({
    category: 'Navigation',
    subcategory: 'Navigation',
    action: 'RouteChange',
    label: `${from} → ${to}`
  });
  
  // Start timing for next page load
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
  
  // Return cleanup function
  return () => {
    const loadTime = endTiming(`document-load-${documentId}`);
    
    if (loadTime) {
      // Track document load performance
      analyticsService.trackEvent({
        category: 'Document',
        subcategory: 'Load',
        action: 'DocumentLoad',
        label: documentId,
        value: Math.round(loadTime)
      });
      
      // Log warning for slow document loads
      if (loadTime > 1000) {
        console.warn(`Document ${documentId} took ${(loadTime / 1000).toFixed(1)}s to load`);
        
        // Track slow document load as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowDocumentLoad',
          label: documentId,
          value: Math.round(loadTime),
          metadata: {
            threshold: 1000,
            exceedAmount: loadTime - 1000
          }
        });
      }
    }
  };
};

/**
 * Measures API call performance
 */
export const measureApiCall = (apiName: string) => {
  startTiming(`api-call-${apiName}`);
  
  return () => {
    const apiTime = endTiming(`api-call-${apiName}`);
    
    if (apiTime) {
      // Track API call performance
      analyticsService.trackEvent({
        category: 'API',
        subcategory: 'Performance',
        action: 'ApiCall',
        label: apiName,
        value: Math.round(apiTime)
      });
      
      // Log warning for slow API calls
      if (apiTime > 500) {
        console.warn(`API call to ${apiName} took ${apiTime.toFixed(1)}ms`);
        
        // Track slow API call as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowApiCall',
          label: apiName,
          value: Math.round(apiTime),
          metadata: {
            threshold: 500,
            exceedAmount: apiTime - 500
          }
        });
      }
    }
  };
};

/**
 * Measures component render performance
 */
export const measureComponentRender = (componentName: string) => {
  startTiming(`component-render-${componentName}`);
  
  return () => {
    const renderTime = endTiming(`component-render-${componentName}`);
    
    if (renderTime) {
      // Track component render performance
      analyticsService.trackEvent({
        category: 'Performance',
        subcategory: 'Render',
        action: 'ComponentRender',
        label: componentName,
        value: Math.round(renderTime)
      });
      
      // Log warning for slow component renders
      if (renderTime > 100) {
        console.warn(`Component ${componentName} took ${renderTime.toFixed(1)}ms to render`);
        
        // Track slow component render as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowComponentRender',
          label: componentName,
          value: Math.round(renderTime),
          metadata: {
            threshold: 100,
            exceedAmount: renderTime - 100
          }
        });
      }
    }
  };
};
