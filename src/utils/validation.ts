
/**
 * Checks if a string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Checks if a date is within a specified timeframe
 */
export const isWithinTimeframe = (date: Date, timeframe: string): boolean => {
  const now = new Date();
  if (timeframe === 'all') return true;
  
  const startDate = new Date();
  if (timeframe === 'today') {
    startDate.setHours(0, 0, 0, 0);
  } else if (timeframe === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  }
  
  return date >= startDate && date <= now;
};
