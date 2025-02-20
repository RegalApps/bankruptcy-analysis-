
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { documentText, documentId } = await req.json();
    
    console.log('Analyzing document ID:', documentId);

    // Get the document details from Supabase
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      throw new Error('Failed to fetch document details');
    }

    console.log('Document title:', document.title);

    // Analyze the document based on its type
    const formType = document.type || 'unknown';
    const defaultAnalysis = {
      extracted_info: {
        formNumber: detectFormNumber(documentText),
        type: determineDocumentType(documentText, document.title),
        clientName: extractClientName(documentText),
        trusteeName: extractTrusteeName(documentText),
        estateNumber: extractEstateNumber(documentText),
        district: extractDistrict(documentText),
        divisionNumber: extractDivisionNumber(documentText),
        courtNumber: extractCourtNumber(documentText),
        dateBankruptcy: extractDate(documentText, 'bankruptcy'),
        dateSigned: extractDate(documentText, 'signed'),
        officialReceiver: extractOfficialReceiver(documentText),
        summary: generateDocumentSummary(documentText, formType),
        risks: analyzeRisks(documentText, formType)
      }
    };

    // Store the analysis results
    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .upsert({ 
        document_id: documentId,
        user_id: user.id,
        content: defaultAnalysis
      });

    if (analysisError) {
      throw analysisError;
    }

    return new Response(
      JSON.stringify({ success: true, analysis: defaultAnalysis }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions for document analysis
function detectFormNumber(text: string): string {
  const formMatch = text.match(/Form\s+(\d+(\.\d+)?(\([a-zA-Z]\))?)/i);
  return formMatch ? formMatch[1] : '';
}

function determineDocumentType(text: string, title: string): string {
  if (text.toLowerCase().includes('statement of affairs') || title.toLowerCase().includes('form 66')) {
    return 'business_bankruptcy';
  }
  if (text.toLowerCase().includes('proposal') || title.toLowerCase().includes('proposal')) {
    return 'proposal';
  }
  return 'other';
}

function extractClientName(text: string): string {
  const namePatterns = [
    /(?:debtor|client|business)(?:\s+name)?[:]\s*([^\n\r]+)/i,
    /name\s+of\s+(?:debtor|business|bankrupt)[:]\s*([^\n\r]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractTrusteeName(text: string): string {
  const trusteePatterns = [
    /(?:trustee|licensed\s+insolvency\s+trustee)[:]\s*([^\n\r]+)/i,
    /name\s+of\s+(?:trustee|lit)[:]\s*([^\n\r]+)/i
  ];
  
  for (const pattern of trusteePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractEstateNumber(text: string): string {
  const match = text.match(/(?:estate|file)\s*(?:no|number|#)[:.]?\s*(\d+[-\s]?\d*)/i);
  return match ? match[1].trim() : '';
}

function extractDistrict(text: string): string {
  const match = text.match(/district\s*(?:of)?[:.]?\s*([^\n\r]+)/i);
  return match ? match[1].trim() : '';
}

function extractDivisionNumber(text: string): string {
  const match = text.match(/division\s*(?:no|number|#)[:.]?\s*(\d+)/i);
  return match ? match[1].trim() : '';
}

function extractCourtNumber(text: string): string {
  const match = text.match(/court\s*(?:no|number|#|reference)[:.]?\s*(\d+[-\s]?\d*)/i);
  return match ? match[1].trim() : '';
}

function extractDate(text: string, type: 'bankruptcy' | 'signed'): string {
  const datePattern = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}/g;
  const dates = text.match(datePattern) || [];
  
  if (type === 'bankruptcy') {
    const bankruptcyDate = text.match(/date\s+of\s+bankruptcy[:.]?\s*([^\n\r]+)/i);
    return bankruptcyDate ? bankruptcyDate[1].trim() : dates[0] || '';
  } else {
    const signedDate = text.match(/(?:signed|dated)\s+(?:on|at)?[:.]?\s*([^\n\r]+)/i);
    return signedDate ? signedDate[1].trim() : dates[dates.length - 1] || '';
  }
}

function extractOfficialReceiver(text: string): string {
  const match = text.match(/official\s+receiver[:.]?\s*([^\n\r]+)/i);
  return match ? match[1].trim() : '';
}

function generateDocumentSummary(text: string, formType: string): string {
  const typeDescriptions: Record<string, string> = {
    'business_bankruptcy': `Business Bankruptcy Document
This document appears to be related to a business bankruptcy filing. It contains important information about the bankrupt business, including financial details, creditor information, and procedural requirements under the Bankruptcy and Insolvency Act.`,
    'proposal': `Bankruptcy Proposal Document
This document outlines a proposal to creditors under the Bankruptcy and Insolvency Act. It contains terms and conditions for debt repayment or restructuring.`,
    'other': `Legal Document
This document appears to be a legal form related to bankruptcy or insolvency proceedings. Please review carefully for specific requirements and deadlines.`
  };

  return typeDescriptions[formType] || typeDescriptions['other'];
}

function analyzeRisks(text: string, formType: string): Array<{
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}> {
  const risks = [];

  // Check for common risks based on document type
  if (formType === 'business_bankruptcy') {
    // Check for missing financial statements
    if (!text.toLowerCase().includes('financial statement') && !text.toLowerCase().includes('balance sheet')) {
      risks.push({
        type: "Missing Financial Documentation",
        description: "Required financial statements appear to be missing from the filing",
        severity: "high",
        regulation: "BIA Section 49(1) - Statement of Affairs requirements",
        impact: "Incomplete filing may be rejected by the court or cause delays",
        requiredAction: "Obtain and attach all required financial statements",
        solution: "Work with the debtor to prepare comprehensive financial statements including assets, liabilities, income, and expenses"
      });
    }

    // Check for creditor information
    if (!text.toLowerCase().includes('creditor') || !text.toLowerCase().includes('claim')) {
      risks.push({
        type: "Incomplete Creditor Information",
        description: "Creditor details or claim amounts may be missing or incomplete",
        severity: "medium",
        regulation: "BIA Section 50(2) - Proper disclosure of creditors",
        impact: "Creditors may be omitted from proceedings",
        requiredAction: "Review and complete creditor information",
        solution: "Compile comprehensive list of all creditors with claim amounts and contact details"
      });
    }
  }

  // Check for signatures and dates
  if (!text.match(/signed|signature/i) || !text.match(/dated|date/i)) {
    risks.push({
      type: "Missing Signatures or Dates",
      description: "Required signatures or dates appear to be missing",
      severity: "high",
      regulation: "BIA General Rules - Document execution requirements",
      impact: "Document may be invalid or rejected",
      requiredAction: "Obtain necessary signatures and dates",
      solution: "Review signature requirements and ensure all parties have properly executed the document"
    });
  }

  // Add default low-risk item for normal verification
  risks.push({
    type: "Standard Verification Required",
    description: "Regular verification of document contents needed",
    severity: "low",
    regulation: "BIA General Practice",
    impact: "Ensure accuracy and completeness",
    requiredAction: "Review document contents",
    solution: "Perform standard verification of all information and cross-reference with supporting documents"
  });

  return risks;
}
