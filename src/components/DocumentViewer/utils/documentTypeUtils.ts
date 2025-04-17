import { DocumentDetails } from "../types";

export const isDocumentForm47 = (document: Partial<DocumentDetails>): boolean => {
  // Check document type directly
  if (document.type === 'form-47') {
    return true;
  }
  
  // Check title for form 47 references
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal')) {
    return true;
  }
  
  // Check extracted metadata from analysis
  const analysisContent = document.analysis?.[0]?.content;
  if (analysisContent) {
    // Check form type from extracted info
    const extractedFormType = analysisContent.extracted_info?.formType;
    if (extractedFormType === 'form-47') {
      return true;
    }
    
    // Check if any risks mention consumer proposal regulations
    const hasConsumerProposalRisks = analysisContent.risks?.some(risk => 
      risk.regulation?.includes('66.13') ||
      risk.regulation?.includes('66.14') ||
      risk.regulation?.includes('66.15') ||
      risk.type?.toLowerCase().includes('consumer proposal') ||
      risk.description?.toLowerCase().includes('consumer proposal')
    );
    
    if (hasConsumerProposalRisks) {
      return true;
    }
  }
  
  return false;
};

export const getDocumentTypeColor = (documentType: string): string => {
  switch (documentType?.toLowerCase()) {
    case 'form-47':
    case 'consumer proposal':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'form-76':
    case 'statement of affairs':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'form-65':
    case 'notice of bankruptcy':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'form-21':
    case 'certificate of discharge':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'form-40':
    case 'assignment of bankruptcy':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'court':
    case 'court document':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Enhanced Form 31 detection with multiple fallback methods
 * This centralized utility ensures consistent identification across the application
 */
export const isDocumentForm31 = (document: Partial<DocumentDetails> | null, documentId?: string | null, storagePath?: string | null, title?: string | null): boolean => {
  if (!document && !documentId && !storagePath && !title) {
    return false;
  }
  
  // Method 1: Check explicit flags
  if (document?.metadata?.isForm31 === true) {
    console.log("Form 31 detected via metadata flag");
    return true;
  }
  
  // Method 2: Check document type or form number
  if (document?.type === 'form-31' || 
      document?.metadata?.formType === 'form-31' || 
      document?.metadata?.formNumber === '31') {
    console.log("Form 31 detected via document type/form number");
    return true;
  }
  
  // Method 3: Check document title
  const docTitle = document?.title || title || '';
  if (docTitle.toLowerCase().includes('form 31') || 
      docTitle.toLowerCase().includes('form-31') || 
      docTitle.toLowerCase().includes('proof of claim')) {
    console.log("Form 31 detected via document title");
    return true;
  }
  
  // Method 4: Check document ID
  const docId = document?.id || documentId || '';
  if (docId.toLowerCase().includes('form31') || 
      docId.toLowerCase().includes('form-31') || 
      docId.toLowerCase().includes('greentech')) {
    console.log("Form 31 detected via document ID");
    return true;
  }
  
  // Method 5: Check storage path
  const path = document?.storage_path || storagePath || '';
  if (path.toLowerCase().includes('form31') || 
      path.toLowerCase().includes('form-31') || 
      path.toLowerCase().includes('greentech') || 
      path.toLowerCase().includes('proof-of-claim')) {
    console.log("Form 31 detected via storage path");
    return true;
  }
  
  // Method 6: Check for Form 31 content patterns in analysis
  if (document?.analysis && document.analysis.length > 0) {
    const analysisContent = document.analysis[0].content;
    if (analysisContent) {
      // Check if any risk mentions Form 31 sections
      const hasForm31Risks = analysisContent.risks?.some((risk: any) => 
        risk.description?.toLowerCase().includes('proof of claim') ||
        risk.type?.toLowerCase().includes('form 31') ||
        risk.regulation?.toLowerCase().includes('form 31')
      );
      
      if (hasForm31Risks) {
        console.log("Form 31 detected via risk analysis content");
        return true;
      }
      
      // Check extracted info
      if (analysisContent.extracted_info?.formType === 'form-31' ||
          analysisContent.extracted_info?.formNumber === '31') {
        console.log("Form 31 detected via extracted form metadata");
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Get the effective document path for a document, ensuring Form 31 documents
 * always have a valid path even if the original is missing
 */
export const getEffectiveStoragePath = (
  originalPath: string | null | undefined,
  isForm31: boolean,
  documentId?: string | null
): string => {
  if (!originalPath && isForm31) {
    console.log("Using Form 31 fallback path for document:", documentId);
    return "demo/greentech-form31-proof-of-claim.pdf";
  }
  
  return originalPath || '';
};
