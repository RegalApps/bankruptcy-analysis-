
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

// Helper to check if a document is a Form 47
export const isDocumentForm47 = (doc: Document, data?: any): boolean => {
  return doc.metadata?.formType === 'form-47' || 
         doc.title?.toLowerCase().includes('form 47') ||
         doc.title?.toLowerCase().includes('consumer proposal') ||
         data?.content?.extracted_info?.formType === 'form-47';
};

// Helper to check if a document is a Form 76
export const isDocumentForm76 = (doc: Document, data?: any): boolean => {
  return doc.metadata?.formType === 'form-76' || 
         doc.title?.toLowerCase().includes('form 76') ||
         data?.content?.extracted_info?.formType === 'form-76';
};

// Helper to check if a document is a financial document
export const isFinancialDocument = (doc: Document): boolean => {
  return doc.title?.toLowerCase().includes('statement') ||
         doc.title?.toLowerCase().includes('sheet') ||
         doc.title?.toLowerCase().includes('budget') ||
         doc.title?.toLowerCase().includes('.xls');
};

// Helper to extract client name from document
export const extractClientName = (doc: Document, data?: any): string | null => {
  if (data?.content?.extracted_info?.clientName) {
    return data.content.extracted_info.clientName;
  } else if (doc.metadata?.clientName) {
    return doc.metadata.clientName;
  } else if (data?.content?.extracted_info?.consumerDebtorName) {
    // Special case for Form 47
    return data.content.extracted_info.consumerDebtorName;
  }
  return null;
};

// Find appropriate subfolder based on document type
export const findAppropriateSubfolder = (
  clientFolder: FolderStructure,
  isForm47: boolean,
  isForm76: boolean,
  isFinancial: boolean
): { targetFolderId: string; folderPath: string[]; suggestedSubfolderName?: string } => {
  let targetFolderId = clientFolder.id;
  let folderPath = [clientFolder.name];
  let subfolderName = "";
  
  // Check if client folder has children
  if (clientFolder.children) {
    let targetSubfolder;
    
    if (isForm47 || isForm76) {
      // For Form 47/76, look for Forms folder
      subfolderName = "Forms";
      targetSubfolder = clientFolder.children.find(f => 
        f.type === 'form' || f.name.toLowerCase().includes('form')
      );
    } else if (isFinancial) {
      // For financial documents, look for Financial Sheets folder
      subfolderName = "Financial Sheets";
      targetSubfolder = clientFolder.children.find(f => 
        f.type === 'financial' || 
        f.name.toLowerCase().includes('financial') ||
        f.name.toLowerCase().includes('sheet')
      );
    } else {
      // For other documents, use Documents folder
      subfolderName = "Documents";
      targetSubfolder = clientFolder.children.find(f => 
        f.type === 'general' || f.name.toLowerCase().includes('document')
      );
    }
    
    if (targetSubfolder) {
      targetFolderId = targetSubfolder.id;
      folderPath.push(targetSubfolder.name);
      return { targetFolderId, folderPath };
    }
  }
  
  return { targetFolderId, folderPath, suggestedSubfolderName: subfolderName };
};
