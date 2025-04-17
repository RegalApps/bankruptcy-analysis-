
/**
 * Centralized utility for document type detection and path handling
 */

import { logDebug } from "@/utils/logger";

/**
 * Determines if a document is a Form 31 (Proof of Claim) based on various indicators
 * 
 * @param metadata Document metadata object
 * @param documentId Document ID
 * @param storagePath Storage path
 * @param title Document title
 * @returns Boolean indicating if document is a Form 31
 */
export const isDocumentForm31 = (
  metadata: any | null,
  documentId: string | null,
  storagePath: string | null,
  title: string | null
): boolean => {
  // Check metadata first (most reliable)
  if (metadata) {
    const formType = metadata.formType || '';
    const formNumber = metadata.formNumber || '';
    
    if (formType.toLowerCase().includes('form-31') || 
        formType.toLowerCase().includes('proof of claim') ||
        formNumber === '31') {
      logDebug('Form 31 detected via metadata');
      return true;
    }
  }
  
  // Check document ID
  if (documentId) {
    if (documentId.toLowerCase().includes('form31') ||
        documentId.toLowerCase().includes('form-31') ||
        documentId.toLowerCase().includes('greentech')) {
      logDebug('Form 31 detected via document ID');
      return true;
    }
  }
  
  // Check storage path
  if (storagePath) {
    if (storagePath.toLowerCase().includes('form31') ||
        storagePath.toLowerCase().includes('form-31') ||
        storagePath.toLowerCase().includes('greentech')) {
      logDebug('Form 31 detected via storage path');
      return true;
    }
  }
  
  // Check title
  if (title) {
    if (title.toLowerCase().includes('form 31') ||
        title.toLowerCase().includes('form31') ||
        title.toLowerCase().includes('proof of claim') ||
        title.toLowerCase().includes('greentech')) {
      logDebug('Form 31 detected via document title');
      return true;
    }
  }
  
  return false;
};

/**
 * Gets the effective storage path for a document, handling special cases for Form 31
 * 
 * @param storagePath Original storage path
 * @param isForm31GreenTech Flag indicating if document is Form 31
 * @param documentId Document ID for fallback logic
 * @returns The effective storage path to use
 */
export const getEffectiveStoragePath = (
  storagePath: string | null,
  isForm31GreenTech: boolean,
  documentId?: string
): string => {
  if (isForm31GreenTech) {
    // For Form 31 documents, use a reliable local path
    return "demo/greentech-form31-proof-of-claim.pdf";
  }
  
  return storagePath || '';
};
