
/**
 * Performance monitoring utility
 * Helps track, optimize and debug performance issues
 */

// Store timing marks for different parts of the application
const markTimings: Record<string, number> = {};

/**
 * Start timing a specific operation
 * @param operationName Unique name for the operation being timed
 */
export const startTiming = (operationName: string): void => {
  markTimings[operationName] = performance.now();
};

/**
 * End timing for an operation and log the duration
 * @param operationName Name of the operation to stop timing (should match startTiming call)
 * @param logResults Whether to log the results to console (default: true)
 * @returns Duration in milliseconds
 */
export const endTiming = (operationName: string, logResults = true): number => {
  if (!markTimings[operationName]) {
    console.warn(`No timing mark found for "${operationName}"`);
    return 0;
  }
  
  const duration = performance.now() - markTimings[operationName];
  
  if (logResults) {
    if (duration > 100) {
      console.warn(`⚠️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`);
    } else {
      console.log(`✅ Operation: ${operationName} completed in ${duration.toFixed(2)}ms`);
    }
  }
  
  // Clean up the timing mark
  delete markTimings[operationName];
  
  return duration;
};

/**
 * Wraps a function with timing measurements
 * @param fn Function to time
 * @param operationName Name for the timing operation
 * @returns The wrapped function with timing
 */
export function withTiming<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    startTiming(operationName);
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.finally(() => {
        endTiming(operationName);
      }) as ReturnType<T>;
    }
    
    endTiming(operationName);
    return result;
  };
}

/**
 * Initialize performance monitoring for the application
 * Call this once at application startup
 */
export const initPerformanceMonitoring = (): void => {
  // Measure navigation/page load performance
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
          load: navigation.loadEventEnd - navigation.startTime,
          firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
        
        console.log('📊 Page Load Performance:', {
          domContentLoaded: `${metrics.domContentLoaded.toFixed(0)}ms`,
          load: `${metrics.load.toFixed(0)}ms`,
          firstPaint: `${metrics.firstPaint.toFixed(0)}ms`,
          firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(0)}ms`,
        });
        
        // Report slow metrics
        if (metrics.load > 1000) {
          console.warn('⚠️ Page load time exceeds 1 second. Consider optimizing.');
        }
      }, 0);
    });
  }
  
  // Monitor long tasks
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log long tasks (tasks that block the main thread)
          console.warn(`🚨 Long task detected: ${entry.duration.toFixed(0)}ms`, entry);
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('Performance observer not supported', e);
    }
  }
};
