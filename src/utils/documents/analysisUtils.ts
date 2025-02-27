
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

export const performMockAnalysis = (): AnalysisResult => {
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
