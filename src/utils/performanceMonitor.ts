
/**
 * Simple performance monitoring utility
 */

// Store for performance measurements
const performanceMeasurements: Record<string, { start: number; end?: number }> = {};

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
 */
export const endTiming = (operationName: string): number | undefined => {
  const measurement = performanceMeasurements[operationName];
  if (!measurement) {
    console.warn(`No timing started for operation: ${operationName}`);
    return undefined;
  }

  if (measurement.end !== undefined) {
    console.warn(`Timing already ended for operation: ${operationName}`);
    return measurement.end - measurement.start;
  }

  measurement.end = performance.now();
  const duration = measurement.end - measurement.start;
  
  // Log the performance measurement
  console.log(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
  
  return duration;
};

/**
 * Get all performance measurements
 */
export const getPerformanceMeasurements = (): Record<string, number> => {
  const result: Record<string, number> = {};
  
  Object.entries(performanceMeasurements).forEach(([key, measurement]) => {
    if (measurement.end !== undefined) {
      result[key] = measurement.end - measurement.start;
    }
  });
  
  return result;
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = (): void => {
  startTiming('appInitialization');
  
  // Record page load timing
  window.addEventListener('load', () => {
    endTiming('appInitialization');
    
    // Add navigation timing if available
    if (performance && performance.timing) {
      const navigationTiming = performance.timing;
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    }
  });
  
  console.log('Performance monitoring initialized');
};

/**
 * Show a performance toast notification
 */
export const showPerformanceToast = (component: string): void => {
  const loadTime = Math.floor(Math.random() * 200) + 50; // Mock load time between 50-250ms
  console.log(`${component} loaded in ${loadTime}ms`);
  
  // In a real app, you would use actual measured performance data
  // and display this using your toast system
};
