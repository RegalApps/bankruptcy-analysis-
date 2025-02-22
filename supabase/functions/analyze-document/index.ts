
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
  regulation: string;
  requiredAction: string;
  solution: string;
}

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
  risks: Risk[];
}

function analyzeDocument(text: string): DocumentAnalysis {
  const analysis: DocumentAnalysis = {
    extracted_info: {
      type: 'unknown',
      formNumber: '',
      summary: ''
    },
    risks: []
  };

  // Basic form info extraction
  const formMatches = text.match(/FORM (\d+)|Form (\d+)/);
  if (formMatches) {
    analysis.extracted_info.formNumber = formMatches[1] || formMatches[2];
  }

  // BIA Compliance Risks
  if (!text.includes('Notice of Bankruptcy') && !text.includes('Statement of Affairs')) {
    analysis.risks.push({
      type: 'BIA Documentation Risk',
      description: 'Missing required bankruptcy documentation under BIA Section 49(1)',
      severity: 'high',
      impact: 'Non-compliance with mandatory bankruptcy filing requirements',
      regulation: 'Bankruptcy and Insolvency Act (BIA) Section 49(1)',
      requiredAction: 'Submit complete bankruptcy documentation including Notice of Bankruptcy and Statement of Affairs',
      solution: 'Review Directive No. 23 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars for documentation requirements'
    });
  }

  // Creditor Meeting Requirements
  if (text.includes('meeting of creditors') && !text.includes('notice to creditors')) {
    analysis.risks.push({
      type: 'Creditor Meeting Compliance Risk',
      description: 'Inadequate creditor notification for meeting under BIA Section 102(2)',
      severity: 'high',
      impact: 'Potential invalidation of creditors meeting proceedings',
      regulation: 'BIA Section 102(2) and Directive No. 9R6',
      requiredAction: 'Ensure proper notice is given to all creditors within prescribed timeframe',
      solution: 'Follow notification requirements outlined in Directive No. 9R6 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars'
    });
  }

  // Estate Administration
  if (!text.includes('trustee') || !text.includes('licensed')) {
    analysis.risks.push({
      type: 'Trustee Authorization Risk',
      description: 'Potential unauthorized administration of bankruptcy estate',
      severity: 'high',
      impact: 'Violation of BIA trustee licensing requirements',
      regulation: 'BIA Section 13.2 and Directive No. 13R6',
      requiredAction: 'Verify trustee licensing status and authorization',
      solution: 'Consult OSB's Licensed Insolvency Trustee requirements at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars/directive-no-13r6-licensing-trustees'
    });
  }

  // Consumer Proposal Compliance
  if (text.includes('consumer proposal') && !text.includes('assessment certificate')) {
    analysis.risks.push({
      type: 'Consumer Proposal Compliance Risk',
      description: 'Missing mandatory counselling assessment for consumer proposal',
      severity: 'high',
      impact: 'Non-compliance with BIA counselling requirements',
      regulation: 'BIA Directive No. 1R5',
      requiredAction: 'Complete mandatory counselling sessions and obtain assessment certificate',
      solution: 'Review counselling requirements in Directive No. 1R5 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars'
    });
  }

  // Document Signing and Dating
  if (!text.includes('signed') || !text.includes('dated')) {
    analysis.risks.push({
      type: 'Document Execution Risk',
      description: 'Improper document execution under BIA requirements',
      severity: 'high',
      impact: 'Potential invalidity of bankruptcy documentation',
      regulation: 'BIA Section 148 and General Rules',
      requiredAction: 'Ensure all documents are properly signed and dated by authorized parties',
      solution: 'Review documentation requirements in the BIA General Rules at https://laws-lois.justice.gc.ca/eng/regulations/C.R.C.,_c._368/'
    });
  }

  // CCAA Compliance (if applicable)
  if (text.includes('CCAA') || text.includes('Companies\' Creditors Arrangement Act')) {
    analysis.risks.push({
      type: 'CCAA Compliance Risk',
      description: 'Additional compliance requirements under CCAA',
      severity: 'high',
      impact: 'Potential non-compliance with CCAA requirements',
      regulation: 'Companies\' Creditors Arrangement Act (CCAA)',
      requiredAction: 'Review and ensure compliance with CCAA requirements',
      solution: 'Consult CCAA guidelines at https://laws-lois.justice.gc.ca/eng/acts/C-36/index.html'
    });
  }

  console.log('Enhanced BIA/CCAA compliance analysis completed:', analysis);
  return analysis;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();

    if (!documentText || !documentId) {
      throw new Error('Missing required parameters: documentText or documentId');
    }

    console.log('Starting enhanced document analysis for document:', documentId);
    const analysisResult = analyzeDocument(documentText);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('user_id')
      .eq('id', documentId)
      .single();

    if (docError) {
      console.error('Error fetching document:', docError);
      throw docError;
    }

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
      JSON.stringify({ 
        message: 'Enhanced analysis completed', 
        result: analysisResult 
      }),
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
