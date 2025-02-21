
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { FORM_CONFIGS, identifyForm } from './formConfig.ts';

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
      throw new Error('Missing required parameters');
    }

    console.log('Starting document analysis...');

    // Identify the form number
    const formNumber = identifyForm(documentText);
    console.log('Identified form number:', formNumber);

    if (!formNumber || !FORM_CONFIGS[formNumber]) {
      throw new Error('Unable to identify form or form not supported');
    }

    const formConfig = FORM_CONFIGS[formNumber];

    // Extract form information
    const analysisResult = {
      extracted_info: {
        type: 'form',
        formNumber: formConfig.number,
        formType: formConfig.title,
        summary: formConfig.description,
      },
      risks: formConfig.riskFactors
    };

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user who owns the document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', documentId)
      .single();

    if (docError) throw docError;

    // Save analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: document.user_id,
        content: analysisResult
      });

    if (analysisError) throw analysisError;

    console.log('Analysis completed and saved successfully');

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
