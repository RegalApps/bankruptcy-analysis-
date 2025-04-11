
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the Admin key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, documentText, documentType } = await req.json();
    
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch document content if documentText is not provided
    let text = documentText;
    if (!text) {
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('storage_path, title, type')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      // Get document from storage
      if (document.storage_path) {
        // For this example, we'll simulate having the text content
        // In a real implementation, you would download and process the file
        text = `This is a Form 31 (Proof of Claim) for GreenTech Supplies Inc.
        Creditor: Neil Armstrong, Licensed Insolvency Trustee
        Firm: ABC Restructuring Ltd.
        Address: 100 Bay Street, Suite 400, Toronto, Ontario, M5J 2N8
        Amount Claimed: $89,355.00
        The document appears to have several issues including missing checkbox selections,
        missing relatedness declaration, and incomplete date format.`;
      }
    }
    
    // Prepare the prompt for OpenAI
    const systemPrompt = `You are an expert document analyzer for Canadian insolvency and bankruptcy forms. 
    Analyze the provided document text in detail and extract the following information:
    
    1. Document type (Form number if applicable)
    2. Client/debtor information
    3. Trustee information
    4. Financial details
    5. Complete risk analysis with following structure for each risk:
       - Risk severity (HIGH/MEDIUM/LOW)
       - Issue description
       - BIA Reference (regulation)
       - Implication/impact
       - Recommended solution
       - Deadline for resolution (if applicable)
    
    Format your response as structured JSON. Be thorough and specific.`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Document text: ${text}` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    // Store analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .insert({
        document_id: documentId,
        content: analysisResult
      });
      
    if (analysisError) throw analysisError;
    
    // Update document status
    const { error: updateError } = await supabase
      .from('documents')
      .update({ ai_processing_status: 'complete' })
      .eq('id', documentId);
      
    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in analyze-document-openai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
