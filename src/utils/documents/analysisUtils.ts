
import { AnalysisResult } from './types/analysisTypes';
import { 
  getMockForm65Data, 
  getMockForm66Data, 
  getMockForm76Data 
} from './mockData/formMockData';
import analyzeForm31 from './form31Analyzer';
export { 
  triggerDocumentAnalysis,
  saveAnalysisResults,
  updateDocumentStatus,
  createClientIfNotExists
} from './api/analysisApi';

export type { AnalysisResult };

export const performMockAnalysis = (formNumber = '76', formType = 'bankruptcy'): AnalysisResult => {
  // Get form number from the title or default to 76
  const formNum = formNumber || '76';
  const formTypeLower = formType.toLowerCase();
  
  // Choose the right mock data based on form number
  if (formNum === '31' || formTypeLower.includes('proof of claim')) {
    // Use the Form 31 analyzer for Proof of Claim forms
    return analyzeForm31('GreenTech Supplies Inc. Proof of Claim Form 31') as AnalysisResult;
  } else if (formNum === '66' || formTypeLower.includes('consumer proposal')) {
    return getMockForm66Data();
  } else if (formNum === '65' || formTypeLower.includes('notice of intention')) {
    return getMockForm65Data();
  } else {
    // Default to Form 76 for bankruptcy
    return getMockForm76Data();
  }
};
