
import { Document } from "@/components/DocumentList/types";

/**
 * Checks if a document is a Form 47 or Form 76
 */
export function isForm47or76(doc: Document): boolean {
  // Check document title
  if (doc.title?.toLowerCase().includes('form 47') || 
      doc.title?.toLowerCase().includes('form 76') ||
      doc.title?.toLowerCase().includes('consumer proposal') ||
      doc.title?.toLowerCase().includes('statement of affairs')) {
    return true;
  }
  
  // Check metadata
  if (doc.metadata?.formType === 'form-47' || 
      doc.metadata?.formType === 'form-76') {
    return true;
  }
  
  return false;
}

/**
 * Checks if a document is locked
 */
export function isDocumentLocked(document: Document): boolean {
  return document.metadata?.locked || 
         document.metadata?.signed || 
         document.title.toLowerCase().includes('signed') || 
         document.metadata?.submitted || 
         document.metadata?.approved;
}
