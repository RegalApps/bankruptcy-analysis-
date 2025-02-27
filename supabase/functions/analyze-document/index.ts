
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { processDocument } from "./formAnalyzer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId, includeRegulatory = true } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText?.length });

    if (!documentText) {
      throw new Error('No document text provided');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Process the document text
    const analysis = await processDocument(documentText, includeRegulatory);
    console.log('Analysis results:', analysis);

    // Create the comprehensive analysis object
    const analysisContent = {
      extracted_info: {
        type: analysis.documentType,
        clientName: analysis.extractedInfo?.clientName,
        clientAddress: analysis.extractedInfo?.clientAddress,
        trusteeName: analysis.extractedInfo?.trusteeName,
        trusteeAddress: analysis.extractedInfo?.trusteeAddress,
        formNumber: analysis.extractedInfo?.formNumber,
        dateSigned: analysis.extractedInfo?.dateSigned,
        estateNumber: analysis.extractedInfo?.estateNumber,
        district: analysis.extractedInfo?.district,
        divisionNumber: analysis.extractedInfo?.divisionNumber,
        courtNumber: analysis.extractedInfo?.courtNumber,
        meetingOfCreditors: analysis.extractedInfo?.meetingOfCreditors,
        chairInfo: analysis.extractedInfo?.chairInfo,
        securityInfo: analysis.extractedInfo?.securityInfo,
        dateBankruptcy: analysis.extractedInfo?.dateBankruptcy,
        officialReceiver: analysis.extractedInfo?.officialReceiver,
        summary: analysis.extractedInfo?.summary
      },
      risks: analysis.risks.map(risk => ({
        type: risk.type,
        description: risk.description,
        severity: risk.severity,
        regulation: risk.regulation || '',
        impact: risk.impact || '',
        requiredAction: risk.requiredAction || '',
        solution: risk.solution || ''
      }))
    };

    // Update the document analysis in the database
    const { error: upsertError } = await supabaseClient
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: 'system', // Using 'system' for auto-generated analysis
        content: analysisContent,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error updating document analysis:', upsertError);
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisContent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during document analysis'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
