
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";

export const riskAssessment = async (
  documentRecord: DocumentRecord,
  isForm76: boolean,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep(isForm76 
    ? "Stage 4: Performing regulatory compliance analysis for Form 76..." 
    : "Stage 4: Risk & Compliance Assessment...");
  setProgress(55);
  
  console.log(`Starting risk assessment for document ${documentRecord.id}, Form 76: ${isForm76}`);
  
  try {
    // For Form 76, add specific risks related to Statement of Affairs
    if (isForm76) {
      // Get existing analysis record if any
      const { data: existingAnalysis } = await supabase
        .from('document_analysis')
        .select('*')
        .eq('document_id', documentRecord.id)
        .maybeSingle();
      
      // Prepare Form 76-specific risks
      const form76Risks = [
        {
          type: "Missing Financial Information",
          description: "Form 76 requires complete financial disclosure including assets, liabilities, and income details",
          severity: "high",
          regulation: "BIA Section 158(d)",
          impact: "Incomplete disclosure may lead to rejection of filing",
          requiredAction: "Ensure all financial sections are completed",
          solution: "Review and complete all financial disclosure sections",
          deadline: "7 days"
        },
        {
          type: "Signature Verification",
          description: "Form 76 requires both debtor and trustee signatures to be valid",
          severity: "high",
          regulation: "BIA Directive 1R6",
          impact: "Without proper signatures, the form may be rejected",
          requiredAction: "Verify all required signatures are present",
          solution: "Obtain missing signatures if needed",
          deadline: "Immediately"
        },
        {
          type: "Disclosure Accuracy",
          description: "All information in Form 76 must be accurate and truthful",
          severity: "medium",
          regulation: "BIA Section 199",
          impact: "False statements can lead to rejection of discharge",
          requiredAction: "Verify accuracy of all disclosed information",
          solution: "Review and validate all provided information",
          deadline: "10 days"
        },
        {
          type: "Missing Witness Signature",
          description: "Form 76 requires witness signature for legal validation",
          severity: "medium",
          regulation: "BIA Procedure",
          impact: "May cause legal delays in processing",
          requiredAction: "Ensure a witness signs the document",
          solution: "Obtain witness signature before submission",
          deadline: "3 days"
        },
        {
          type: "Court Reference Missing",
          description: "Form 76 should include court case reference for filing",
          severity: "low",
          regulation: "BIA Best Practice",
          impact: "Difficult to track in court system",
          requiredAction: "Add court case number if available",
          solution: "Update document with court reference number",
          deadline: "Before filing"
        }
      ];
      
      // Update or create the analysis record with Form 76 risks
      if (existingAnalysis) {
        // Add Form 76 risks to existing risks
        const existingContent = existingAnalysis.content || {};
        const existingRisks = existingContent.risks || [];
        
        const updatedContent = {
          ...existingContent,
          extracted_info: {
            ...(existingContent.extracted_info || {}),
            formType: 'form-76',
            formNumber: '76'
          },
          risks: [...existingRisks, ...form76Risks]
        };
        
        await supabase
          .from('document_analysis')
          .update({ content: updatedContent })
          .eq('document_id', documentRecord.id);
          
        console.log('Updated existing analysis with Form 76 risks');
      } else {
        // Create new analysis record with Form 76 risks
        const { data: userData } = await supabase.auth.getUser();
        
        await supabase
          .from('document_analysis')
          .insert({
            document_id: documentRecord.id,
            user_id: userData.user?.id,
            content: {
              extracted_info: {
                formType: 'form-76',
                formNumber: '76',
                summary: 'Statement of Affairs (Form 76) requires review'
              },
              risks: form76Risks,
              regulatory_compliance: {
                status: 'requires_review',
                details: 'Form 76 requires detailed review for regulatory compliance',
                references: ['BIA Section 158', 'BIA Section 199', 'OSB Directive 1R6']
              }
            }
          });
          
        console.log('Created new analysis with Form 76 risks');
      }
    }
    
    // Update document with risk assessment status
    await updateAnalysisStatus(documentRecord, 'risk_assessment', 'extraction_completed');
    console.log('Risk assessment completed successfully');
    
  } catch (error) {
    console.error('Error in risk assessment stage:', error);
    // Continue with the process even if risk assessment fails partially
  }
};
