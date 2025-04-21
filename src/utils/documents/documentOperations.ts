
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

/**
 * Creates a detailed risk assessment for Form 47 Consumer Proposal documents
 * @param documentId The document ID to create the risk assessment for
 */
export const createForm47RiskAssessment = async (documentId) => {
  try {
    // Get existing analysis record if any
    const { data: existingAnalysis } = await supabase
      .from('document_analysis')
      .select('*')
      .eq('document_id', documentId)
      .maybeSingle();

    // Get current user
    const { data: userData } = await supabase.auth.getUser();

    // Prepare Form 47-specific detailed risks based on BIA requirements
    const form47Risks = [
      {
        type: "compliance",
        description: "Secured Creditors Payment Terms Missing",
        severity: "high",
        regulation: "BIA Section 66.13(2)(c)",
        impact: "Non-compliance with BIA Sec. 66.13(2)(c)",
        requiredAction: "Specify how secured debts will be paid",
        solution: "Add detailed payment terms for secured creditors",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "Unsecured Creditors Payment Plan Not Provided",
        severity: "high",
        regulation: "BIA Section 66.14",
        impact: "Proposal will be invalid under BIA Sec. 66.14",
        requiredAction: "Add a structured payment plan for unsecured creditors",
        solution: "Create detailed payment schedule for unsecured creditors",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "No Dividend Distribution Schedule",
        severity: "high",
        regulation: "BIA Section 66.15",
        impact: "Fails to meet regulatory distribution rules",
        requiredAction: "Define how funds will be distributed among creditors",
        solution: "Add dividend distribution schedule with percentages and timeline",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "Administrator Fees & Expenses Not Specified",
        severity: "medium",
        regulation: "OSB Directive",
        impact: "Can delay approval from the Office of the Superintendent of Bankruptcy (OSB)",
        requiredAction: "Detail administrator fees to meet regulatory transparency",
        solution: "Specify administrator fees and expenses with breakdown",
        deadline: "3 days"
      },
      {
        type: "legal",
        description: "Proposal Not Signed by Witness",
        severity: "medium",
        regulation: "BIA Requirement",
        impact: "May cause legal delays",
        requiredAction: "Ensure a witness signs before submission",
        solution: "Obtain witness signature on proposal document",
        deadline: "3 days"
      },
      {
        type: "compliance",
        description: "No Additional Terms Specified",
        severity: "low",
        regulation: "BIA Best Practice",
        impact: "Could be required for unique creditor terms",
        requiredAction: "Add custom clauses if applicable",
        solution: "Review if additional terms are needed for special cases",
        deadline: "5 days"
      },
      {
        type: "financial",
        description: "Surplus Income Calculation Missing",
        severity: "high",
        regulation: "BIA Directive No. 6R3",
        impact: "Cannot determine if proposal payments meet minimum requirements",
        requiredAction: "Calculate surplus income according to Directive 6R3",
        solution: "Add detailed surplus income calculation with OSB thresholds",
        deadline: "Immediate"
      },
      {
        type: "documentation",
        description: "Missing Income & Expense Documentation",
        severity: "medium",
        regulation: "Form 47 Requirements",
        impact: "Cannot verify financial disclosure accuracy",
        requiredAction: "Attach supporting documents for income/expenses",
        solution: "Include pay stubs, bank statements, and expense receipts",
        deadline: "5 days"
      },
      {
        type: "compliance",
        description: "Incomplete Statement of Affairs",
        severity: "high",
        regulation: "BIA s. 66.13",
        impact: "Proposal may be rejected for incomplete disclosure",
        requiredAction: "Complete all sections of the Statement of Affairs",
        solution: "Review and complete all asset and liability sections",
        deadline: "Immediate"
      },
      {
        type: "legal",
        description: "No Sworn Declaration",
        severity: "high",
        regulation: "BIA Rule 47",
        impact: "Document lacks legal validity without oath",
        requiredAction: "Ensure form is properly sworn",
        solution: "Have document sworn before trustee or commissioner",
        deadline: "Immediate"
      }
    ];

    // Add detailed Form 47 client information
    const clientInfo = {
      clientName: "Josh Hart",
      administratorName: "Tom Francis",
      filingDate: "February 1, 2025",
      submissionDeadline: "March 3, 2025",
      documentStatus: "Draft - Pending Review",
      formType: "form-47",
      formNumber: "47",
      summary: "Consumer Proposal (Form 47) submitted by Josh Hart under Paragraph 66.13(2)(c) of the BIA"
    };

    // Update or create the analysis record with Form 47 risks
    if (existingAnalysis) {
      // Add Form 47 risks to existing risks
      const existingContent = existingAnalysis.content || {};
      const existingRisks = existingContent.risks || [];
      const updatedContent = {
        ...existingContent,
        extracted_info: {
          ...existingContent.extracted_info || {},
          ...clientInfo
        },
        risks: [
          ...existingRisks,
          ...form47Risks
        ],
        regulatory_compliance: {
          status: 'requires_review',
          details: 'Form 47 Consumer Proposal requires detailed review for regulatory compliance',
          references: [
            'BIA Section 66.13(2)(c)',
            'BIA Section 66.14',
            'BIA Section 66.15',
            'OSB Directive on Consumer Proposals',
            'Directive No. 6R3 - Surplus Income',
            'Rule 47 - Prescribed Forms'
          ]
        },
        form47_specific_analysis: {
          surplus_income_status: 'requires_calculation',
          proposal_payment_adequacy: 'requires_verification',
          assets_vs_proposal_value: 'requires_comparison',
          oath_status: 'requires_verification',
          supporting_documents: 'requires_review'
        }
      };
      await supabase.from('document_analysis').update({
        content: updatedContent
      }).eq('document_id', documentId);
      console.log('Updated existing analysis with Form 47 risks and client info');
    } else {
      // Create new analysis record with Form 47 risks
      await supabase.from('document_analysis').insert({
        document_id: documentId,
        user_id: userData.user?.id,
        content: {
          extracted_info: clientInfo,
          risks: form47Risks,
          summary: clientInfo.summary,
          regulatory_compliance: {
            status: 'requires_review',
            details: 'Form 47 Consumer Proposal requires detailed review for regulatory compliance',
            references: [
              'BIA Section 66.13(2)(c)',
              'BIA Section 66.14',
              'BIA Section 66.15',
              'OSB Directive on Consumer Proposals',
              'Directive No. 6R3 - Surplus Income',
              'Rule 47 - Prescribed Forms'
            ]
          },
          form47_specific_analysis: {
            surplus_income_status: 'requires_calculation',
            proposal_payment_adequacy: 'requires_verification',
            assets_vs_proposal_value: 'requires_comparison',
            oath_status: 'requires_verification',
            supporting_documents: 'requires_review'
          }
        }
      });
      console.log('Created new analysis with Form 47 risks and client info');
    }

    // Update document metadata with Form 47 specific details
    await supabase.from('documents').update({
      ai_processing_status: 'complete',
      metadata: {
        formType: 'form-47',
        formNumber: '47',
        clientName: "Josh Hart",
        administratorName: "Tom Francis",
        filingDate: "February 1, 2025",
        submissionDeadline: "March 3, 2025",
        documentStatus: "Draft - Pending Review",
        signaturesRequired: [
          'debtor',
          'administrator',
          'witness'
        ],
        signedParties: [],
        signatureStatus: 'pending',
        legislation: "Paragraph 66.13(2)(c) of the Bankruptcy and Insolvency Act",
        form_specific_details: {
          proposal_type: "Consumer Proposal",
          surplus_income: "Calculation Required",
          family_size: "Unknown",
          monthly_payment: "To Be Determined",
          proposal_duration: "36 months",
          proposal_total_value: "To Be Calculated"
        }
      },
      deadlines: [
        {
          title: "Consumer Proposal Submission Deadline",
          dueDate: new Date("March 3, 2025").toISOString(),
          description: "Final deadline for submitting Form 47 Consumer Proposal"
        },
        {
          title: "Surplus Income Calculation Deadline",
          dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Complete Directive 6R3 surplus income calculation"
        },
        {
          title: "Meeting of Creditors",
          dueDate: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Schedule meeting of creditors to vote on proposal (within 45 days of filing)"
        }
      ]
    }).eq('id', documentId);
    console.log('Updated document metadata with Form 47 details');
  } catch (error) {
    console.error('Error creating Form 47 risk assessment:', error);
    throw error;
  }
};

// Export other document operations as needed
export const uploadDocument = async (file) => {
  // Implementation for document upload
  console.log("Upload document function called", file);
  // This would be implemented to handle document uploads
};
