
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const extractedInfo = {
      type: 'Form 66',
      meetingOfCreditors: meetingMatch ? meetingMatch[0].trim() : '',
      dateSigned: dateMatch ? dateMatch[0] : '',
      trusteeName: trusteeMatch ? trusteeMatch[1].trim() : '',
      estateNumber: estateMatch ? estateMatch[1].trim() : ''
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
        model: 'gpt-3.5-turbo',
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
              "estateNumber": "number"
            }`
          },
          {
            role: 'user',
            content: text.substring(0, 1000) // First 1000 chars for analysis
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
      // Try to parse the content as JSON
      extracted_info = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.warn('Failed to parse OpenAI response as JSON:', error);
      // If parsing fails, use the raw content
      extracted_info = {
        type: 'Unknown',
        summary: data.choices[0].message.content
      };
    }

    return {
      type: extracted_info.type || 'Unknown',
      extracted_info,
      summary: data.choices[0].message.content
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
