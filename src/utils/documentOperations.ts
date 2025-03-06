
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

/**
 * Creates a comprehensive risk assessment for Form 47 Consumer Proposal documents
 */
export const createForm47RiskAssessment = async (documentId: string) => {
  try {
    // Get existing document analysis if any
    const { data: existingAnalysis, error: getError } = await supabase
      .from('document_analysis')
      .select('content')
      .eq('document_id', documentId)
      .maybeSingle();
      
    if (getError) throw getError;
    
    // Get authenticated user for creating the analysis
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    // Form 47-specific risks with detailed information
    const form47Risks = [
      {
        type: "Missing Payment Schedule",
        description: "Consumer Proposal requires detailed payment schedule for unsecured creditors",
        severity: "high",
        regulation: "BIA Section 66.14",
        impact: "Proposal will be rejected without clear payment terms",
        requiredAction: "Add complete payment schedule with amounts and dates",
        solution: "Prepare a structured payment schedule showing total amount, frequency, and duration",
        deadline: "Immediately"
      },
      {
        type: "Missing Dividend Distribution Plan",
        description: "Consumer Proposal must specify how funds will be distributed to creditors",
        severity: "high",
        regulation: "BIA Section 66.15",
        impact: "Non-compliance with regulatory distribution requirements",
        requiredAction: "Define dividend distribution methodology",
        solution: "Add section detailing distribution calculations and timing",
        deadline: "3 days"
      },
      {
        type: "Administrator Information Incomplete",
        description: "Licensed Insolvency Trustee details are required as the Administrator",
        severity: "medium",
        regulation: "BIA Section 66.13(2)(a)",
        impact: "Cannot verify authorized administrator",
        requiredAction: "Complete administrator information",
        solution: "Add full name, license number and contact information for the Administrator",
        deadline: "5 days"
      },
      {
        type: "Missing Secured Creditors Treatment",
        description: "Consumer Proposal must specify how secured creditors will be treated",
        severity: "high",
        regulation: "BIA Section 66.13(2)(c)",
        impact: "Secured creditors' rights not addressed",
        requiredAction: "Specify treatment of secured creditors",
        solution: "Add section detailing how secured debts will be handled",
        deadline: "Immediately"
      },
      {
        type: "Submission Deadline Approaching",
        description: "Proposal must be submitted by the specified deadline",
        severity: "medium",
        regulation: "BIA Procedural Requirements",
        impact: "Missing the deadline invalidates the proposal",
        requiredAction: "Ensure timely submission",
        solution: "Schedule final review and submission before the deadline",
        deadline: "7 days"
      },
      {
        type: "Missing Witness Signature",
        description: "Consumer Proposal requires witness signature for legal validation",
        severity: "medium",
        regulation: "BIA Documentation Requirements",
        impact: "Document may not be legally binding",
        requiredAction: "Obtain witness signature",
        solution: "Have a qualified witness sign the document",
        deadline: "Before submission"
      }
    ];
    
    // Update or create the document analysis
    if (existingAnalysis) {
      // Add Form 47 risks to existing content
      const existingContent = existingAnalysis.content || {};
      const existingRisks = existingContent.risks || [];
      
      const updatedContent = {
        ...existingContent,
        extracted_info: {
          ...(existingContent.extracted_info || {}),
          formType: 'form-47',
          formNumber: '47',
          summary: 'Consumer Proposal (Form 47) requires review'
        },
        risks: [...existingRisks, ...form47Risks],
        regulatory_compliance: {
          status: 'requires_review',
          details: 'Form 47 Consumer Proposal requires detailed regulatory compliance review',
          references: [
            'BIA Section 66.13',
            'BIA Section 66.14',
            'BIA Section 66.15',
            'BIA Section 66.26'
          ]
        }
      };
      
      await supabase
        .from('document_analysis')
        .update({ content: updatedContent })
        .eq('document_id', documentId);
        
      logger.info('Updated existing analysis with Form 47 risks', { documentId });
    } else {
      // Create new analysis with Form 47 risks
      await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          user_id: userData.user?.id,
          content: {
            extracted_info: {
              formType: 'form-47',
              formNumber: '47',
              summary: 'Consumer Proposal (Form 47) requires review'
            },
            risks: form47Risks,
            regulatory_compliance: {
              status: 'requires_review',
              details: 'Form 47 Consumer Proposal requires detailed regulatory compliance review',
              references: [
                'BIA Section 66.13',
                'BIA Section 66.14',
                'BIA Section 66.15',
                'BIA Section 66.26'
              ]
            }
          }
        });
        
      logger.info('Created new analysis with Form 47 risks', { documentId });
    }
    
    return true;
  } catch (error) {
    logger.error('Error creating Form 47 risk assessment:', error);
    return false;
  }
};
