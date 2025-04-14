
import { AnalysisProcessProps, AnalysisProcessContext } from "../../DocumentPreview/hooks/analysisProcess/types";
import {
  documentIngestion,
  documentClassification,
  dataExtraction,
  riskAssessment,
  issuePrioritization,
  documentOrganization,
  collaborationSetup,
  continuousLearning
} from "../../DocumentPreview/hooks/analysisProcess/stages";

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
      const { documentText, isForm76 } = await documentClassification(documentRecord, { 
        setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete 
      });
      
      // Enhanced context with form type information
      const enhancedContext: AnalysisProcessContext = { 
        setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete, isForm76 
      };
      
      // Step 3: Data Extraction & Content Processing
      await dataExtraction(documentRecord, isForm76, enhancedContext);
      
      // Step 4: Risk & Compliance Assessment
      await riskAssessment(documentRecord, isForm76, enhancedContext);
      
      // Step 5: Issue Prioritization & Task Management
      await issuePrioritization(documentRecord, isForm76, enhancedContext);
      
      // Step 6: Document Organization & Client Management
      await documentOrganization(documentRecord, enhancedContext);
      
      // Step 7: User Notification & Collaboration
      await collaborationSetup(documentRecord, documentText, isForm76, enhancedContext);
      
      // Step 8: Continuous AI Learning & Improvement
      await continuousLearning(documentRecord, enhancedContext);
      
      console.log('Analysis completed successfully.');
      
      // Call onAnalysisComplete with the document record ID if available
      if (onAnalysisComplete && documentRecord && documentRecord.id) {
        onAnalysisComplete(documentRecord.id);
      }
      
    } catch (error) {
      throw error;
    }
  };
  
  return { executeAnalysisProcess };
};
