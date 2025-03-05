
import { DocumentRecord } from "../types";

/**
 * Enhanced detection of Form 76 documents
 * Uses multiple methods to increase detection reliability
 */
export const isForm76 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  console.log("Checking if document is Form 76...");
  
  // Method 1: Check the document title
  const titleIndicatesForm76 = 
    documentRecord.title?.toLowerCase().includes('form 76') ||
    documentRecord.title?.toLowerCase().includes('f76') ||
    documentRecord.title?.toLowerCase().includes('statement of affairs');
  
  // Method 2: Check document type if available
  const metadataIndicatesForm76 = 
    documentRecord.metadata?.formType === 'form-76' ||
    documentRecord.metadata?.formNumber === '76';
  
  // Method 3: Check text content
  // More thorough text analysis with multiple patterns
  const textPatterns = [
    /\bf(?:orm)?\s*76\b/i,
    /\bstatement\s+of\s+affairs\b/i,
    /\bassets\s+and\s+liabilities\b/i,
    /\baffidavit\s+of\s+the\s+bankrupt\b/i
  ];
  
  const textIndicatesForm76 = textPatterns.some(pattern => pattern.test(documentText));
  
  // Method 4: Check for typical Form 76 sections
  const hasForm76Sections = 
    documentText.includes('PART A – ASSETS') ||
    documentText.includes('PART B – LIABILITIES') ||
    documentText.includes('PART C – INCOME') ||
    documentText.includes('PART D – MONTHLY EXPENSES');
  
  // Log all detection results for debugging
  console.log({
    titleIndicatesForm76,
    metadataIndicatesForm76,
    textIndicatesForm76,
    hasForm76Sections
  });
  
  // Document is Form 76 if any method indicates it is
  const result = titleIndicatesForm76 || metadataIndicatesForm76 || textIndicatesForm76 || hasForm76Sections;
  
  console.log(`Form 76 detection result: ${result}`);
  return result;
};
