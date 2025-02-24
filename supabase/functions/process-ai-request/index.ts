
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, module, documentId } = await req.json();

    // Construct system message based on module
    let systemMessage = "You are a helpful AI assistant.";
    switch (module) {
      case "document":
        systemMessage = "You are a document analysis expert specializing in Canadian insolvency documents. Focus on extracting key information, categorizing documents, and providing detailed analysis.";
        break;
      case "legal":
        systemMessage = "You are a legal expert specializing in Canadian insolvency law, OSB regulations, and BIA acts. Provide accurate legal information with references to specific regulations.";
        break;
      case "help":
        systemMessage = "You are a training assistant helping users understand document management and legal compliance in the Canadian insolvency industry.";
        break;
    }

    // If document ID is provided, fetch document content
    let documentContext = "";
    if (documentId) {
      const { data: document, error } = await supabase
        .from('documents')
        .select('content, metadata')
        .eq('id', documentId)
        .single();

      if (!error && document) {
        documentContext = `\nRelevant document context: ${JSON.stringify(document)}`;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message + documentContext }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // If this is a document analysis request, store the analysis
    if (module === 'document' && documentId) {
      const { error: analysisError } = await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          content: aiResponse,
          created_at: new Date().toISOString()
        });

      if (analysisError) {
        console.error('Error storing document analysis:', analysisError);
      }
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-ai-request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
