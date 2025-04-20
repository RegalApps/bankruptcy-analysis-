import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";
import { createForm47RiskAssessment } from "@/utils/documentOperations";

export const riskAssessment = async (
  documentRecord: DocumentRecord,
  isForm76: boolean,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress, isForm47 = false } = context;
  
  // Check if this is a Form 47 (Consumer Proposal) - use either context or metadata
  const isForm47Document = isForm47 || documentRecord.metadata?.formType === 'form-47' || 
                  documentRecord.title?.toLowerCase().includes('form 47') ||
                  documentRecord.title?.toLowerCase().includes('consumer proposal');
                  
  // Check if this is a Form 31 (Proof of Claim)
  const isForm31 = documentRecord.metadata?.formType === 'form-31' ||
                  documentRecord.metadata?.formType === 'proof-of-claim' ||
                  documentRecord.title?.toLowerCase().includes('form 31') ||
                  documentRecord.title?.toLowerCase().includes('proof of claim');
  
  if (isForm47Document) {
    setAnalysisStep("Stage 4: Analyzing Consumer Proposal for compliance...");
  } else if (isForm76) {
    setAnalysisStep("Stage 4: Performing regulatory compliance analysis for Form 76..."); 
  } else if (isForm31) {
    setAnalysisStep("Stage 4: Analyzing Proof of Claim (Form 31) compliance...");
  } else {
    setAnalysisStep("Stage 4: Risk & Compliance Assessment...");
  }
  
  setProgress(55);
  
  console.log(`Starting risk assessment for document ${documentRecord.id}, Form 76: ${isForm76}, Form 47: ${isForm47Document}, Form 31: ${isForm31}`);
  
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
    } else if (isForm47Document) {
      // Process Form 47 Consumer Proposal
      await createForm47RiskAssessment(documentRecord.id);
      console.log('Created Form 47 risk assessment');
    } else if (isForm31) {
      // Process Form 31 Proof of Claim
      // Get existing analysis record if any
      const { data: existingAnalysis } = await supabase
        .from('document_analysis')
        .select('*')
        .eq('document_id', documentRecord.id)
        .maybeSingle();
      
      // If we don't have a full analysis yet from OpenAI, add default Form 31 risks
      if (!existingAnalysis?.content?.comprehensive_risks) {
        const form31DefaultRisks = [
          {
            type: "Document Verification",
            description: "Form 31 must be the current version prescribed by the Superintendent",
            severity: "medium",
            reference: "BIA Rule 150",
            impact: "Outdated forms may be rejected by the court or OSB",
            required_action: "Verify form version is current",
            solution: "Download current version from OSB website if needed",
            deadline: "Immediately"
          },
          {
            type: "Signature Authentication",
            description: "Form 31 requires proper signature authentication",
            severity: "high",
            reference: "BIA Rule 31(1)",
            impact: "Improperly signed forms are invalid and not legally enforceable",
            required_action: "Verify creditor signature is present",
            solution: "Ensure document is properly signed by authorized party",
            deadline: "Immediately"
          },
          {
            type: "Supporting Documentation",
            description: "Form 31 requires appropriate supporting documents based on claim type",
            severity: "medium",
            reference: "BIA Practice",
            impact: "Claims without proper support may be disallowed",
            required_action: "Review attachments and supporting documentation",
            solution: "Request additional documentation if claim support is insufficient",
            deadline: "7 days"
          },
          {
            type: "Claim Classification",
            description: "Form 31 claim type must be properly selected (Section 4 checkboxes)",
            severity: "high",
            reference: "BIA s. 121-128",
            impact: "Incorrectly classified claims may affect distribution and voting rights",
            required_action: "Verify claim type selection is appropriate",
            solution: "Validate claim type against supporting documentation",
            deadline: "5 days"
          },
          {
            type: "Electronic Filing Compliance",
            description: "Electronic filing of Form 31 must include Form 1.1 declaration",
            severity: "medium",
            reference: "OSB Directive No. 18R",
            impact: "Non-compliant e-filings may be rejected",
            required_action: "Verify Form 1.1 is included if electronically filed",
            solution: "Attach Form 1.1 declaration if missing",
            deadline: "3 days"
          }
        ];
        
        // Update or create analysis with default Form 31 risks
        if (existingAnalysis) {
          const existingContent = existingAnalysis.content || {};
          
          const updatedContent = {
            ...existingContent,
            comprehensive_risks: form31DefaultRisks,
            document_verification: {
              is_form_31: true,
              current_version: "unknown",
              file_numbers: {
                estate_number: documentRecord.metadata?.estateNumber || "unknown",
                court_file_number: documentRecord.metadata?.courtFileNumber || "unknown"
              }
            }
          };
          
          await supabase
            .from('document_analysis')
            .update({ content: updatedContent })
            .eq('document_id', documentRecord.id);
            
          console.log('Updated existing analysis with Form 31 default risks');
        } else {
          // Create new analysis with Form 31 risks
          const { data: userData } = await supabase.auth.getUser();
          
          await supabase
            .from('document_analysis')
            .insert({
              document_id: documentRecord.id,
              user_id: userData.user?.id,
              content: {
                comprehensive_risks: form31DefaultRisks,
                document_verification: {
                  is_form_31: true,
                  current_version: "unknown",
                  file_numbers: {
                    estate_number: documentRecord.metadata?.estateNumber || "unknown",
                    court_file_number: documentRecord.metadata?.courtFileNumber || "unknown"
                  }
                },
                summary: "Form 31 - Proof of Claim requires detailed review for compliance with BIA requirements"
              }
            });
            
          console.log('Created new analysis with Form 31 risks');
        }
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
