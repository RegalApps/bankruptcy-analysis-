
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
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { documentText, documentId } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText?.length });

    if (!documentText) {
      throw new Error('No document text provided');
    }

    // First identify the form number for specific processing
    const formMatch = documentText.match(/Form\s+(\d+(\.\d+)?(\([a-zA-Z]\))?)/i);
    const formNumber = formMatch ? formMatch[1] : '';
    
    // Extract information based on specific form types
    let extractedInfo;
    
    if (formNumber.startsWith('66')) {
      // Form 66 - Notice of Mediation
      extractedInfo = extractForm66Info(documentText);
    } else if (formNumber.startsWith('67')) {
      // Form 67 - Notice of Meeting of Creditors
      extractedInfo = extractForm67Info(documentText);
    } else if (formNumber.startsWith('68')) {
      // Form 68 - Notice of Bankruptcy
      extractedInfo = extractForm68Info(documentText);
    } else if (formNumber.startsWith('78')) {
      // Form 78 - Statement of Affairs
      extractedInfo = extractForm78Info(documentText);
    } else if (formNumber.startsWith('92')) {
      // Form 92 - Notice to Creditor of Consumer Proposal
      extractedInfo = extractForm92Info(documentText);
    } else {
      // Generic extraction for unknown forms
      extractedInfo = extractGenericFormInfo(documentText);
    }

    // Add form number to extracted info
    extractedInfo.formNumber = formNumber;

    console.log('Extracted information:', extractedInfo);

    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) throw analysisError;

    return new Response(
      JSON.stringify({ success: true, analysis: extractedInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function extractForm66Info(text: string) {
  // Form 66 - Notice of Mediation
  const toMatch = text.match(/To:\s*([^\n\r,]+)/);
  const clientName = toMatch ? toMatch[1].trim() : '';
  
  const dateMatch = text.match(/Date:\s*([^\n\r]+)/);
  const dateSigned = dateMatch ? dateMatch[1].trim() : '';

  const trusteeMatch = text.match(/(?:trustee|licensed\s+insolvency\s+trustee)[:]\s*([^\n\r]+)/i);
  const trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  return {
    type: 'Notice of Mediation',
    clientName,
    trusteeName,
    dateSigned,
    summary: `This Notice of Mediation (Form 66) is addressed to ${clientName}. It serves as an official notification for mediation proceedings under the Bankruptcy and Insolvency Act, providing details about the mediation process and requirements.`,
    risks: analyzeForm66Risks(text, { clientName, dateSigned, trusteeName })
  };
}

function extractForm67Info(text: string) {
  // Form 67 - Notice of Meeting of Creditors
  const dateMatch = text.match(/meeting\s+of\s+creditors.*?on\s+([^\n\r]+)/i);
  const meetingOfCreditors = dateMatch ? dateMatch[1].trim() : '';
  
  const clientMatch = text.match(/(?:debtor|bankrupt)[:]\s*([^\n\r]+)/i);
  const clientName = clientMatch ? clientMatch[1].trim() : '';

  return {
    type: 'Meeting of Creditors',
    clientName,
    meetingOfCreditors,
    summary: `This Notice of Meeting of Creditors (Form 67) schedules a meeting for ${clientName}'s case on ${meetingOfCreditors}. The meeting allows creditors to discuss the bankruptcy/proposal and make decisions regarding the estate.`,
    risks: analyzeForm67Risks(text, { clientName, meetingOfCreditors })
  };
}

function extractForm68Info(text: string) {
  // Form 68 - Notice of Bankruptcy
  const clientMatch = text.match(/(?:debtor|bankrupt)[:]\s*([^\n\r]+)/i);
  const clientName = clientMatch ? clientMatch[1].trim() : '';
  
  const dateMatch = text.match(/date\s+of\s+bankruptcy[:]\s*([^\n\r]+)/i);
  const dateBankruptcy = dateMatch ? dateMatch[1].trim() : '';

  const estateMatch = text.match(/estate\s*(?:no|number|#)[:.]?\s*(\d+[-\s]?\d*)/i);
  const estateNumber = estateMatch ? estateMatch[1].trim() : '';

  return {
    type: 'Notice of Bankruptcy',
    clientName,
    dateBankruptcy,
    estateNumber,
    summary: `This Notice of Bankruptcy (Form 68) formally declares the bankruptcy of ${clientName}, Estate No. ${estateNumber}, filed on ${dateBankruptcy}. This document initiates the bankruptcy proceedings under the BIA.`,
    risks: analyzeForm68Risks(text, { clientName, dateBankruptcy, estateNumber })
  };
}

function extractForm78Info(text: string) {
  // Form 78 - Statement of Affairs
  const clientMatch = text.match(/(?:debtor|bankrupt)[:]\s*([^\n\r]+)/i);
  const clientName = clientMatch ? clientMatch[1].trim() : '';
  
  const dateMatch = text.match(/dated\s+(?:this)?\s*([^\n\r]+)/i);
  const dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return {
    type: 'Statement of Affairs',
    clientName,
    dateSigned,
    summary: `This Statement of Affairs (Form 78) filed by ${clientName} on ${dateSigned} provides a comprehensive disclosure of assets, liabilities, income, and expenses as required for bankruptcy proceedings.`,
    risks: analyzeForm78Risks(text, { clientName, dateSigned })
  };
}

function extractForm92Info(text: string) {
  // Form 92 - Notice to Creditor
  const clientMatch = text.match(/(?:debtor|consumer)[:]\s*([^\n\r]+)/i);
  const clientName = clientMatch ? clientMatch[1].trim() : '';
  
  const trusteeMatch = text.match(/(?:trustee|administrator)[:]\s*([^\n\r]+)/i);
  const trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  return {
    type: 'Consumer Proposal',
    clientName,
    trusteeName,
    summary: `This Notice to Creditor (Form 92) outlines the consumer proposal of ${clientName}, administered by ${trusteeName}. It details the terms offered to creditors for debt resolution under the BIA.`,
    risks: analyzeForm92Risks(text, { clientName, trusteeName })
  };
}

function extractGenericFormInfo(text: string) {
  // Generic form extraction
  const clientMatch = text.match(/(?:debtor|bankrupt|client)[:]\s*([^\n\r]+)/i);
  const clientName = clientMatch ? clientMatch[1].trim() : '';
  
  const dateMatch = text.match(/dated?\s*[:]\s*([^\n\r]+)/i);
  const dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return {
    type: 'Other',
    clientName,
    dateSigned,
    summary: 'This document appears to be related to insolvency proceedings. Please verify the form type and requirements.',
    risks: analyzeGenericRisks(text, { clientName, dateSigned })
  };
}

function analyzeForm66Risks(text: string, data: any) {
  const risks = [];
  
  if (!data.clientName) {
    risks.push({
      type: "Missing Recipient",
      description: "The recipient's name is not clearly specified",
      severity: "high",
      regulation: "BIA Mediation Requirements",
      impact: "May affect proper service of notice",
      requiredAction: "Add recipient name",
      solution: "Ensure the 'To:' field clearly specifies the recipient"
    });
  }

  if (!text.includes('mediation')) {
    risks.push({
      type: "Missing Mediation Details",
      description: "Mediation information not clearly specified",
      severity: "high",
      regulation: "BIA Mediation Process Requirements",
      impact: "Could invalidate mediation notice",
      requiredAction: "Add mediation details",
      solution: "Include complete mediation process information"
    });
  }

  return risks;
}

function analyzeForm67Risks(text: string, data: any) {
  const risks = [];
  
  if (!data.meetingOfCreditors) {
    risks.push({
      type: "Missing Meeting Details",
      description: "Meeting date and time not specified",
      severity: "high",
      regulation: "BIA Section 102 - Meetings of Creditors",
      impact: "Creditors cannot attend without proper notice",
      requiredAction: "Add meeting details",
      solution: "Include complete meeting date, time, and location"
    });
  }

  return risks;
}

function analyzeForm68Risks(text: string, data: any) {
  const risks = [];

  if (!data.dateBankruptcy) {
    risks.push({
      type: "Missing Bankruptcy Date",
      description: "Date of bankruptcy not specified",
      severity: "high",
      regulation: "BIA Section 49(2)",
      impact: "Critical date for proceedings timeline",
      requiredAction: "Add bankruptcy date",
      solution: "Include the official date of bankruptcy"
    });
  }

  return risks;
}

function analyzeForm78Risks(text: string, data: any) {
  const risks = [];

  if (!text.includes('assets') || !text.includes('liabilities')) {
    risks.push({
      type: "Incomplete Financial Information",
      description: "Assets or liabilities section may be incomplete",
      severity: "high",
      regulation: "BIA Section 158(d)",
      impact: "Incomplete disclosure may affect proceedings",
      requiredAction: "Complete financial disclosure",
      solution: "Ensure all assets and liabilities are listed"
    });
  }

  return risks;
}

function analyzeForm92Risks(text: string, data: any) {
  const risks = [];

  if (!text.includes('proposal') || !text.includes('terms')) {
    risks.push({
      type: "Missing Proposal Terms",
      description: "Proposal terms not clearly outlined",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "Creditors cannot assess the proposal",
      requiredAction: "Add proposal terms",
      solution: "Include complete terms of the consumer proposal"
    });
  }

  return risks;
}

function analyzeGenericRisks(text: string, data: any) {
  const risks = [];

  // Only add risks that are actually present
  if (!data.clientName || !data.dateSigned) {
    risks.push({
      type: "Missing Essential Information",
      description: "Basic document information is incomplete",
      severity: "medium",
      regulation: "BIA Documentation Requirements",
      impact: "May affect document validity",
      requiredAction: "Complete missing information",
      solution: "Add all required basic information"
    });
  }

  return risks;
}
