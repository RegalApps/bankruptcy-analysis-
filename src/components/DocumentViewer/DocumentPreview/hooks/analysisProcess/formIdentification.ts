
import logger from "@/utils/logger";

export const detectFormType = (document: any, documentText: string) => {
  // Try to extract from metadata or title first
  if (document.metadata?.formType) {
    logger.debug(`Form type detected from metadata: ${document.metadata.formType}`);
    return document.metadata.formType.toLowerCase();
  }
  
  // Look for form type in document title
  const titleMatch = document.title?.match(/form[- ]?(\d+)/i);
  if (titleMatch) {
    const formNumber = titleMatch[1];
    logger.debug(`Form number detected from title: ${formNumber}`);
    return `form-${formNumber}`;
  }
  
  // Check if analysis has already detected a form type
  if (document.analysis && document.analysis[0]?.content?.extracted_info?.formType) {
    const formType = document.analysis[0].content.extracted_info.formType;
    logger.debug(`Form type detected from analysis: ${formType}`);
    return formType;
  }
  
  if (document.analysis && document.analysis[0]?.content?.extracted_info?.type) {
    const formType = document.analysis[0].content.extracted_info.type;
    logger.debug(`Form type detected from analysis type field: ${formType}`);
    return formType;
  }

  // Check document text for forms
  const form31Keywords = ["proof of claim", "form 31", "creditor claim"];
  const form47Keywords = ["consumer proposal", "form 47", "payment schedule"];
  const form76Keywords = ["statement of affairs", "form 76", "monthly income"];
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = documentText ? documentText.toLowerCase() : '';
  
  if (lowerText) {
    // Look for explicit form numbers in the text
    const formNumberMatch = lowerText.match(/form[- ]?(\d+)/i);
    if (formNumberMatch) {
      const formNumber = formNumberMatch[1];
      logger.debug(`Form number detected from text content: ${formNumber}`);
      return `form-${formNumber}`;
    }
    
    // Check for form-specific keywords
    if (form31Keywords.some(keyword => lowerText.includes(keyword))) {
      logger.debug('Form 31 detected based on keywords');
      return 'form-31';
    }
    
    if (form47Keywords.some(keyword => lowerText.includes(keyword))) {
      logger.debug('Form 47 detected based on keywords');
      return 'form-47';
    }
    
    if (form76Keywords.some(keyword => lowerText.includes(keyword))) {
      logger.debug('Form 76 detected based on keywords');
      return 'form-76';
    }
  }
  
  // Default to unknown if we couldn't determine the form type
  logger.debug('Could not determine form type, defaulting to unknown');
  return 'unknown';
};

// Add these missing form detection functions
export const isForm31 = (document: any, documentText: string = ''): boolean => {
  // Check if document title contains form 31 or proof of claim references
  if (document.title?.toLowerCase().includes('form 31') || 
      document.title?.toLowerCase().includes('proof of claim')) {
    return true;
  }

  // Check metadata
  if (document.metadata?.formType === 'form-31' || document.metadata?.formNumber === '31') {
    return true;
  }
  
  // Check if analysis has already identified this as Form 31
  if (document.analysis && 
      (document.analysis[0]?.content?.extracted_info?.formType === 'form-31' ||
       document.analysis[0]?.content?.extracted_info?.formNumber === '31')) {
    return true;
  }
  
  // Check document text for Form 31 keywords
  const lowerText = documentText.toLowerCase();
  const form31Keywords = ["proof of claim", "form 31", "creditor claim"];
  
  if (form31Keywords.some(keyword => lowerText.includes(keyword))) {
    return true;
  }
  
  return false;
};

export const isForm47 = (document: any, documentText: string = ''): boolean => {
  // Check if document title contains form 47 or consumer proposal references
  if (document.title?.toLowerCase().includes('form 47') || 
      document.title?.toLowerCase().includes('consumer proposal')) {
    return true;
  }

  // Check metadata
  if (document.metadata?.formType === 'form-47' || document.metadata?.formNumber === '47') {
    return true;
  }
  
  // Check if analysis has already identified this as Form 47
  if (document.analysis && 
      (document.analysis[0]?.content?.extracted_info?.formType === 'form-47' ||
       document.analysis[0]?.content?.extracted_info?.formNumber === '47')) {
    return true;
  }
  
  // Check document text for Form 47 keywords
  const lowerText = documentText.toLowerCase();
  const form47Keywords = ["consumer proposal", "form 47", "payment schedule"];
  
  if (form47Keywords.some(keyword => lowerText.includes(keyword))) {
    return true;
  }
  
  return false;
};

export const isForm76 = (document: any, documentText: string = ''): boolean => {
  // Check if document title contains form 76 or statement of affairs references
  if (document.title?.toLowerCase().includes('form 76') || 
      document.title?.toLowerCase().includes('statement of affairs')) {
    return true;
  }

  // Check metadata
  if (document.metadata?.formType === 'form-76' || document.metadata?.formNumber === '76') {
    return true;
  }
  
  // Check if analysis has already identified this as Form 76
  if (document.analysis && 
      (document.analysis[0]?.content?.extracted_info?.formType === 'form-76' ||
       document.analysis[0]?.content?.extracted_info?.formNumber === '76')) {
    return true;
  }
  
  // Check document text for Form 76 keywords
  const lowerText = documentText.toLowerCase();
  const form76Keywords = ["statement of affairs", "form 76", "monthly income"];
  
  if (form76Keywords.some(keyword => lowerText.includes(keyword))) {
    return true;
  }
  
  return false;
};
