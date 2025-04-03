
import { toast } from "sonner";

const timingStorage: Record<string, number> = {};

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
