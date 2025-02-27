
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

export interface AnalysisResult {
  extracted_info: {
    formNumber: string;
    clientName: string;
    dateSigned: string;
    trusteeName: string;
    type: string;
    summary: string;
    clientAddress?: string;
    clientPhone?: string;
    clientEmail?: string;
    trusteeAddress?: string;
    trusteePhone?: string;
    trusteeEmail?: string;
    totalDebts?: string;
    totalAssets?: string;
    monthlyIncome?: string;
  };
  risks: Array<{
    type: string;
    description: string;
    severity: string;
    regulation: string;
    impact: string;
    requiredAction: string;
    solution: string;
    deadline: string;
  }>;
  regulatory_compliance: {
    status: string;
    details: string;
    references: string[];
  };
}

export const triggerDocumentAnalysis = async (documentId: string) => {
  try {
    const { error } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId, 
        includeRegulatory: true,
        includeClientExtraction: true,
        extractionMode: 'comprehensive'
      }
    });

    if (error) {
      console.error('Error triggering document analysis:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to trigger document analysis:', error);
    throw error;
  }
};

export const performMockAnalysis = (formNumber = '76', formType = 'bankruptcy'): AnalysisResult => {
  // Get form number from the title or default to 76
  const formNum = formNumber || '76';
  const formTypeLower = formType.toLowerCase();
  
  // Choose the right mock data based on form number
  if (formNum === '66' || formTypeLower.includes('consumer proposal')) {
    return getMockForm66Data();
  } else if (formNum === '65' || formTypeLower.includes('notice of intention')) {
    return getMockForm65Data();
  } else {
    // Default to Form 76 for bankruptcy
    return getMockForm76Data();
  }
};

const getMockForm76Data = (): AnalysisResult => {
  // Enhanced mock data for Form 76 analysis with more detailed client information
  return {
    extracted_info: {
      formNumber: "Form 76",
      clientName: "Reginald Dickerson",
      clientAddress: "123 Main Street, Toronto, ON M4C 1B5",
      clientPhone: "(416) 555-1234",
      clientEmail: "reginald.dickerson@example.com",
      dateSigned: "February 22, 2025",
      trusteeName: "Gradey Henderson",
      trusteeAddress: "456 Bay Street, Suite 1200, Toronto, ON M5H 2R8",
      trusteePhone: "(416) 555-9876",
      trusteeEmail: "g.henderson@trustee-firm.ca",
      type: "bankruptcy",
      totalDebts: "$45,000",
      totalAssets: "$12,500",
      monthlyIncome: "$3,200",
      summary: "This is a bankruptcy form (Form 76) for Reginald Dickerson. The form was submitted on February 22, 2025. The trustee assigned to this case is Gradey Henderson. The client has total debts of $45,000 and total assets valued at $12,500."
    },
    risks: [
      {
        type: "Missing Financial Details",
        description: "There are no income, assets, liabilities, or creditor details present in the extracted information.",
        severity: "high",
        regulation: "BIA Reference: Section 158(a) requires a debtor to disclose full financial affairs to the trustee. Directive Reference: OSB Directive No. 6R3 states the requirement to file a Statement of Affairs.",
        impact: "May delay the bankruptcy process and lead to rejection of filing.",
        requiredAction: "Submit complete financial disclosure within 5 days.",
        solution: "Attach a Statement of Affairs with required financial details.",
        deadline: "5 days"
      },
      {
        type: "Lack of Required Signatures",
        description: "The form does not indicate whether it has been signed by the debtor or trustee.",
        severity: "medium",
        regulation: "BIA Reference: Section 50.4(8) mandates signatures for formal insolvency proceedings. Directive Reference: OSB Form Guidelines state that official documents must have authenticated signatures.",
        impact: "Document may be considered invalid without proper signatures.",
        requiredAction: "Obtain signatures before next trustee meeting.",
        solution: "Use digital signing (e.g., DocuSign API integration).",
        deadline: "3 days"
      },
      {
        type: "No Creditor Information Provided",
        description: "There is no evidence of creditor claims or liabilities.",
        severity: "high",
        regulation: "BIA Reference: Section 158(c) states that a debtor must disclose all creditors and amounts owed. Directive Reference: OSB Directive No. 11 outlines creditor claim procedures.",
        impact: "Creditors may not be properly notified of proceedings.",
        requiredAction: "Submit creditor details within 3 days.",
        solution: "Use OCR and AI-driven form processing to extract financial details from bank statements.",
        deadline: "3 days"
      },
      {
        type: "No Mention of Assets or Exemptions",
        description: "There is no declaration of assets, which is critical for determining surplus income and potential liquidation.",
        severity: "medium",
        regulation: "BIA Reference: Section 67(1) discusses the division of assets under bankruptcy. Directive Reference: OSB Directive No. 11R2 details asset disclosure requirements.",
        impact: "May result in improper handling of debtor assets.",
        requiredAction: "Disclose assets before initial bankruptcy assessment.",
        solution: "Automate asset tracking through the CRM system.",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "non_compliant",
      details: "This document does not meet BIA compliance requirements due to missing financial details, signatures, creditor information, and asset disclosures.",
      references: [
        "BIA Section 158(a) - Disclosure of financial affairs",
        "OSB Directive No. 6R3 - Statement of Affairs requirements",
        "BIA Section 50.4(8) - Signature requirements",
        "OSB Directive No. 11 - Creditor claim procedures"
      ]
    }
  };
};

const getMockForm66Data = (): AnalysisResult => {
  // Mock data for Form 66 (Consumer Proposal)
  return {
    extracted_info: {
      formNumber: "Form 66",
      clientName: "Emily Cartwright",
      clientAddress: "87 Riverside Drive, Vancouver, BC V6G 1A2",
      clientPhone: "(604) 555-7890",
      clientEmail: "e.cartwright@email.com",
      dateSigned: "March 15, 2025",
      trusteeName: "Patrick Wilkinson",
      trusteeAddress: "1200 West Georgia Street, Suite 800, Vancouver, BC V6E 4R2",
      trusteePhone: "(604) 555-2345",
      trusteeEmail: "p.wilkinson@trustee-partners.ca",
      type: "consumer proposal",
      totalDebts: "$62,500",
      totalAssets: "$28,000",
      monthlyIncome: "$4,100",
      summary: "This is a consumer proposal (Form 66) for Emily Cartwright. The proposal was filed on March 15, 2025, with Patrick Wilkinson as the administrator. The client's total debts are $62,500 with assets of $28,000. The proposed monthly payment is $850 for 60 months."
    },
    risks: [
      {
        type: "Incomplete Proposal Terms",
        description: "The proposal does not clearly outline all required payment terms and conditions.",
        severity: "high",
        regulation: "BIA Reference: Section 66.13(2) requires specific terms for proposals. Directive Reference: OSB Directive No. 5R3 outlines required proposal content.",
        impact: "Creditors may reject the proposal due to unclear terms.",
        requiredAction: "Submit complete proposal terms within 10 days.",
        solution: "Implement a proposal template with mandatory fields for all required terms.",
        deadline: "10 days"
      },
      {
        type: "Missing Creditor Classifications",
        description: "Creditors are not properly classified according to their status and security.",
        severity: "medium",
        regulation: "BIA Reference: Section 66.11 discusses classification of creditors. Directive Reference: OSB Directive No. 5R3 details creditor classification requirements.",
        impact: "May complicate the voting process and lead to disputes.",
        requiredAction: "Properly classify all creditors before the creditors' meeting.",
        solution: "Use AI-assisted creditor classification based on claim documentation.",
        deadline: "15 days"
      },
      {
        type: "Cash Flow Sustainability Issues",
        description: "The proposed payments may not be sustainable given the client's income and expenses.",
        severity: "high",
        regulation: "BIA Reference: Section 66.12(5) requires administrator assessment of proposal viability. Directive Reference: OSB Directive No. 6R2 on assessment standards.",
        impact: "High risk of proposal failure and conversion to bankruptcy.",
        requiredAction: "Conduct a detailed budget assessment with the client.",
        solution: "Implement budget monitoring tools with automated alerts for potential sustainability issues.",
        deadline: "7 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_review",
      details: "This consumer proposal requires review to ensure compliance with BIA requirements for proposal content, creditor classification, and financial sustainability.",
      references: [
        "BIA Section 66.13(2) - Required proposal content",
        "OSB Directive No. 5R3 - Consumer proposal requirements",
        "BIA Section 66.12(5) - Administrator's assessment duties",
        "OSB Directive No. 6R2 - Assessment standards"
      ]
    }
  };
};

const getMockForm65Data = (): AnalysisResult => {
  // Mock data for Form 65 (Notice of Intention)
  return {
    extracted_info: {
      formNumber: "Form 65",
      clientName: "Jasper Technologies Inc.",
      clientAddress: "400 King Street West, Toronto, ON M5V 1K4",
      clientPhone: "(416) 555-8765",
      clientEmail: "legal@jaspertech.com",
      dateSigned: "January 10, 2025",
      trusteeName: "Miranda Chen",
      trusteeAddress: "200 Bay Street, Suite 3000, Toronto, ON M5J 2J2",
      trusteePhone: "(416) 555-3412",
      trusteeEmail: "m.chen@restructure-partners.ca",
      type: "notice of intention",
      totalDebts: "$1,850,000",
      totalAssets: "$1,200,000",
      summary: "This is a Notice of Intention to Make a Proposal (Form 65) filed by Jasper Technologies Inc. on January 10, 2025. The notice was filed with Miranda Chen as the proposal trustee. The company has reported total liabilities of $1,850,000 and assets valued at $1,200,000."
    },
    risks: [
      {
        type: "Tight Timeline for Proposal",
        description: "The company has only 30 days to file a proposal, which may be insufficient given the complexity of its business.",
        severity: "high",
        regulation: "BIA Reference: Section 50.4(8) sets the initial 30-day timeline. Directive Reference: OSB Directive No. 32R2 on proposal procedures.",
        impact: "Failure to file within the timeline could result in automatic bankruptcy.",
        requiredAction: "Consider applying for an extension before day 25.",
        solution: "Implement automated timeline tracking with court deadline alerts.",
        deadline: "25 days"
      },
      {
        type: "Incomplete Creditor List",
        description: "The creditor list appears to be missing several trade creditors mentioned in the financial statements.",
        severity: "high",
        regulation: "BIA Reference: Section 50(2) requires a complete list of creditors. Directive Reference: OSB Directive No. 32R2 details creditor disclosure requirements.",
        impact: "Creditors may challenge the process if not properly notified.",
        requiredAction: "Submit a complete creditor list within 7 days.",
        solution: "Use accounting system integration to automatically compile creditor lists.",
        deadline: "7 days"
      },
      {
        type: "Cash Flow Concerns",
        description: "The projected cash flow statement shows potential liquidity issues in the next 60 days.",
        severity: "medium",
        regulation: "BIA Reference: Section 50.4(2)(c) requires a cash flow statement. Directive Reference: OSB Directive No. 32R2 on cash flow requirements.",
        impact: "May compromise the company's ability to continue operations during the proposal period.",
        requiredAction: "Develop a liquidity management plan.",
        solution: "Implement rolling 13-week cash flow forecasting with variance analysis.",
        deadline: "14 days"
      }
    ],
    regulatory_compliance: {
      status: "requires_immediate_action",
      details: "This Notice of Intention filing requires immediate action to address timeline constraints, creditor disclosure issues, and cash flow concerns to ensure BIA compliance.",
      references: [
        "BIA Section 50.4(8) - Timeline for filing proposal",
        "OSB Directive No. 32R2 - Proposal procedures",
        "BIA Section 50(2) - Creditor disclosure requirements",
        "BIA Section 50.4(2)(c) - Cash flow statement requirements"
      ]
    }
  };
};

export const saveAnalysisResults = async (
  documentId: string, 
  userId: string, 
  analysisData: AnalysisResult
) => {
  const { error } = await supabase
    .from('document_analysis')
    .insert([{
      document_id: documentId,
      user_id: userId,
      content: analysisData
    }]);

  if (error) {
    logger.error('Error saving analysis results:', error);
    throw error;
  }
  
  logger.info('Analysis results saved successfully for document ID:', documentId);
};

export const updateDocumentStatus = async (
  documentId: string, 
  status: 'processing' | 'complete' | 'failed'
) => {
  const { error } = await supabase
    .from('documents')
    .update({ ai_processing_status: status })
    .eq('id', documentId);
    
  if (error) {
    logger.error(`Error updating document status to ${status}:`, error);
    throw error;
  }
  
  logger.info(`Document status updated to ${status} for document ID:`, documentId);
};

export const createClientIfNotExists = async (clientInfo: any) => {
  if (!clientInfo?.clientName) {
    return null;
  }
  
  try {
    // Check if client already exists
    const { data: existingClients, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .ilike('name', clientInfo.clientName)
      .limit(1);
      
    if (checkError) throw checkError;
    
    // If client exists, return their ID
    if (existingClients && existingClients.length > 0) {
      return existingClients[0].id;
    }
    
    // Create new client
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name: clientInfo.clientName,
        email: clientInfo.clientEmail || null,
        phone: clientInfo.clientPhone || null,
        metadata: {
          address: clientInfo.clientAddress || null,
          totalDebts: clientInfo.totalDebts || null,
          totalAssets: clientInfo.totalAssets || null,
          monthlyIncome: clientInfo.monthlyIncome || null
        }
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    logger.info(`Created new client with ID: ${newClient.id}`);
    return newClient.id;
  } catch (error) {
    logger.error('Error creating client:', error);
    return null;
  }
};
