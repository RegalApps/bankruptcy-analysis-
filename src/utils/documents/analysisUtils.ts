
import { AnalysisResult } from './types/analysisTypes';
import { 
  getMockForm65Data, 
  getMockForm66Data, 
  getMockForm76Data 
} from './mockData/formMockData';
export { 
  triggerDocumentAnalysis,
  saveAnalysisResults,
  updateDocumentStatus,
  createClientIfNotExists
} from './api/analysisApi';

export type { AnalysisResult };

export const performMockAnalysis = (formNumber?: string | number, formType?: string): AnalysisResult => {
  // Normalize form number and type for consistent comparison
  const formNumStr = formNumber ? String(formNumber).trim() : '';
  const formNum = parseInt(formNumStr, 10);
  const formTypeLower = formType ? formType.toLowerCase().trim() : '';
  
  console.log(`Form analysis - Number: "${formNumStr}", Type: "${formTypeLower}"`);
  
  // Check for Form 66 (Consumer Proposal) first
  if (formNumStr === '66' || formNum === 66 || 
      formTypeLower.includes('consumer proposal') || 
      formTypeLower.includes('form 66')) {
    console.log('Detected Form 66 - Returning Consumer Proposal data');
    return getMockForm66Data();
  } 
  
  // Check for Form 65 (Notice of Intention)
  if (formNumStr === '65' || formNum === 65 || 
      formTypeLower.includes('notice of intention') || 
      formTypeLower.includes('form 65')) {
    console.log('Detected Form 65 - Returning Notice of Intention data');
    return getMockForm65Data();
  }
  
  // Check for Form 76 (Bankruptcy)
  if (formNumStr === '76' || formNum === 76 || 
      formTypeLower.includes('bankruptcy') || 
      formTypeLower.includes('form 76')) {
    console.log('Detected Form 76 - Returning Bankruptcy data');
    return getMockForm76Data();
  }
  
  // Handle other forms between 1-96
  if (!isNaN(formNum) && formNum >= 1 && formNum <= 96) {
    console.log(`Form ${formNum} detected - Using most appropriate mock data`);
    
    // Group similar forms by type
    if (formNum >= 65 && formNum <= 69) {
      // Forms 65-69 are related to proposals
      return getMockForm65Data();
    } else if (formNum >= 75 && formNum <= 80) {
      // Forms 75-80 are related to bankruptcy
      return getMockForm76Data();
    } else {
      // For all other forms, make best guess based on form number
      if (formTypeLower.includes('proposal')) {
        return getMockForm66Data();
      } else if (formTypeLower.includes('intention')) {
        return getMockForm65Data();
      } else {
        // Default to bankruptcy for unknown forms
        return getMockForm76Data();
      }
    }
  }
  
  // If no valid form number detected, log warning and use form type to determine
  console.warn(`No valid form number detected. Using form type "${formType}" to determine template.`);
  if (formTypeLower.includes('proposal')) {
    return getMockForm66Data();
  } else if (formTypeLower.includes('intention')) {
    return getMockForm65Data();
  } else {
    // Default fallback
    console.log('Defaulting to Form 76 - Returning Bankruptcy data');
    return getMockForm76Data();
  }
};
