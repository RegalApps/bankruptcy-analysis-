
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  formNumber: string;
  extractedFields: Record<string, any>;
  validationResults: ValidationError[];
  confidenceScore: number;
  status: 'success' | 'partial' | 'failed';
}

interface ValidationError {
  field: string;
  type: 'error' | 'warning';
  message: string;
  code: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();

    if (!documentText || !documentId) {
      throw new Error('Missing required parameters');
    }

    console.log('Starting document analysis for document:', documentId);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Use OpenAI to analyze the document content
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a document analysis assistant. Analyze the document content and extract key information.'
          },
          {
            role: 'user',
            content: documentText
          }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Save analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        content: analysis,
        status: 'completed',
        analyzed_at: new Date().toISOString()
      });

    if (analysisError) throw analysisError;

    const result: AnalysisResult = {
      formNumber: '1', // Default form number
      extractedFields: {
        analysis,
        documentId
      },
      validationResults: [],
      confidenceScore: 100,
      status: 'success'
    };

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed',
        result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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
