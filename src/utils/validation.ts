/**
 * Checks if a string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Checks if a date is within a specified timeframe
 * Optimized version with date caching
 */
export const isWithinTimeframe = (() => {
  // Cache for timeframe start dates to avoid recalculating
  const timeframeCache = new Map<string, Date>();
  
  return (date: Date, timeframe: string): boolean => {
    if (timeframe === 'all') return true;
    
    // Use cached start date for this timeframe if available
    const now = new Date();
    const cacheKey = `${timeframe}-${now.toDateString()}`;
    
    if (!timeframeCache.has(cacheKey)) {
      const startDate = new Date();
      if (timeframe === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (timeframe === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      // Cache the start date - will be valid for today
      timeframeCache.set(cacheKey, startDate);
      
      // Clean up old cache entries (keep only current timeframes)
      if (timeframeCache.size > 10) {
        const oldestKey = timeframeCache.keys().next().value;
        timeframeCache.delete(oldestKey);
      }
    }
    
    const startDate = timeframeCache.get(cacheKey)!;
    return date >= startDate && date <= now;
  };
})();
