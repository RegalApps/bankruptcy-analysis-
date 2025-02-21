
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}

serve(async (req) => {
  // Add detailed logging
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentText, documentId } = await req.json()
    console.log('Received document analysis request:', { documentId, textLength: documentText?.length });

    if (!documentText || !documentId) {
      throw new Error('Missing required parameters: documentText or documentId');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify OpenAI API key
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Sending request to OpenAI API');
    
    const systemPrompt = `You are a legal expert specializing in Canadian Bankruptcy and Insolvency Act (BIA) forms. Analyze the provided document and:
1. Identify the BIA form number (1-96) and type
2. Extract key information based on the form type
3. Identify potential risks and compliance issues
4. Provide solutions and required actions for each risk
5. Reference specific sections of the BIA (RSC 1985, c B-3) when relevant

Format the response as a JSON object.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: documentText }
        ],
        temperature: 0.2,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status} ${openAIResponse.statusText}`);
    }

    console.log('Received OpenAI response');
    const openAIData = await openAIResponse.json();
    
    let extractedInfo;
    try {
      const responseText = openAIData.choices[0].message.content;
      console.log('OpenAI raw response:', responseText);
      extractedInfo = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse document analysis');
    }

    console.log('Storing analysis in database');
    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .insert({
        document_id: documentId,
        content: {
          extracted_info: extractedInfo,
          raw_response: openAIData.choices[0].message.content
        }
      });

    if (analysisError) {
      console.error('Database error:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed successfully');
    return new Response(
      JSON.stringify({ 
        message: 'Document analyzed successfully', 
        analysis: extractedInfo 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
