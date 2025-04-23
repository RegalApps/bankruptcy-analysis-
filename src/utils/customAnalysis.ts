/**
 * Custom Analysis Data Store
 * 
 * This utility allows storing and retrieving custom analysis results for specific PDF titles.
 * The analysis data will be displayed in the left-hand menu after document upload.
 */

import logger from './logger';

// Type definitions to match the expected analysis format
export interface CustomAnalysisData {
  extracted_info: {
    clientName: string;
    formNumber: string;
    formType: string;
    documentStatus: string;
    summary: string;
    [key: string]: any;
  };
  risks: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    regulation?: string;
    impact?: string;
    requiredAction?: string;
    solution?: string;
    deadline?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Store for custom analysis data
const customAnalysisStore: Record<string, CustomAnalysisData> = {};

/**
 * Adds or updates a custom analysis for a specific PDF title
 * 
 * @param pdfTitle The title of the PDF to match
 * @param analysisData The custom analysis data to display
 */
export function setCustomAnalysis(pdfTitle: string, analysisData: CustomAnalysisData): void {
  const normalizedTitle = pdfTitle.toLowerCase().trim();
  customAnalysisStore[normalizedTitle] = analysisData;
  logger.info(`Custom analysis registered for PDF: "${pdfTitle}"`);
  
  // Store in localStorage for persistence
  try {
    const stored = localStorage.getItem('custom_analysis_data') || '{}';
    const allData = JSON.parse(stored);
    allData[normalizedTitle] = analysisData;
    localStorage.setItem('custom_analysis_data', JSON.stringify(allData));
  } catch (error) {
    logger.error('Error storing custom analysis in localStorage:', error);
  }
}

/**
 * Gets custom analysis data for a specific PDF title if available
 * 
 * @param pdfTitle The title of the PDF to match
 * @returns The custom analysis data if found, null otherwise
 */
export function getCustomAnalysis(pdfTitle: string): CustomAnalysisData | null {
  const normalizedTitle = pdfTitle.toLowerCase().trim();
  
  // First check if we have it in memory
  if (customAnalysisStore[normalizedTitle]) {
    return customAnalysisStore[normalizedTitle];
  }
  
  // Try loading from localStorage
  try {
    const stored = localStorage.getItem('custom_analysis_data');
    if (stored) {
      const allData = JSON.parse(stored);
      if (allData[normalizedTitle]) {
        // Cache it in memory for faster access
        customAnalysisStore[normalizedTitle] = allData[normalizedTitle];
        return allData[normalizedTitle];
      }
    }
  } catch (error) {
    logger.error('Error retrieving custom analysis from localStorage:', error);
  }
  
  // Check for partial matches (if the PDF title contains any of our keys)
  for (const key in customAnalysisStore) {
    if (normalizedTitle.includes(key)) {
      return customAnalysisStore[key];
    }
  }
  
  // Also try partial matches from localStorage
  try {
    const stored = localStorage.getItem('custom_analysis_data');
    if (stored) {
      const allData = JSON.parse(stored);
      for (const key in allData) {
        if (normalizedTitle.includes(key)) {
          return allData[key];
        }
      }
    }
  } catch (error) {
    // Ignore errors when doing partial matching
  }
  
  return null;
}

/**
 * Clears all custom analysis data
 */
export function clearAllCustomAnalysis(): void {
  Object.keys(customAnalysisStore).forEach(key => {
    delete customAnalysisStore[key];
  });
  
  try {
    localStorage.removeItem('custom_analysis_data');
  } catch (error) {
    logger.error('Error clearing custom analysis data from localStorage:', error);
  }
  
  logger.info('All custom analysis data cleared');
}

export default {
  setCustomAnalysis,
  getCustomAnalysis,
  clearAllCustomAnalysis
};
