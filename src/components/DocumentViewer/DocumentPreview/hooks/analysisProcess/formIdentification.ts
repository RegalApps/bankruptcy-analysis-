
import { DocumentRecord } from "../types";

/**
 * Determines if a document is a Form 76 based on metadata and content
 * Enhanced with additional checks and better pattern matching
 */
export const isForm76 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  const metadata = documentRecord.metadata || {};
  
  // Check in metadata first
  if (metadata.formType === 'form-76' || metadata.formNumber === '76') {
    console.log('Form 76 identified from metadata');
    return true;
  }
  
  // Check in title with more flexible patterns
  const titleLower = documentRecord.title.toLowerCase();
  if (
    titleLower.includes('form 76') || 
    titleLower.includes('form76') || 
    titleLower.includes('f76') || 
    titleLower.match(/\bf\s*76\b/) || // match f 76 with potential spaces
    titleLower.match(/\bform\s*76\b/) // match form 76 with potential spaces
  ) {
    console.log('Form 76 identified from title');
    return true;
  }
  
  // If we have document text, check there too with more flexible patterns
  if (documentText) {
    const textLower = documentText.toLowerCase();
    if (
      textLower.includes('form 76') || 
      textLower.includes('form76') || 
      textLower.includes('f76') ||
      textLower.match(/\bf\s*76\b/) || // match f 76 with potential spaces
      textLower.match(/\bform\s*76\b/) || // match form 76 with potential spaces
      textLower.includes('statement of affairs') || 
      (textLower.includes('monthly income') && textLower.includes('bankruptcy'))
    ) {
      console.log('Form 76 identified from document text');
      return true;
    }
  }
  
  // Additional check for filename pattern if available in metadata
  if (metadata.original_filename) {
    const filenameLower = String(metadata.original_filename).toLowerCase();
    if (
      filenameLower.includes('form76') || 
      filenameLower.includes('form 76') || 
      filenameLower.includes('f76')
    ) {
      console.log('Form 76 identified from original filename');
      return true;
    }
  }
  
  console.log('Not identified as Form 76');
  return false;
};
