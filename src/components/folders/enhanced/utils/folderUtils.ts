
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";

/**
 * Checks if a folder contains Form 47 documents
 */
export function hasForm47Documents(folder: FolderStructure, documents: Document[]): boolean {
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  return folderDocuments.some(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  );
}

/**
 * Gets the count of Form 47 documents in a folder
 */
export function getForm47DocumentCount(folder: FolderStructure, documents: Document[]): number {
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  return folderDocuments.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.title?.toLowerCase().includes('form 47') ||
    doc.title?.toLowerCase().includes('consumer proposal')
  ).length;
}

/**
 * Gets the count of form documents in a folder
 */
export function getFormDocumentCount(folder: FolderStructure, documents: Document[]): number {
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  return folderDocuments.filter(doc => 
    doc.metadata?.formType === 'form-47' || 
    doc.metadata?.formType === 'form-76' || 
    doc.title?.toLowerCase().includes('form 47') || 
    doc.title?.toLowerCase().includes('form 76') ||
    doc.title?.toLowerCase().includes('consumer proposal') || 
    doc.title?.toLowerCase().includes('statement of affairs')
  ).length;
}

/**
 * Generates a tooltip message for a folder based on its content
 */
export function getFolderTooltip(folder: FolderStructure, documents: Document[]): string {
  const folderDocuments = documents.filter(
    doc => !doc.is_folder && doc.parent_folder_id === folder.id
  );
  
  const form47Count = getForm47DocumentCount(folder, documents);
  const formDocCount = getFormDocumentCount(folder, documents);
  
  if (form47Count > 0) {
    return `Contains ${form47Count} Form 47 document${form47Count > 1 ? 's' : ''}`;
  }
  
  if (formDocCount > 0) {
    return `Contains ${formDocCount} form document${formDocCount > 1 ? 's' : ''}`;
  }
  
  if (folderDocuments.length > 0) {
    return `Contains ${folderDocuments.length} document${folderDocuments.length > 1 ? 's' : ''}`;
  }
  
  return "Empty folder";
}

/**
 * Checks if a folder is locked
 */
export function isFolderLocked(folder: FolderStructure): boolean {
  return Boolean(folder.metadata?.locked || folder.metadata?.system);
}
