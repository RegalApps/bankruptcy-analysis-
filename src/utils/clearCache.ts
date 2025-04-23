import logger from './logger';

/**
 * Clears all application cache including document storage
 * This ensures a clean state when restarting the application
 */
export const clearCache = (): void => {
  try {
    // Clear document storage from memory
    window.localStorage.removeItem('documents');
    
    // Clear any other application cache as needed
    // Add more items to clear here if needed
    
    logger.info('Application cache cleared successfully');
  } catch (error) {
    logger.error('Error clearing application cache:', error);
  }
};

/**
 * Clears only document-related cache
 * This is useful when you want to clear only document storage
 */
export const clearDocumentCache = (): void => {
  try {
    // Clear document storage from memory
    window.localStorage.removeItem('documents');
    
    logger.info('Document cache cleared successfully');
  } catch (error) {
    logger.error('Error clearing document cache:', error);
  }
};

export default clearCache;
