
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
    const trusteeMatch = text.match(/(?:trustee|Licensed\s+Insolvency\s+Trustee)[:\s]+([^\n]+)/i);
    const estateMatch = text.match(/(?:estate|file)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);
    const formNumberMatch = text.match(/Form\s*(?:no\.?|number)?[:\s]*(\d+)/i);
    const clientMatch = text.match(/(?:debtor|bankrupt)[:\s]+([^\n]+)/i);
    const courtNumberMatch = text.match(/(?:court)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);
    const districtMatch = text.match(/(?:district)[:\s]+([^\n]+)/i);
    const divisionMatch = text.match(/(?:division)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);

    const extractedInfo = {
      type: 'Form 66',
      meetingOfCreditors: meetingMatch ? meetingMatch[0].trim() : '',
      dateSigned: dateMatch ? dateMatch[0] : '',
      trusteeName: trusteeMatch ? trusteeMatch[1].trim() : '',
      estateNumber: estateMatch ? estateMatch[1].trim() : '',
      formNumber: formNumberMatch ? formNumberMatch[1].trim() : '',
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

async function analyzeWithOpenAI(text: string): Promise<AnalysisResult> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Analyzing text with OpenAI:', text.substring(0, 100) + '...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Extract key information from legal documents into this JSON structure:
            {
              "type": "document type",
              "clientName": "name",
              "trusteeName": "name",
              "dateSigned": "date",
              "formNumber": "number",
              "estateNumber": "number",
              "district": "district name",
              "divisionNumber": "number",
              "courtNumber": "number",
              "meetingOfCreditors": "details",
              "chairInfo": "details",
              "securityInfo": "details",
              "dateBankruptcy": "date",
              "officialReceiver": "name"
            }`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let extracted_info;
    try {
      extracted_info = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error);
      extracted_info = {
        type: 'Unknown',
        summary: data.choices[0].message.content
      };
    }

    return {
      type: extracted_info.type || 'Unknown',
      extracted_info,
      summary: `Document analysis complete. Identified as ${extracted_info.type || 'Unknown'} document.`
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();
    console.log(`Processing document ${documentId} (length: ${documentText.length})`);

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
        extracted_info: extractedInfo
      };
    } else {
      console.log('Using OpenAI analysis');
      analysisResult = await analyzeWithOpenAI(cleanedText);
    }

    console.log('Analysis completed successfully');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        content: analysisResult,
        user_id: (await req.json()).userId // Get the user ID from the request
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
