
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { documentText, documentId, includeRegulatory } = await req.json();

    if (!documentText) {
      return new Response(
        JSON.stringify({ error: 'No document text provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Received document text length:', documentText.length);
    console.log('Document sample:', documentText.substring(0, 200));

    // Process the document using formAnalyzer
    const analysisResults = await processDocument(documentText, includeRegulatory);
    console.log('Analysis completed:', JSON.stringify(analysisResults, null, 2));

    // Store analysis results in database
    const { data, error } = await supabase
      .from('document_analysis')
      .insert({
        document_id: documentId,
        content: analysisResults
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing analysis:', error);
      throw error;
    }

    return new Response(
      JSON.stringify(analysisResults),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
