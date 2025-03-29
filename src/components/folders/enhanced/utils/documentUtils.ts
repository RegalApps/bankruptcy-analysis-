
import { Document } from "@/components/DocumentList/types";

/**
 * Check if a document is a Form 47 or Form 76
 */
export const isForm47or76 = (document: Document): boolean => {
  return (
    document.metadata?.formType === 'form-47' ||
    document.metadata?.formType === 'form-76' ||
    document.title?.toLowerCase().includes('form 47') ||
    document.title?.toLowerCase().includes('form 76') ||
    document.title?.toLowerCase().includes('consumer proposal') ||
    document.title?.toLowerCase().includes('statement of affairs')
  );
};

/**
 * Check if a document is locked
 */
export const isDocumentLocked = (document: Document): boolean => {
  return document.metadata?.locked === true || document.metadata?.system === true;
};

/**
 * Check if a document needs attention
 */
export const documentNeedsAttention = (document: Document): boolean => {
  // Check if document has any pending tasks or requires attention
  return (
    document.metadata?.status === 'attention' ||
    document.metadata?.status === 'pending' ||
    document.metadata?.requiresAction === true ||
    document.metadata?.signatureStatus === 'pending' ||
    (document.metadata?.risks && Array.isArray(document.metadata.risks) && document.metadata.risks.length > 0)
  );
};

/**
 * Creates the estate number from document metadata or defaults to a standard value
 */
export const getEstateNumber = (document: Document): string => {
  if (document.metadata?.estateNumber) {
    return document.metadata.estateNumber;
  }
  
  // For demo purposes, generate an estate number for Josh Hart
  if (document.metadata?.clientName === "Josh Hart" || 
      document.metadata?.client_name === "Josh Hart") {
    return "Estate-47-2023";
  }
  
  return "Estate-Pending";
};

/**
 * Get document form type (47, 76, etc)
 */
export const getFormType = (document: Document): string => {
  if (document.metadata?.formNumber) {
    return `Form ${document.metadata.formNumber}`;
  }
  
  if (document.metadata?.formType === 'form-47') {
    return "Form 47";
  }
  
  if (document.metadata?.formType === 'form-76') {
    return "Form 76";
  }
  
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal')) {
    return "Form 47";
  }
  
  if (document.title?.toLowerCase().includes('form 76') || 
      document.title?.toLowerCase().includes('statement of affairs')) {
    return "Form 76";
  }
  
  return "Documents";
};

/**
 * Generate a hierarchical structure for the document tree
 */
export const createDocumentHierarchy = (documents: Document[]): Document[] => {
  if (!documents || documents.length === 0) return [];
  
  const clientFolders: Record<string, Document> = {};
  const estateFolders: Record<string, Document> = {};
  const formFolders: Record<string, Document> = {};
  
  // Create special Josh Hart client for demonstration
  const joshHartClientId = 'josh-hart-client';
  const joshHartEstateId = 'josh-hart-estate';
  const joshHartFormId = 'josh-hart-form47';
  
  // Create client folder for Josh Hart
  clientFolders[joshHartClientId] = {
    id: joshHartClientId,
    title: "Josh Hart",
    type: "folder",
    is_folder: true,
    folder_type: "client",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    storage_path: "",
    size: 0,
    metadata: {
      clientName: "Josh Hart",
      system: true
    }
  };
  
  // Create estate folder for Josh Hart
  estateFolders[joshHartEstateId] = {
    id: joshHartEstateId,
    title: "Estate-47-2023",
    type: "folder",
    is_folder: true,
    folder_type: "estate",
    parent_folder_id: joshHartClientId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    storage_path: "",
    size: 0,
    metadata: {
      clientName: "Josh Hart",
      estateNumber: "Estate-47-2023",
      system: true
    }
  };
  
  // Create form folder for Josh Hart
  formFolders[joshHartFormId] = {
    id: joshHartFormId,
    title: "Form 47",
    type: "folder",
    is_folder: true,
    folder_type: "form",
    parent_folder_id: joshHartEstateId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    storage_path: "",
    size: 0,
    metadata: {
      clientName: "Josh Hart",
      estateNumber: "Estate-47-2023",
      formType: "form-47",
      formNumber: "47",
      system: true
    }
  };
  
  // Find all Form 47 documents related to Josh Hart
  const form47Docs = documents.filter(doc => 
    (doc.metadata?.clientName === "Josh Hart" || doc.metadata?.client_name === "Josh Hart") && 
    isForm47or76(doc) && 
    !doc.is_folder
  );
  
  // Assign each Form 47 document to the Josh Hart Form 47 folder
  for (const doc of form47Docs) {
    // Create a new document reference with updated parent folder
    const updatedDoc = {
      ...doc,
      parent_folder_id: joshHartFormId,
      metadata: {
        ...doc.metadata,
        clientName: "Josh Hart",
        estateNumber: "Estate-47-2023",
        formType: "form-47",
        formNumber: "47",
        status: "attention" // Mark as needing attention
      }
    };
    
    // Replace the original document with updated one
    const index = documents.findIndex(d => d.id === doc.id);
    if (index !== -1) {
      documents[index] = updatedDoc;
    }
  }
  
  // Add our special folders to the document list
  documents.push(clientFolders[joshHartClientId]);
  documents.push(estateFolders[joshHartEstateId]);
  documents.push(formFolders[joshHartFormId]);
  
  return documents;
};
