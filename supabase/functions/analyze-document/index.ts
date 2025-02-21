
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  type: string;
  extracted_info: Record<string, string>;
  summary?: string;
}

// Cached results (basic in-memory cache)
const analysisCache = new Map<string, AnalysisResult>();

async function parseForm66(text: string): Promise<Record<string, string>> {
  try {
    // Extract key information using regex patterns
    const meetingMatch = text.match(/meeting\s+of\s+creditors[^\n]*/i);
    const dateMatch = text.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
    const trusteeMatch = text.match(/(?:trustee|Licensed\s+Insolvency\s+Trustee)[:\s]+([^\n]+)/i);
    const estateMatch = text.match(/(?:estate|file)\s*(?:no\.?|number)[:\s]*([^\n]+)/i);

    return {
      type: 'Form 66',
      meetingOfCreditors: meetingMatch ? meetingMatch[0].trim() : '',
      dateSigned: dateMatch ? dateMatch[0] : '',
      trusteeName: trusteeMatch ? trusteeMatch[1].trim() : '',
      estateNumber: estateMatch ? estateMatch[1].trim() : '',
    };
  } catch (error) {
    console.error('Form 66 parsing error:', error);
    throw new Error(`Failed to parse Form 66: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();

    // Check cache first
    const cacheKey = `${documentId}-${documentText.slice(0, 100)}`; // Use first 100 chars as part of cache key
    if (analysisCache.has(cacheKey)) {
      console.log('Returning cached analysis result');
      return new Response(JSON.stringify(analysisCache.get(cacheKey)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean the text content
    const cleanedText = documentText
      .replace(/\s+/g, ' ')
      .trim();

    // Start with basic form type detection
    const isForm66 = /form\s*66|notice\s*to\s*bankrupt/i.test(cleanedText);
    
    let analysisResult: AnalysisResult;

    if (isForm66) {
      console.log('Detected Form 66, using specialized parser');
      const extractedInfo = await parseForm66(cleanedText);
      analysisResult = {
        type: 'Form 66',
        extracted_info: extractedInfo
      };
    } else {
      // Use OpenAI for other document types
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Using OpenAI for document analysis');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using faster model
          messages: [
            {
              role: 'system',
              content: 'Extract key information from legal documents. Be concise and focus on essential details only.'
            },
            {
              role: 'user',
              content: `Analyze this document and extract key information: ${cleanedText.substring(0, 1000)}`
            }
          ],
          max_tokens: 500, // Reduced max tokens
          temperature: 0.3, // Lower temperature for more focused responses
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      analysisResult = {
        type: 'Other',
        extracted_info: JSON.parse(data.choices[0].message.content),
        summary: data.choices[0].message.content
      };
    }

    // Cache the result
    analysisCache.set(cacheKey, analysisResult);
    
    // Trim cache if it gets too large
    if (analysisCache.size > 100) {
      const firstKey = analysisCache.keys().next().value;
      analysisCache.delete(firstKey);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({
        error: `Analysis failed: ${error.message}`,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
