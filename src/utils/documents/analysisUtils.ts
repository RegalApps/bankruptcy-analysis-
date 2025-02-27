
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

export const performMockAnalysis = (formNumber = '76', formType = 'bankruptcy'): AnalysisResult => {
  // Normalize form number and type for consistent comparison
  const formNum = String(formNumber).trim();
  const formTypeLower = formType.toLowerCase();
  
  // More precise form type detection
  if (formNum === '66' || 
      formTypeLower.includes('consumer proposal') || 
      formTypeLower.includes('form 66')) {
    console.log('Detected Form 66 - Returning Consumer Proposal data');
    return getMockForm66Data();
  } else if (formNum === '65' || 
            formTypeLower.includes('notice of intention') || 
            formTypeLower.includes('form 65')) {
    console.log('Detected Form 65 - Returning Notice of Intention data');
    return getMockForm65Data();
  } else {
    console.log('Defaulting to Form 76 - Returning Bankruptcy data');
    return getMockForm76Data();
  }
};
