import { toast } from "sonner";
import { analyticsService } from "@/services/analyticsService";

const timingStorage: Record<string, number> = {};
const performanceMetrics: Record<string, number> = {};
const performanceHistory: Record<string, number[]> = {};
const anomalyThresholds: Record<string, { mean: number; stdDev: number }> = {};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  console.log("Performance monitoring initialized");
  // Clear existing metrics
  Object.keys(performanceMetrics).forEach(key => delete performanceMetrics[key]);
  
  // Set up performance observer if available
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      // Track page navigation timing
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            performanceMetrics['page-load'] = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
            updatePerformanceHistory('page-load', performanceMetrics['page-load']);
            console.log(`Page loaded in ${Math.round(performanceMetrics['page-load'])}ms`);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Track resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            // Only track significant resources like JS and CSS
            const resourceEntry = entry as PerformanceResourceTiming;
            const resourceType = resourceEntry.initiatorType;
            if (['script', 'link', 'fetch', 'xmlhttprequest'].includes(resourceType)) {
              const key = `resource-${resourceType}`;
              if (!performanceMetrics[key]) {
                performanceMetrics[key] = 0;
              }
              performanceMetrics[key] += resourceEntry.duration;
              updatePerformanceHistory(key, resourceEntry.duration);
            }
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error("Error setting up performance observers:", error);
    }
  }
};

/**
 * Measure route change performance
 */
export const measureRouteChange = (from: string, to: string): void => {
  const routeChangeKey = `route-${from}-to-${to}`;
  startTiming(routeChangeKey);
  
  // Use setTimeout to measure after the route has rendered
  setTimeout(() => {
    const duration = endTiming(routeChangeKey);
    if (duration) {
      updatePerformanceHistory(routeChangeKey, duration);
      
      // Report to analytics for significant delays
      if (duration > 500) {
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Navigation',
          action: 'SlowRouteChange',
          label: `${from} to ${to}`,
          value: Math.round(duration)
        });
      }
    }
  }, 100);
};

/**
 * Starts timing an operation for performance monitoring
 */
export const startTiming = (label: string): void => {
  timingStorage[label] = performance.now();
  
  // Log to console for debugging
  console.log(`⏱️ Started timing: ${label}`);
};

/**
 * Ends timing an operation and returns the elapsed time in milliseconds
 */
export const endTiming = (label: string): number | null => {
  if (!timingStorage[label]) {
    console.warn(`No timing started for: ${label}`);
    return null;
  }
  
  const startTime = timingStorage[label];
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Store the metric
  performanceMetrics[label] = duration;
  updatePerformanceHistory(label, duration);
  
  // Remove from storage
  delete timingStorage[label];
  
  // Log to console
  console.log(`⏱️ ${label}: ${Math.round(duration)}ms`);
  
  // Show toast for particularly slow operations (over 3 seconds)
  if (duration > 3000) {
    toast.info(`Operation took ${Math.round(duration / 1000)}s`, {
      description: `${label} completed slowly, check performance`,
      duration: 3000,
    });
  }
  
  return duration;
};

/**
 * Measures the execution time of a function
 */
export const measureTime = async <T>(
  fn: () => Promise<T>, 
  label: string
): Promise<T> => {
  startTiming(label);
  try {
    const result = await fn();
    endTiming(label);
    return result;
  } catch (error) {
    endTiming(label);
    throw error;
  }
};

/**
 * Update performance history for anomaly detection
 */
const updatePerformanceHistory = (key: string, value: number): void => {
  if (!performanceHistory[key]) {
    performanceHistory[key] = [];
  }
  
  // Keep last 20 measurements for each metric
  performanceHistory[key].push(value);
  if (performanceHistory[key].length > 20) {
    performanceHistory[key].shift();
  }
  
  // Calculate mean and standard deviation for anomaly detection
  if (performanceHistory[key].length >= 5) {
    calculateAnomalyThresholds(key);
  }
};

/**
 * Calculate anomaly detection thresholds
 */
const calculateAnomalyThresholds = (key: string): void => {
  const values = performanceHistory[key];
  
  // Calculate mean
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  
  // Calculate standard deviation
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  anomalyThresholds[key] = { mean, stdDev };
};

/**
 * Get all performance measurements
 */
export const getPerformanceMeasurements = (): Record<string, number> => {
  return { ...performanceMetrics };
};

/**
 * Get anomaly detection thresholds
 */
export const getAnomalyThresholds = (): Record<string, { mean: number; stdDev: number }> => {
  return { ...anomalyThresholds };
};

/**
 * Get performance history data
 */
export const getPerformanceHistory = (): Record<string, number[]> => {
  return { ...performanceHistory };
};

/**
 * Reset performance history and measurements
 */
export const resetPerformanceHistory = (): void => {
  Object.keys(performanceHistory).forEach(key => {
    performanceHistory[key] = [];
  });
  
  Object.keys(performanceMetrics).forEach(key => {
    delete performanceMetrics[key];
  });
  
  Object.keys(anomalyThresholds).forEach(key => {
    delete anomalyThresholds[key];
  });
  
  console.log("Performance history and metrics have been reset");
};
