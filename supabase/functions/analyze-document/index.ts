
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentAnalysis {
  extracted_info: {
    type: string;
    formNumber: string;
    clientName?: string;
    dateSigned?: string;
    trusteeName?: string;
    estateNumber?: string;
    district?: string;
    divisionNumber?: string;
    courtNumber?: string;
    meetingOfCreditors?: string;
    chairInfo?: string;
    securityInfo?: string;
    dateBankruptcy?: string;
    officialReceiver?: string;
    summary: string;
  };
  risks: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    regulation?: string;
    impact: string;
    requiredAction: string;
    solution: string;
  }>;
}

function analyzeDocument(text: string): DocumentAnalysis {
  // Initialize the analysis result
  const analysis: DocumentAnalysis = {
    extracted_info: {
      type: 'unknown',
      formNumber: '',
      summary: '',
    },
    risks: []
  };

  // Identify form type and number
  const formMatches = text.match(/FORM (\d+)|Form (\d+)/);
  if (formMatches) {
    const formNumber = formMatches[1] || formMatches[2];
    analysis.extracted_info.formNumber = formNumber;
    
    // Determine form type based on content
    if (text.includes('Notice to Bankrupt of Meeting of Creditors')) {
      analysis.extracted_info.type = 'meeting';
      analysis.extracted_info.summary = 'Notice regarding a meeting of creditors for bankruptcy proceedings';
    } else if (text.includes('Certificate of Assignment')) {
      analysis.extracted_info.type = 'assignment';
      analysis.extracted_info.summary = 'Certificate confirming the assignment of bankruptcy';
    } else if (text.includes('Consumer Proposal')) {
      analysis.extracted_info.type = 'proposal';
      analysis.extracted_info.summary = 'Consumer proposal document for debt restructuring';
    }
  }

  // Extract client name
  const nameMatch = text.match(/(?:debtor|bankrupt|client):\s*([^\n\r.]+)/i);
  if (nameMatch) {
    analysis.extracted_info.clientName = nameMatch[1].trim();
  }

  // Extract date signed
  const dateMatch = text.match(/(?:dated|signed on|date:)\s*([^\n\r.]+)/i);
  if (dateMatch) {
    analysis.extracted_info.dateSigned = dateMatch[1].trim();
  }

  // Extract trustee information
  const trusteeMatch = text.match(/(?:trustee|licensed insolvency trustee):\s*([^\n\r.]+)/i);
  if (trusteeMatch) {
    analysis.extracted_info.trusteeName = trusteeMatch[1].trim();
  }

  // Generate risks based on form type and content
  if (analysis.extracted_info.type === 'meeting') {
    analysis.risks.push({
      type: 'Deadline Risk',
      description: 'Meeting of creditors must be held within specified timeframe',
      severity: 'high',
      regulation: 'Bankruptcy and Insolvency Act, Section 102',
      impact: 'Failure to hold meeting within required timeframe may result in procedural delays',
      requiredAction: 'Schedule and conduct meeting within required timeframe',
      solution: 'Set up meeting notifications and calendar reminders'
    });
  }

  if (!analysis.extracted_info.clientName) {
    analysis.risks.push({
      type: 'Documentation Risk',
      description: 'Missing or unclear client identification',
      severity: 'high',
      impact: 'May cause legal or procedural issues',
      requiredAction: 'Verify and add proper client identification',
      solution: 'Review document and add clear client identification'
    });
  }

  // Add general compliance risk
  analysis.risks.push({
    type: 'Compliance Risk',
    description: 'Regular review required to ensure ongoing compliance',
    severity: 'medium',
    impact: 'Potential non-compliance with regulatory requirements',
    requiredAction: 'Schedule regular compliance reviews',
    solution: 'Implement automated compliance checking system'
  });

  console.log('Analysis completed:', analysis);
  return analysis;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();

    if (!documentText || !documentId) {
      throw new Error('Missing required parameters: documentText or documentId');
    }

    console.log('Starting document analysis for document:', documentId);
    console.log('Document text length:', documentText.length);

    // Analyze the document
    const analysisResult = analyzeDocument(documentText);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user who owns the document
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('user_id')
      .eq('id', documentId)
      .single();

    if (docError) {
      console.error('Error fetching document:', docError);
      throw docError;
    }

    // Save analysis results
    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: document.user_id,
        content: analysisResult
      });

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis saved successfully for document:', documentId);

    return new Response(
      JSON.stringify({ message: 'Analysis completed', result: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
