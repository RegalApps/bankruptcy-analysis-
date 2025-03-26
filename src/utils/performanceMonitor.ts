
/**
 * Simple performance monitoring utility
 */

// Store for performance measurements
const performanceMeasurements: Record<string, { start: number; end?: number }> = {};

// Store historical data for anomaly detection
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
 * @param logResult Whether to log the result (default: true)
 * @returns The duration in milliseconds or undefined if no timing was started
 */
export const endTiming = (operationName: string, logResult: boolean = true): number | undefined => {
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
  
  // Log the performance measurement if requested
  if (logResult) {
    console.log(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
  }
  
  // Add to history for anomaly detection
  if (!performanceHistory[operationName]) {
    performanceHistory[operationName] = [];
  }
  
  performanceHistory[operationName].push(duration);
  
  // After collecting enough samples, calculate anomaly thresholds
  if (performanceHistory[operationName].length >= 10) {
    updateAnomalyThresholds(operationName);
  }
  
  // Check if this is an anomaly
  const isAnomaly = checkForAnomaly(operationName, duration);
  if (isAnomaly) {
    console.warn(`ANOMALY DETECTED: ${operationName} (${duration.toFixed(2)}ms) is significantly slower than usual`);
  }
  
  return duration;
};

/**
 * Update anomaly detection thresholds based on historical data
 */
const updateAnomalyThresholds = (operationName: string): void => {
  const history = performanceHistory[operationName];
  if (history.length < 10) return; // Need enough samples
  
  // Calculate mean
  const sum = history.reduce((acc, val) => acc + val, 0);
  const mean = sum / history.length;
  
  // Calculate standard deviation
  const squaredDiffs = history.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / history.length;
  const stdDev = Math.sqrt(avgSquaredDiff);
  
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
    return { [operationName]: performanceHistory[operationName] || [] };
  }
  return { ...performanceHistory };
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
 * Reset performance history and calculated thresholds
 */
export const resetPerformanceHistory = (operationName?: string): void => {
  if (operationName) {
    delete performanceHistory[operationName];
    delete anomalyThresholds[operationName];
  } else {
    Object.keys(performanceHistory).forEach(key => {
      delete performanceHistory[key];
      delete anomalyThresholds[key];
    });
  }
};

// Remove existing showPerformanceToast - it's now in performance.ts
