import { DocumentRecord } from '@/components/DocumentViewer/hooks/analysisProcess/types';
import { updateAnalysisStatus } from '../documentStatusUpdates';
import { AnalysisProcessContext } from '../types';
import { performMockAnalysis } from '@/utils/documents/analysisUtils';

/**
 * Performs risk assessment and compliance checks on the document.
 */
export const riskAssessment = async (
  documentRecord: DocumentRecord,
  isForm76: boolean,
  { setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete }: AnalysisProcessContext
): Promise<void> => {
  try {
    setAnalysisStep('riskAssessment');
    setProgress(60);
    setProcessingStage('Assessing risks and compliance');
    
    // Simulate risk assessment and compliance checks
    console.log('Simulating risk assessment and compliance checks...');
    
    // Mock analysis result
    const analysisResult = performMockAnalysis(documentRecord.metadata?.formNumber, documentRecord.type);
    
    // Simulate saving analysis results
    console.log('Saving analysis results...');
    
    // Update document status to 'requires_review'
    console.log('Updating document status to requires_review...');
    
    // Update the analysis status
    await updateAnalysisStatus(documentRecord, 'Risk Assessment', 'risk-assessment-complete');
    
    // For Form 76, we can skip risk assessment
    if (isForm76) {
      console.warn('Skipping risk assessment for Form 76');
    }
    
    // Display a success toast message
    toast?.success('Risk assessment and compliance checks completed successfully.');
    
    // Optionally call onAnalysisComplete here if needed
    if (onAnalysisComplete && documentRecord.id) {
      console.log('Calling onAnalysisComplete from riskAssessment');
      onAnalysisComplete(documentRecord.id);
    }
    
  } catch (error: any) {
    console.error('Risk assessment and compliance checks failed:', error);
    setError(`Risk assessment failed: ${error.message}`);
    toast?.error(`Risk assessment failed: ${error.message}`);
    throw error;
  }
};
