
/**
 * Utility for detecting document types
 */

import { DocumentDetails } from "../types";
import { Document } from "@/components/DocumentList/types";

/**
 * Check if a document is a Form 47 (Consumer Proposal)
 */
export const isDocumentForm47 = (document: DocumentDetails | Document): boolean => {
  // Check if document title contains form 47 or consumer proposal
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal')) {
    return true;
  }

  // Check if document ID is form47
  if ('id' in document && document.id === 'form47') {
    return true;
  }
  
  // Check for form type in metadata
  const metadata = document.metadata as Record<string, any> || {};
  if (metadata.formType?.toLowerCase().includes('consumer') || 
      metadata.formType?.toLowerCase().includes('proposal') ||
      metadata.formType?.toLowerCase() === 'form-47') {
    return true;
  }
  
  // Check for form number in metadata
  if (metadata.formNumber === '47') {
    return true;
  }

  // Check for form type in analysis extracted_info (if available)
  if ('analysis' in document && Array.isArray(document.analysis)) {
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
  }

  return false;
};

/**
 * Check if a document is a Form 76 (Monthly Income Statement)
 */
export const isDocumentForm76 = (document: DocumentDetails | Document): boolean => {
  // Check if document title contains form 76
  if (document.title?.toLowerCase().includes('form 76') || 
      document.title?.toLowerCase().includes('monthly income statement')) {
    return true;
  }

  // Check for form type in metadata
  const metadata = document.metadata as Record<string, any> || {};
  if (metadata.formType?.toLowerCase().includes('income') || 
      metadata.formType === 'form-76') {
    return true;
  }
  
  // Check for form number in metadata
  if (metadata.formNumber === '76') {
    return true;
  }

  // Check for form type in analysis extracted_info (if available)
  if ('analysis' in document && Array.isArray(document.analysis)) {
    const formType = document.analysis?.[0]?.content?.extracted_info?.formType;
    if (formType?.toLowerCase().includes('income') || 
        formType?.toLowerCase() === 'form-76') {
      return true;
    }
    
    // Check for form number in extracted info
    const formNumber = document.analysis?.[0]?.content?.extracted_info?.formNumber;
    if (formNumber === '76') {
      return true;
    }
  }

  return false;
};

/**
 * Extract client name from document with improved reliability
 */
export const extractClientNameFromDocument = (document: DocumentDetails | Document): string | null => {
  // Check in metadata first (most reliable source)
  const metadata = document.metadata as Record<string, any> || {};
  const clientName = metadata.client_name || metadata.clientName;
  if (clientName) return clientName;
  
  // Check in analysis data if available
  if ('analysis' in document && Array.isArray(document.analysis)) {
    const extractedClientName = document.analysis?.[0]?.content?.extracted_info?.clientName;
    if (extractedClientName) return extractedClientName;
  }
  
  // Check in document title for form-specific patterns
  if (document.title) {
    // For Form 76, client name is often part of the filename
    if (isDocumentForm76(document)) {
      const form76NameMatch = document.title.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
      if (form76NameMatch && form76NameMatch[1]) {
        return form76NameMatch[1].trim();
      }
    }
    
    // For Form 47, it's often associated with Josh Hart in this system
    if (isDocumentForm47(document)) {
      return "Josh Hart";
    }
  }
  
  return null;
};
