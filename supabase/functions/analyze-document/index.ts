
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { FormAnalyzer } from "./formAnalyzer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const formAnalyzer = new FormAnalyzer();
    const analysisResult = await formAnalyzer.analyzeDocument(documentText);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Save analysis results
    const { error: analysisError } = await supabaseClient
      .from('form_analysis_results')
      .upsert({
        document_id: documentId,
        form_number: analysisResult.formNumber,
        extracted_fields: analysisResult.extractedFields,
        validation_results: analysisResult.validationResults,
        confidence_score: analysisResult.confidenceScore,
        status: analysisResult.status
      });

    if (analysisError) {
      console.error('Error saving analysis results:', analysisError);
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
