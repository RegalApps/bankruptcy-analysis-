
import { DocumentDetails } from "@/components/DocumentViewer/types";

/**
 * Check if document is of a specific type based on filename or metadata
 */
export const isDocumentType = (
  document: DocumentDetails | null,
  type: string
): boolean => {
  if (!document) return false;
  
  // Check filename extension
  const filename = document.filename || '';
  if (filename.toLowerCase().endsWith(`.${type.toLowerCase()}`)) {
    return true;
  }
  
  // Check content type if available
  const contentType = document.contentType || '';
  if (contentType.includes(type)) {
    return true;
  }
  
  // Check document metadata if available
  if (document.metadata && typeof document.metadata === 'object') {
    const fileType = (document.metadata as any).fileType || '';
    if (fileType.toLowerCase() === type.toLowerCase()) {
      return true;
    }
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
 * Get file extension from document
 */
export const getFileExtension = (document: DocumentDetails | null): string => {
  if (!document || !document.filename) return '';
  
  const parts = document.filename.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  
  return '';
};
