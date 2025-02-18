
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { documentText } = await req.json();

    // Call OpenAI API to analyze the document
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a document analysis assistant specialized in legal and financial documents. 
            Extract and analyze the following information:
            - Client Name
            - Trustee Name
            - Date Signed
            - Form Number
            - Document Type
            - Risk Assessment (identify any missing information, inconsistencies, or compliance issues)

            Return the information in a JSON format with the following structure:
            {
              "clientName": string,
              "trusteeName": string,
              "dateSigned": string,
              "formNumber": string,
              "documentType": string,
              "risks": [
                {
                  "type": string,
                  "description": string,
                  "severity": "low" | "medium" | "high"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the analysis to ensure it's valid JSON
    const parsedAnalysis = JSON.parse(analysis);

    console.log("Document analysis completed:", parsedAnalysis);

    // Store the analysis in the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('document_analysis')
      .update({ 
        content: {
          extracted_info: parsedAnalysis
        }
      })
      .eq('document_id', req.headers.get('document-id'));

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, analysis: parsedAnalysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
