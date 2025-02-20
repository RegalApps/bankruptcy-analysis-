
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
    // Get the user from the authorization header
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user's ID from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { documentText, documentId } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText?.length });

    if (!documentText) {
      throw new Error('No document text provided');
    }

    // Document Type and Form Number Detection
    const formMatch = documentText.match(/Form\s+(\d+(\.\d+)?(\([a-zA-Z]\))?)/i);
    const formNumber = formMatch ? formMatch[1] : '';
    
    // Determine document type and generate appropriate summary
    const documentType = determineDocumentType(documentText);
    const summary = generateDetailedSummary(documentText, documentType);

    // Extract all relevant information
    const extractedInfo = {
      type: documentType,
      formNumber: formNumber,
      clientName: extractPersonInfo(documentText, 'client'),
      trusteeName: extractPersonInfo(documentText, 'trustee'),
      estateNumber: extractEstateNumber(documentText),
      district: extractDistrict(documentText),
      divisionNumber: extractDivisionNumber(documentText),
      courtNumber: extractCourtNumber(documentText),
      meetingOfCreditors: extractMeetingInfo(documentText),
      chairInfo: extractChairInfo(documentText),
      securityInfo: extractSecurityInfo(documentText),
      dateBankruptcy: extractDate(documentText, 'bankruptcy'),
      dateSigned: extractDate(documentText, 'signed'),
      officialReceiver: extractOfficialReceiver(documentText),
      summary: summary,
      risks: analyzeRisksAndCompliance(documentText, documentType, formNumber)
    };

    console.log('Extracted information:', extractedInfo);

    // Store analysis results with user_id
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id, // Add the user_id here
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

function determineDocumentType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('statement of affairs') || lowerText.includes('form 78')) {
    return 'Statement of Affairs';
  }
  if (lowerText.includes('notice of bankruptcy') || lowerText.includes('form 68')) {
    return 'Notice of Bankruptcy';
  }
  if (lowerText.includes('proposal') || lowerText.includes('form 92')) {
    return 'Consumer Proposal';
  }
  if (lowerText.includes('meeting of creditors') || lowerText.includes('form 67')) {
    return 'Meeting Notice';
  }
  return 'Other';
}

function generateDetailedSummary(text: string, type: string): string {
  const summaryTemplates: Record<string, string> = {
    'Statement of Affairs': `This Statement of Affairs document provides a comprehensive financial disclosure of the debtor's assets, liabilities, income, and expenses as required under the Bankruptcy and Insolvency Act. It serves as a sworn declaration of the debtor's financial position at the time of filing.`,
    'Notice of Bankruptcy': `This Notice of Bankruptcy formally declares the commencement of bankruptcy proceedings under the BIA. It includes essential details about the bankruptcy filing, the appointed Licensed Insolvency Trustee, and important deadlines for creditors.`,
    'Consumer Proposal': `This Consumer Proposal document outlines the terms offered to creditors for debt resolution under the BIA. It details the proposed payment plan, timeline, and conditions for debt settlement.`,
    'Meeting Notice': `This document provides notice of a Meeting of Creditors, scheduled as required by the BIA. It includes details about the meeting time, location, and agenda for discussing the bankruptcy or proposal proceedings.`,
    'Other': `This document appears to be related to insolvency proceedings under the Bankruptcy and Insolvency Act. Please review carefully for specific requirements and deadlines.`
  };

  return summaryTemplates[type] || summaryTemplates['Other'];
}

function extractPersonInfo(text: string, type: 'client' | 'trustee'): string {
  const patterns = {
    client: [
      /(?:debtor|bankrupt|client)(?:\s+name)?[:]\s*([^\n\r]+)/i,
      /name\s+of\s+(?:debtor|bankrupt)[:]\s*([^\n\r]+)/i
    ],
    trustee: [
      /(?:trustee|licensed\s+insolvency\s+trustee)[:]\s*([^\n\r]+)/i,
      /name\s+of\s+(?:trustee|lit)[:]\s*([^\n\r]+)/i
    ]
  };

  for (const pattern of patterns[type]) {
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

function extractMeetingInfo(text: string): string {
  const datePattern = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}/;
  const timePattern = /\d{1,2}[:]\d{2}\s*(?:am|pm|AM|PM)?/;
  
  const meetingMatch = text.match(new RegExp(`meeting\\s+of\\s+creditors.*?(?:${datePattern.source}).*?(?:${timePattern.source})`, 'i'));
  return meetingMatch ? meetingMatch[0].trim() : '';
}

function extractChairInfo(text: string): string {
  const match = text.match(/chair(?:person)?[:]\s*([^\n\r]+)/i);
  return match ? match[1].trim() : '';
}

function extractSecurityInfo(text: string): string {
  const match = text.match(/security(?:\s+details)?[:]\s*([^\n\r]+)/i);
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

function analyzeRisksAndCompliance(text: string, documentType: string, formNumber: string): Array<{
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}> {
  const risks = [];

  // Check for missing essential information based on document type
  const essentialFields = {
    'Statement of Affairs': [
      { field: 'assets', pattern: /assets?|property|possessions/i },
      { field: 'liabilities', pattern: /liabilit(?:y|ies)|debts?/i },
      { field: 'income', pattern: /income|earnings|salary/i },
      { field: 'expenses', pattern: /expenses?|costs?|spending/i }
    ],
    'Notice of Bankruptcy': [
      { field: 'estate number', pattern: /estate\s*(?:no|number|#)/i },
      { field: 'date of bankruptcy', pattern: /date\s+of\s+bankruptcy/i },
      { field: 'trustee information', pattern: /trustee|licensed\s+insolvency\s+trustee/i }
    ],
    'Consumer Proposal': [
      { field: 'proposal terms', pattern: /terms?|conditions?|offers?/i },
      { field: 'payment plan', pattern: /payment|installments?|schedule/i },
      { field: 'creditor information', pattern: /creditors?|claims?/i }
    ]
  };

  // Check form-specific requirements
  if (documentType in essentialFields) {
    essentialFields[documentType].forEach(({ field, pattern }) => {
      if (!pattern.test(text)) {
        risks.push({
          type: `Missing ${field}`,
          description: `Required ${field} information is not found in the document`,
          severity: 'high',
          regulation: `BIA Section 49(1) - Complete disclosure requirements`,
          impact: `Incomplete filing may be rejected or cause delays`,
          requiredAction: `Add missing ${field} information`,
          solution: `Update the document to include complete ${field} details as required by the BIA`
        });
      }
    });
  }

  // Check for signatures
  if (!text.match(/signed|signature/i)) {
    risks.push({
      type: "Missing Signatures",
      description: "Required signatures not found in the document",
      severity: "high",
      regulation: "BIA Rules 65-66 - Document execution requirements",
      impact: "Document may be invalid or rejected",
      requiredAction: "Obtain necessary signatures",
      solution: "Ensure all required parties sign the document in the designated areas"
    });
  }

  // Check for dates
  if (!text.match(/dated|date/i)) {
    risks.push({
      type: "Missing Dates",
      description: "Required dates not properly documented",
      severity: "medium",
      regulation: "BIA Documentation Requirements",
      impact: "May affect timing of proceedings",
      requiredAction: "Add relevant dates",
      solution: "Include all required dates, especially filing and signature dates"
    });
  }

  // Check for creditor information
  if (text.toLowerCase().includes('creditor') && !text.match(/amount|claim|debt/i)) {
    risks.push({
      type: "Incomplete Creditor Information",
      description: "Creditor details or claim amounts may be missing",
      severity: "medium",
      regulation: "BIA Section 50(2) - Proper disclosure of creditors",
      impact: "Creditors may be omitted from proceedings",
      requiredAction: "Complete creditor information",
      solution: "Add detailed creditor information including claim amounts"
    });
  }

  // Add standard verification risk
  risks.push({
    type: "Standard Verification Required",
    description: "Regular verification of document contents needed",
    severity: "low",
    regulation: "BIA General Practice",
    impact: "Ensure accuracy and completeness",
    requiredAction: "Review document contents",
    solution: "Perform standard verification of all information"
  });

  return risks;
}
