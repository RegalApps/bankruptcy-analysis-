/**
 * Formatters for document details
 */

/**
 * Format a field label from camelCase to Title Case with spaces
 * @param key The camelCase key to format
 * @returns Formatted label in Title Case
 */
export const formatFieldLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .trim();
};
