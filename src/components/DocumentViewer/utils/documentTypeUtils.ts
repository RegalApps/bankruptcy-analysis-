
import { DocumentDetails } from "../types";

export const isDocumentForm47 = (document: DocumentDetails): boolean => {
  const extractedFormType = document.analysis?.[0]?.content?.extracted_info?.formType;
  
  return document.type === 'form-47' || 
         extractedFormType === 'form-47' ||
         document.title?.toLowerCase().includes('form 47') || 
         document.title?.toLowerCase().includes('consumer proposal');
};
