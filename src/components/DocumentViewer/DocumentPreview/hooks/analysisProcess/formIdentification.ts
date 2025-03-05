
import { DocumentRecord } from "../types";

/**
 * Determines if a document is a Form 76 based on metadata and content
 */
export const isForm76 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  const metadata = documentRecord.metadata || {};
  
  return (
    metadata.formType === 'form-76' ||
    documentRecord.title.toLowerCase().includes('form 76') || 
    documentRecord.title.toLowerCase().includes('f76') ||
    documentText.toLowerCase().includes('form 76') ||
    documentText.toLowerCase().includes('f76') ||
    documentText.toLowerCase().includes('statement of affairs') ||
    documentText.toLowerCase().includes('monthly income')
  );
};
