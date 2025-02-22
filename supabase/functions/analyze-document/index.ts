
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { analyzeDocument } from "./riskAnalyzer.ts";
import { DocumentAnalysis } from "./types.ts";

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
