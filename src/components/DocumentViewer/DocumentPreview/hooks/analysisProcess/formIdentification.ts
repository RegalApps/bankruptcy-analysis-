
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
 * Checks if a document is Form 76 (Assignment for Benefit of Creditors)
 */
export const isForm76 = (document: DocumentRecord, documentText?: string): boolean => {
  // Check document title
  const titleHasForm76 = document.title?.toLowerCase().includes('form 76') || 
                         document.title?.toLowerCase().includes('assignment');
                         
  // Check document type from metadata
  const metadataHasForm76 = document.metadata?.formType === 'form-76' || 
                           document.metadata?.formNumber === '76';
  
  // Check document text content if available
  const textHasForm76 = documentText ? 
                       (documentText.toLowerCase().includes('assignment') || 
                        documentText.toLowerCase().includes('form 76')) : 
                       false;
                       
  return titleHasForm76 || metadataHasForm76 || textHasForm76;
};

/**
 * Checks if a document is Form 47 (Consumer Proposal)
 */
export const isForm47 = (document: DocumentRecord, documentText?: string): boolean => {
  // Check document title
  const titleHasForm47 = document.title?.toLowerCase().includes('form 47') || 
                         document.title?.toLowerCase().includes('consumer proposal');
                         
  // Check document type from metadata
  const metadataHasForm47 = document.metadata?.formType === 'form-47' || 
                           document.metadata?.formNumber === '47';
  
  // Check document text content if available
  const textHasForm47 = documentText ? 
                       (documentText.toLowerCase().includes('consumer proposal') || 
                        documentText.toLowerCase().includes('form 47')) : 
                       false;
                       
  return titleHasForm47 || metadataHasForm47 || textHasForm47;
};

/**
 * Detects form type from document
 */
export const detectFormType = (document: DocumentRecord, documentText?: string): string => {
  if (isForm31(document, documentText)) {
    return 'form-31';
  }
  
  if (isForm47(document, documentText)) {
    return 'form-47';
  }
  
  if (isForm76(document, documentText)) {
    return 'form-76';
  }
  
  return '';
};
