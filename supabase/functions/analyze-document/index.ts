
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  type: string;
  extracted_info: {
    type?: string;
    clientName?: string;
    trusteeName?: string;
    dateSigned?: string;
    formNumber?: string;
    estateNumber?: string;
    meetingOfCreditors?: string;
    district?: string;
    divisionNumber?: string;
    courtNumber?: string;
    chairInfo?: string;
    securityInfo?: string;
    dateBankruptcy?: string;
    officialReceiver?: string;
  };
  summary?: string;
}

async function parseForm66(text: string): Promise<AnalysisResult['extracted_info']> {
  try {
    console.log('Parsing Form 66 text:', text.substring(0, 100) + '...');
    
    const meetingMatch = text.match(/meeting\s+of\s+creditors[^\n]*/i);
    const dateMatch = text.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
    const trusteeMatch = text.match(/Licensed\s+Insolvency\s+Trustee:?\s*([^\n]+)/i) || text.match(/Trustee:?\s*([^\n]+)/i);
    const estateMatch = text.match(/(?:estate|file)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);
    const formNumberMatch = text.match(/Form\s*(?:no\.?|number)?[:\s]*(\d+)/i);
    const clientMatch = text.match(/To:\s*([^,\n]+)/i) || text.match(/(?:bankrupt|debtor)[:\s]*([^,\n]+)/i);
    const courtNumberMatch = text.match(/(?:court)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);
    const districtMatch = text.match(/(?:district)[:\s]+([^\n]+)/i);
    const divisionMatch = text.match(/(?:division)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);

    const extractedInfo = {
      type: 'Form 66',
      meetingOfCreditors: meetingMatch ? meetingMatch[0].trim() : '',
      dateSigned: dateMatch ? dateMatch[0] : '',
      trusteeName: trusteeMatch ? trusteeMatch[1].trim() : '',
      estateNumber: estateMatch ? estateMatch[1].trim() : '',
      formNumber: '66',
      clientName: clientMatch ? clientMatch[1].trim() : '',
      courtNumber: courtNumberMatch ? courtNumberMatch[1].trim() : '',
      district: districtMatch ? districtMatch[1].trim() : '',
      divisionNumber: divisionMatch ? divisionMatch[1].trim() : ''
    };

    console.log('Extracted Form 66 info:', extractedInfo);
    return extractedInfo;
  } catch (error) {
    console.error('Form 66 parsing error:', error);
    throw new Error(`Failed to parse Form 66: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');

    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const requestBody = await req.json();
    const { documentText, documentId } = requestBody;
    
    console.log(`Processing document ${documentId} for user ${user.id}`);

    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is empty');
    }

    const cleanedText = documentText.replace(/\s+/g, ' ').trim();
    const isForm66 = /form\s*66|notice\s*to\s*bankrupt/i.test(cleanedText);
    
    let analysisResult: AnalysisResult;

    if (isForm66) {
      console.log('Using Form 66 parser');
      const extractedInfo = await parseForm66(cleanedText);
      analysisResult = {
        type: 'Form 66',
        extracted_info: extractedInfo,
        summary: 'Form 66 - Notice to Bankrupt of Meeting of Creditors'
      };
    } else {
      console.log('Using OpenAI analysis');
      throw new Error('Document type not supported');
    }

    console.log('Analysis completed successfully');

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        content: analysisResult,
        user_id: user.id
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw analysisError;
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
