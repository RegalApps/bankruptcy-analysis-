
import { supabase } from "@/lib/supabase";
import { AnalysisProcessProps } from "../types";
import { updateAnalysisStatus } from "../../documentStatusUpdates";
import { DocumentRecord } from "../../types";
import { createForm47RiskAssessment } from "@/utils/documentOperations";

export const riskAssessment = async (
  documentRecord: DocumentRecord, 
  isForm76: boolean,
  context: AnalysisProcessProps & { isForm76?: boolean }
) => {
  const { setAnalysisStep, setProgress, setError, setProcessingStage, toast } = context;
  
  try {
    // Update processing stage
    setProcessingStage("Analyzing document risks and compliance status");
    setAnalysisStep("risk-assessment");
    setProgress(60);
    
    console.log(`Running risk assessment for document ${documentRecord.id}, form type: ${isForm76 ? 'Form 76' : 'Other'}`);
    
    // Update document status
    await updateAnalysisStatus(documentRecord, "risk-assessment", "risk-detection-started");
    
    // Special handling for Form 47 (consumer proposal)
    if (documentRecord.title?.toLowerCase().includes('form 47') || 
        documentRecord.title?.toLowerCase().includes('consumer proposal')) {
      console.log('Detected Form 47, using specific risk assessment');
      
      // Use our specialized Form 47 risk assessment
      const riskAnalysis = await createForm47RiskAssessment(documentRecord.id);
      
      // Store the risk analysis in the document metadata
      const updatedMetadata = {
        ...documentRecord.metadata,
        formType: 'form-47',
        documentType: 'consumer-proposal',
        riskAssessment: {
          completedAt: new Date().toISOString(),
          risks: riskAnalysis.risks || []
        }
      };
      
      // Update the document with the risk assessment results
      await supabase.from('documents')
        .update({
          metadata: updatedMetadata,
          ai_processing_status: 'processing_financial'
        })
        .eq('id', documentRecord.id);
        
      console.log('Form 47 risk assessment completed and saved');
      
      // Continue processing
      return true;
    }
    
    // Update document status to mark risk assessment as complete
    await updateAnalysisStatus(documentRecord, "risk-assessment", "risk-detection-completed");
    setProgress(65);
    
    return true;
  } catch (error: any) {
    console.error('Error during risk assessment:', error);
    setError(`Risk assessment failed: ${error.message}`);
    toast?.error("Could not complete risk assessment");
    return false;
  }
};
