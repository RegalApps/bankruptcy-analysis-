
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();
    console.log('Received request:', { documentId, textLength: documentText?.length });

    if (!documentId || !documentText) {
      throw new Error('Document ID and text are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Authenticated user:', user.id);

    // Extract basic information
    const formNumberMatch = documentText.match(/form\s*(?:no\.?|number|#)?\s*(\d+)/i);
    const formNumber = formNumberMatch ? formNumberMatch[1] : '';
    console.log('Detected form number:', formNumber);

    const clientNameMatch = documentText.match(/(?:debtor|bankrupt|consumer)(?:'s)?\s*name\s*[:]\s*([^\n\r.]+)/i);
    const clientName = clientNameMatch ? clientNameMatch[1].trim() : '';

    const trusteeMatch = documentText.match(/(?:trustee|administrator)[:]\s*([^\n\r.]+)/i);
    const trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

    const dateMatch = documentText.match(/date[:]\s*([^\n\r.]+)/i);
    const dateSigned = dateMatch ? dateMatch[1].trim() : '';

    const extractedInfo = {
      type: formNumber ? `Form ${formNumber}` : 'Unknown Form',
      formNumber,
      clientName,
      trusteeName,
      dateSigned,
      summary: `This is Form ${formNumber}. Please refer to the Bankruptcy and Insolvency Act for specific requirements.`
    };

    console.log('Extracted info:', extractedInfo);

    // Save analysis
    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      throw new Error('Failed to save analysis');
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
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
