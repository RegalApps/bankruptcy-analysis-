
/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  return localStorage.getItem('debug-mode') === 'true' || 
         window.location.search.includes('debug=true');
};

/**
 * Starts timing for performance tracking
 */
export const startTiming = (label: string): void => {
  if (isDebugMode()) {
    console.time(`⏱️ ${label}`);
  }
};

/**
 * Ends timing for performance tracking
 */
export const endTiming = (label: string): void => {
  if (isDebugMode()) {
    console.timeEnd(`⏱️ ${label}`);
  }
};

/**
 * Log debug information
 */
export const debugLog = (message: string, data?: any): void => {
  if (isDebugMode()) {
    console.log(`🐞 ${message}`, data);
  }
};

/**
 * Log debug timing information
 */
export const debugTiming = (label: string, time: number): void => {
  if (isDebugMode()) {
    console.log(`⏱️ ${label}: ${Math.round(time)}ms`);
  }
};
