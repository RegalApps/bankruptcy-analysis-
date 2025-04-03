
import { DocumentDetails } from "../types";

/**
 * Checks if a document is a Form 47 (Consumer Proposal) document
 */
export const isDocumentForm47 = (document: DocumentDetails): boolean => {
  // Check from metadata
  const metadata = document.metadata || {};
  if (metadata.formType === 'form-47' || 
      metadata.formNumber === '47' || 
      metadata.type === 'consumer-proposal') {
    return true;
  }
  
  // Check from document title
  const title = document.title.toLowerCase();
  if (title.includes('form 47') || 
      title.includes('consumer proposal') ||
      title.includes('form47')) {
    return true;
  }
  
  // Check from document type
  if (document.type && 
      (document.type.toLowerCase().includes('consumer proposal') ||
       document.type.toLowerCase().includes('form 47'))) {
    return true;
  }
  
  return false;
};

/**
 * Gets the appropriate document icon based on file type
 */
export const getDocumentTypeIcon = (document: DocumentDetails): string => {
  if (isDocumentForm47(document)) {
    return 'form47';
  }
  
  // Check file extension from storage path
  const storagePath = document.storage_path || '';
  const fileExtension = storagePath.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'excel';
    case 'ppt':
    case 'pptx':
      return 'powerpoint';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image';
    default:
      return 'document';
  }
};

/**
 * Determines if a document is an image file
 */
export const isImageDocument = (document: DocumentDetails): boolean => {
  const storagePath = document.storage_path || '';
  const fileExtension = storagePath.split('.').pop()?.toLowerCase();
  
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension || '');
};

/**
 * Determines if a document is a PDF file
 */
export const isPdfDocument = (document: DocumentDetails): boolean => {
  const storagePath = document.storage_path || '';
  const fileExtension = storagePath.split('.').pop()?.toLowerCase();
  
  return fileExtension === 'pdf';
};

/**
 * Determines if a document is an Excel/spreadsheet file
 */
export const isSpreadsheetDocument = (document: DocumentDetails): boolean => {
  const storagePath = document.storage_path || '';
  const fileExtension = storagePath.split('.').pop()?.toLowerCase();
  
  return ['xls', 'xlsx', 'csv'].includes(fileExtension || '');
};
