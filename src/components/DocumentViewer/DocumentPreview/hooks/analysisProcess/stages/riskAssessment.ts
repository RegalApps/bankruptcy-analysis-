
import { supabase } from "@/lib/supabase";
import { DocumentRecord, AnalysisProcessContext } from "../types";
import { createForm47RiskAssessment } from "@/utils/documentOperations";
import { updateAnalysisStatus } from "../../analysisProcess/documentStatusUpdates";

export const riskAssessment = async (
  documentRecord: DocumentRecord,
  isForm76: boolean, 
  context: AnalysisProcessContext
): Promise<void> => {
  try {
    context.setAnalysisStep("Running risk assessment and compliance check");
    context.setProgress(60);
    context.setProcessingStage("risk_assessment");
    
    console.log("Starting risk assessment for document:", documentRecord.id);
    
    // Update document status to indicate current processing stage
    await updateAnalysisStatus(
      documentRecord,
      "risk_assessment", 
      "Starting risk analysis"
    );
    
    // Artificial delay for UI demonstration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use form-specific risk assessment logic if available
    let riskAssessmentData;
    
    // Check if this is a Form 47 (Consumer Proposal)
    if (documentRecord?.metadata?.formNumber === '47' || 
        documentRecord?.metadata?.formType?.toLowerCase()?.includes('consumer proposal')) {
      console.log("Using specialized Form 47 risk assessment");
      
      // Run specialized Form 47 risk assessment
      riskAssessmentData = await createForm47RiskAssessment(documentRecord.id);
      
    } else if (isForm76) {
      console.log("Processing Form 76 risk assessment");
      // Basic risk assessment for Form 76 (placeholder)
      riskAssessmentData = {
        risks: [
          {
            type: "Missing Details",
            description: "Income verification documents not provided",
            severity: "high"
          },
          {
            type: "Deadline Risk",
            description: "Filing deadline in 5 days",
            severity: "medium"
          }
        ]
      };
    } else {
      // Generic risk assessment for other document types
      riskAssessmentData = {
        risks: [
          {
            type: "Validation Required",
            description: "Document information needs manual verification",
            severity: "medium"
          }
        ]
      };
    }
    
    // Store risk assessment results in document metadata
    const updatedMetadata = {
      ...documentRecord.metadata,
      risk_assessment: riskAssessmentData,
      risk_assessment_timestamp: new Date().toISOString()
    };
    
    // Update document with risk assessment data
    const { error } = await supabase
      .from('documents')
      .update({ 
        metadata: updatedMetadata,
      })
      .eq('id', documentRecord.id);
      
    if (error) {
      throw error;
    }
    
    // Update document status
    await updateAnalysisStatus(
      documentRecord,
      "risk_assessment_complete", 
      "Risk assessment completed"
    );
    
    context.setProgress(65);
    console.log("Risk assessment completed successfully.");
  } catch (error) {
    console.error("Error performing risk assessment:", error);
    context.setError(`Risk assessment failed: ${error.message}`);
    throw error;
  }
};
