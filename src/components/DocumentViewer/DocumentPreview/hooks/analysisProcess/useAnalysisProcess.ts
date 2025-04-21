
import { AnalysisProcessProps } from "./types";
import {
  documentIngestion,
  documentClassification,
  dataExtraction,
  riskAssessment,
  issuePrioritization,
  documentOrganization,
  collaborationSetup,
  continuousLearning
} from "./stages";
import { isForm31 } from "./formIdentification";

export const useAnalysisProcess = ({
  setAnalysisStep,
  setProgress,
  setError,
  setProcessingStage,
  toast,
  onAnalysisComplete
}: AnalysisProcessProps) => {
  
  const executeAnalysisProcess = async (storagePath: string, session: any) => {
    try {
      // Step 1: Document Ingestion
      const documentRecord = await documentIngestion(storagePath, { 
        setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete 
      });
      
      // Step 2: Document Classification & Understanding
      const { documentText, isForm76, isForm47 } = await documentClassification(documentRecord, { 
        setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete 
      });
      
      // Check if document is Form 31 (Proof of Claim)
      const isForm31Doc = isForm31(documentRecord, documentText);
      
      // Enhanced context with form type information
      const enhancedContext = { 
        setAnalysisStep, 
        setProgress, 
        setError, 
        setProcessingStage, 
        toast, 
        onAnalysisComplete, 
        isForm76, 
        isForm47,
        isForm31: isForm31Doc,
        documentText
      };
      
      // Step 3: Data Extraction & Content Processing
      await dataExtraction(documentRecord, isForm76, enhancedContext);
      
      // Step 4: Risk & Compliance Assessment
      await riskAssessment(documentRecord, isForm76, enhancedContext);
      
      // Step 5: Issue Prioritization & Solution Recommendations
      await issuePrioritization(documentRecord, enhancedContext);
      
      // Step 6: Document Organization & Client Association
      await documentOrganization(documentRecord, enhancedContext);
      
      // Step 7: Collaboration Setup
      await collaborationSetup(documentRecord, documentText, isForm76, enhancedContext);
      
      // Step 8: Continuous Learning & Improvement
      await continuousLearning(documentRecord, enhancedContext);
      
      setAnalysisStep("Analysis completed successfully");
      setProgress(100);
      
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error: any) {
      console.error(`Error in analysis process:`, error);
      setError(error.message || 'Unknown error');
      throw error;
    }
  };

  return {
    executeAnalysisProcess
  };
};
