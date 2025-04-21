
/**
 * Utility for detecting document types
 */

import { DocumentDetails } from "../types";

/**
 * Check if a document is a Form 47 (Consumer Proposal)
 */
export const isDocumentForm47 = (document: DocumentDetails): boolean => {
  // Check if document title contains form 47 or consumer proposal
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal')) {
    return true;
  }

  // Check if document ID is form47
  if (document.id === 'form47') {
    return true;
  }
  
  // Check for form type in analysis extracted_info
  const formType = document.analysis?.[0]?.content?.extracted_info?.formType;
  if (formType?.toLowerCase().includes('consumer') || 
      formType?.toLowerCase().includes('proposal') ||
      formType?.toLowerCase() === 'form-47') {
    return true;
  }
  
  // Check for form number in extracted info
  const formNumber = document.analysis?.[0]?.content?.extracted_info?.formNumber;
  if (formNumber === '47') {
    return true;
  }

  return false;
};
