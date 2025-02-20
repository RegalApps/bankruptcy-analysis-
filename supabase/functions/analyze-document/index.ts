import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();
    
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    if (!documentText) {
      throw new Error('Document text is required');
    }

    console.log('Analyzing document:', { documentId, textLength: documentText.length });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get user information from the JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Extract form number
    const formNumberMatch = documentText.match(/form\s*(?:no\.?|number|#)?\s*(\d+)/i);
    const formNumber = formNumberMatch ? formNumberMatch[1] : '';
    
    console.log('Detected form number:', formNumber);

    if (!formNumber) {
      throw new Error('Could not detect form number');
    }

    const extractedInfo = extractFormInfo(documentText, formNumber);
    console.log('Extracted information:', extractedInfo);

    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      throw new Error('Failed to save document analysis');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedInfo 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function extractFormInfo(text: string, formNumber: string) {
  const baseFormNumber = formNumber.split('.')[0];
  const formType = determineFormType(formNumber);
  
  let extractedInfo: any = {
    type: formType,
    formNumber: formNumber,
    summary: generateFormSummary(formNumber, formType)
  };

  // Add generic info extraction
  const genericInfo = extractGenericFormInfo(text);
  return {
    ...extractedInfo,
    ...genericInfo
  };
}

function extractGenericFormInfo(text: string) {
  const info: any = {};

  // Extract common fields with more flexible patterns
  const clientMatch = text.match(/(?:debtor|bankrupt|insolvent\s+person|consumer)(?:'s)?\s*(?:name)?[:]\s*([^\n\r.]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  const trusteeMatch = text.match(/(?:trustee|administrator|licensed\s+insolvency\s+trustee)[:]\s*([^\n\r.]+)/i);
  info.trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  const dateMatch = text.match(/(?:date|dated|filing\s+date)[:]\s*([^\n\r.]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return info;
}

function determineFormType(formNumber: string): string {
  const formTypeMap: { [key: string]: string } = {
    "65": "Statement of Affairs (Individual)",
    "65A": "Statement of Affairs (Bankruptcy)",
    "79": "Proof of Claim",
    "74": "Proxy",
    "78": "Statement of Income and Expenses"
  };

  const baseFormNumber = formNumber.split('.')[0];
  return formTypeMap[baseFormNumber] || `Form ${formNumber}`;
}

function generateFormSummary(formNumber: string, formTitle: string): string {
  return `This is ${formTitle}. Please refer to the Bankruptcy and Insolvency Act for specific requirements.`;
}
