
import { DocumentRecord } from '../types';

/**
 * Checks if a document is Form 31 (Proof of Claim)
 */
export const isForm31 = (document: DocumentRecord, documentText?: string): boolean => {
  // Check document title
  const titleHasForm31 = document.title?.toLowerCase().includes('form 31') || 
                         document.title?.toLowerCase().includes('proof of claim');
                         
  // Check document type from metadata
  const metadataHasForm31 = document.metadata?.formType === 'form-31' || 
                           document.metadata?.formNumber === '31';
  
  // Check document text content if available
  const textHasForm31 = documentText ? 
                       (documentText.toLowerCase().includes('proof of claim') || 
                        documentText.toLowerCase().includes('form 31')) : 
                       false;
                       
  return titleHasForm31 || metadataHasForm31 || textHasForm31;
};

/**
 * Detects form type from document
 */
export const detectFormType = (document: DocumentRecord, documentText?: string): string => {
  if (isForm31(document, documentText)) {
    return 'form-31';
  }
  
  // Check for Form 47 (Consumer Proposal)
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal') ||
      document.metadata?.formType === 'form-47' ||
      document.metadata?.formNumber === '47' ||
      (documentText && (documentText.toLowerCase().includes('consumer proposal') ||
                       documentText.toLowerCase().includes('form 47')))) {
    return 'form-47';
  }
  
  // Check for Form 76 (Assignment for Benefit of Creditors)
  if (document.title?.toLowerCase().includes('form 76') || 
      document.title?.toLowerCase().includes('assignment') ||
      document.metadata?.formType === 'form-76' ||
      document.metadata?.formNumber === '76' ||
      (documentText && (documentText.toLowerCase().includes('assignment') ||
                       documentText.toLowerCase().includes('form 76')))) {
    return 'form-76';
  }
  
  return '';
};
