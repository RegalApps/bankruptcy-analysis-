
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
  }
  
  // Default to unknown if we couldn't determine the form type
  logger.debug('Could not determine form type, defaulting to unknown');
  return 'unknown';
};
