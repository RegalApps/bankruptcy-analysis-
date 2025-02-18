
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
    
    console.log('Received request with document ID:', documentId);
    
    if (!documentText) {
      console.error('No document text provided');
      throw new Error('Document text is required');
    }

    if (!documentId) {
      console.error('No document ID provided');
      throw new Error('Document ID is required');
    }

    // Call OpenAI API to analyze the document
    console.log('Calling OpenAI API...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

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

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Analysis stored successfully');

    return new Response(
      JSON.stringify({ success: true, analysis: parsedAnalysis }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
