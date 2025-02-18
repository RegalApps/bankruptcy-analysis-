
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { documentText, documentId } = await req.json();

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
            content: `You are a specialized document analysis assistant for Canadian bankruptcy and financial documents. 
            Your task is to extract key information and assess compliance with Canadian regulations.
            
            Reference the following sources for compliance:
            - Office of the Superintendent of Bankruptcy Canada regulations
            - Bankruptcy and Insolvency Act (B-3)
            - Acts O-2.7, C-41.01, T-19.8, and I-11.8
            - Official bankruptcy forms database
            
            Extract and analyze:
            1. Client Name
            2. Trustee Name
            3. Date Signed
            4. Form Number
            5. Assess risks and compliance issues
            
            Format response as JSON:
            {
              "clientName": string | null,
              "trusteeName": string | null,
              "dateSigned": string | null,
              "formNumber": string | null,
              "risks": [
                {
                  "type": string,
                  "description": string,
                  "severity": "low" | "medium" | "high"
                }
              ]
            }
            
            Mark missing information as null. For risks, identify any compliance issues, missing required information, or inconsistencies.`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        temperature: 0.3,
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
      .upsert({ 
        document_id: documentId,
        content: {
          extracted_info: parsedAnalysis
        }
      });

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
