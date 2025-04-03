/**
 * Performance monitoring utilities to track and measure application performance
 */

// Store timing data for different operations
interface TimingData {
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Performance measurement history
interface PerformanceHistory {
  [key: string]: number[];
}

let performanceTimings: Record<string, TimingData> = {};
let performanceHistory: PerformanceHistory = {};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  console.log('Performance monitoring initialized');
  performanceTimings = {};
  performanceHistory = {};
};

/**
 * Start timing for an operation
 */
export const startTiming = (operationName: string): void => {
  performanceTimings[operationName] = {
    startTime: performance.now()
  };
};

/**
 * End timing for an operation and return the duration
 */
export const endTiming = (operationName: string): number | null => {
  const timing = performanceTimings[operationName];
  if (!timing || !timing.startTime) return null;
  
  timing.endTime = performance.now();
  timing.duration = timing.endTime - timing.startTime;
  
  // Record in history for anomaly detection
  if (!performanceHistory[operationName]) {
    performanceHistory[operationName] = [];
  }
  
  performanceHistory[operationName].push(timing.duration);
  
  // Keep only the last 100 measurements
  if (performanceHistory[operationName].length > 100) {
    performanceHistory[operationName].shift();
  }
  
  return timing.duration;
};

/**
 * Reset performance history
 */
export const resetPerformanceHistory = (): void => {
  performanceHistory = {};
};

/**
 * Get the performance history
 */
export const getPerformanceHistory = (): PerformanceHistory => {
  return performanceHistory;
};

/**
 * Measure the duration of a function execution
 */
export const measureTime = <T>(fn: () => T, operationName: string): T => {
  startTiming(operationName);
  const result = fn();
  endTiming(operationName);
  return result;
};

/**
 * Get all performance measurements
 */
export const getPerformanceMeasurements = (): Record<string, TimingData> => {
  return performanceTimings;
};

/**
 * Calculate anomaly thresholds for performance metrics
 */
export const getAnomalyThresholds = (): Record<string, { mean: number; threshold: number }> => {
  const thresholds: Record<string, { mean: number; threshold: number }> = {};
  
  Object.entries(performanceHistory).forEach(([key, values]) => {
    if (values.length < 5) return; // Need enough data points
    
    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Set threshold as mean + 2 standard deviations
    thresholds[key] = {
      mean,
      threshold: mean + (2 * stdDev)
    };
  });
  
  return thresholds;
};

/**
 * Measure route change performance
 */
export const measureRouteChange = (from: string, to: string) => {
  const operationName = `route-change-${from}-to-${to}`;
  startTiming(operationName);
  
  // End timing after a small delay to allow for render
  setTimeout(() => {
    const duration = endTiming(operationName);
    console.log(`Route change from ${from} to ${to} took ${duration?.toFixed(2)}ms`);
  }, 100);
};
