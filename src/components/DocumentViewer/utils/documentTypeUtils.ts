
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
