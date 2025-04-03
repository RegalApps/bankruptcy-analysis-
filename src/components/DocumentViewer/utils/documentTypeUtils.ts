
import { DocumentDetails } from "@/components/DocumentViewer/types";

/**
 * Check if document is of a specific type based on filename or metadata
 */
export const isDocumentType = (
  document: DocumentDetails | null,
  type: string
): boolean => {
  if (!document) return false;
  
  // Check title for file extension
  const title = document.title || '';
  if (title.toLowerCase().endsWith(`.${type.toLowerCase()}`)) {
    return true;
  }
  
  // Check storage_path for file extension
  const storagePath = document.storage_path || '';
  if (storagePath.toLowerCase().endsWith(`.${type.toLowerCase()}`)) {
    return true;
  }
  
  // Check type if available
  const documentType = document.type || '';
  if (documentType.toLowerCase().includes(type.toLowerCase())) {
    return true;
  }
  
  return false;
};

/**
 * Check if document is a PDF
 */
export const isPdf = (document: DocumentDetails | null): boolean => {
  return isDocumentType(document, 'pdf');
};

/**
 * Check if document is an Excel file
 */
export const isExcel = (document: DocumentDetails | null): boolean => {
  return (
    isDocumentType(document, 'xlsx') || 
    isDocumentType(document, 'xls') || 
    isDocumentType(document, 'csv')
  );
};

/**
 * Check if document is an image
 */
export const isImage = (document: DocumentDetails | null): boolean => {
  return (
    isDocumentType(document, 'jpg') || 
    isDocumentType(document, 'jpeg') || 
    isDocumentType(document, 'png') || 
    isDocumentType(document, 'gif') || 
    isDocumentType(document, 'webp')
  );
};

/**
 * Check if document is a Form 47 (Consumer Proposal)
 */
export const isDocumentForm47 = (document: DocumentDetails | null): boolean => {
  if (!document) return false;
  
  // Check document title
  const title = document.title?.toLowerCase() || '';
  if (title.includes('form 47') || title.includes('form47') || title.includes('consumer proposal')) {
    return true;
  }
  
  // Check document type
  const documentType = document.type?.toLowerCase() || '';
  if (documentType.includes('consumer proposal') || documentType.includes('form 47') || documentType.includes('form47')) {
    return true;
  }
  
  // Check if analysis has form number data
  if (document.analysis && document.analysis.length > 0) {
    const extractedInfo = document.analysis[0]?.content?.extracted_info;
    if (extractedInfo?.formNumber === '47' || 
        extractedInfo?.formType?.toLowerCase()?.includes('form-47') || 
        extractedInfo?.formType?.toLowerCase()?.includes('consumer proposal')) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get file extension from document
 */
export const getFileExtension = (document: DocumentDetails | null): string => {
  if (!document) return '';
  
  // Try to get extension from storage_path
  const storagePath = document.storage_path || '';
  const pathParts = storagePath.split('.');
  if (pathParts.length > 1) {
    return pathParts[pathParts.length - 1].toLowerCase();
  }
  
  // If no extension in path, try to get from title
  const title = document.title || '';
  const titleParts = title.split('.');
  if (titleParts.length > 1) {
    return titleParts[titleParts.length - 1].toLowerCase();
  }
  
  return '';
};
