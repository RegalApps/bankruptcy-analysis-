
import { DocumentRecord } from "../types";

/**
 * Enhanced detection of Form 76 documents with multiple fallback methods
 * Uses multiple methods to increase detection reliability
 */
export const isForm76 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  console.log("Checking if document is Form 76...");
  
  // Create a clean version of the text for better matching
  const cleanText = documentText.toLowerCase().replace(/\s+/g, ' ');
  
  // Method 1: Check the document title
  const titleIndicatesForm76 = Boolean(
    documentRecord.title?.toLowerCase().includes('form 76') ||
    documentRecord.title?.toLowerCase().includes('f76') ||
    documentRecord.title?.toLowerCase().includes('form76') ||
    documentRecord.title?.toLowerCase().includes('statement of affairs')
  );
  
  // Method 2: Check document type if available
  const metadataIndicatesForm76 = Boolean(
    documentRecord.metadata?.formType === 'form-76' ||
    documentRecord.metadata?.formType === 'form76' ||
    documentRecord.metadata?.formNumber === '76'
  );
  
  // Method 3: Check text content with multiple patterns
  const textPatterns = [
    /\bf(?:orm)?\s*76\b/i,
    /\bstatement\s+of\s+affairs\b/i,
    /\bassets\s+and\s+liabilities\b/i,
    /\baffidavit\s+of\s+the\s+bankrupt\b/i,
    /\bpersonal\s+information\s+of\s+bankrupt\b/i,
    /\bbankruptcy\s+and\s+insolvency\s+act\b/i
  ];
  
  const textIndicatesForm76 = textPatterns.some(pattern => pattern.test(cleanText));
  
  // Method 4: Check for typical Form 76 sections
  const sectionIndicators = [
    'PART A – ASSETS',
    'PART B – LIABILITIES',
    'PART C – INCOME',
    'PART D – MONTHLY EXPENSES',
    'ASSETS AND LIABILITIES',
    'STATEMENT OF AFFAIRS'
  ];
  
  const hasForm76Sections = sectionIndicators.some(section => 
    cleanText.includes(section.toLowerCase())
  );
  
  // Method 5: Check for Form 76 structural indicators
  const structuralIndicators = [
    'secured creditors',
    'unsecured creditors', 
    'preferred creditors',
    'real property',
    'personal property',
    'monthly income',
    'monthly expenses'
  ];
  
  const hasStructuralIndicators = structuralIndicators.some(indicator => 
    cleanText.includes(indicator.toLowerCase())
  );
  
  // Log all detection results for debugging
  console.log({
    titleIndicatesForm76,
    metadataIndicatesForm76,
    textIndicatesForm76,
    hasForm76Sections,
    hasStructuralIndicators
  });
  
  // Document is Form 76 if any method indicates it is
  const result = titleIndicatesForm76 || 
                metadataIndicatesForm76 || 
                textIndicatesForm76 || 
                hasForm76Sections ||
                hasStructuralIndicators;
  
  console.log(`Form 76 detection result: ${result}`);
  return result;
};
