/**
 * Storage Utility
 * 
 * Provides standardized methods for interacting with localStorage
 * with proper error handling and type safety.
 */

import logger from './logger';

/**
 * Retrieves and parses a JSON value from localStorage
 * 
 * @param key The localStorage key
 * @returns The parsed value or null if not found or invalid
 */
export const getJson = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Error retrieving item from localStorage [${key}]:`, error);
    return null;
  }
};

/**
 * Stores a value in localStorage as JSON
 * 
 * @param key The localStorage key
 * @param value The value to store
 * @returns true if successful, false otherwise
 */
export const setJson = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Error storing item in localStorage [${key}]:`, error);
    return false;
  }
};

/**
 * Removes an item from localStorage
 * 
 * @param key The localStorage key to remove
 */
export const removeItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error(`Error removing item from localStorage [${key}]:`, error);
    return false;
  }
};

/**
 * Checks if a key exists in localStorage
 * 
 * @param key The localStorage key to check
 */
export const hasItem = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    logger.error(`Error checking item in localStorage [${key}]:`, error);
    return false;
  }
};
