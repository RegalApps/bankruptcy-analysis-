
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Tesseract } from 'https://esm.sh/tesseract.js@5.0.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const extractFinancialData = (text: string) => {
  const numberPattern = /\$?\d{1,3}(,\d{3})*(\.\d{2})?/g;
  const matches = text.match(numberPattern) || [];
  
  // Convert matches to numbers
  const numbers = matches.map(match => 
    parseFloat(match.replace(/[$,]/g, ''))
  ).filter(num => !isNaN(num));

  // Attempt to categorize numbers based on context
  const categorizedData: Record<string, number> = {};
  
  const keywords = {
    income: ['income', 'salary', 'earnings', 'revenue'],
    rent: ['rent', 'mortgage', 'housing'],
    utilities: ['utilities', 'electric', 'gas', 'water'],
    food: ['food', 'groceries', 'meals'],
    transportation: ['transport', 'car', 'bus', 'fuel'],
  };

  // Search for amounts near keywords
  for (const [category, terms] of Object.entries(keywords)) {
    for (const term of terms) {
      const regex = new RegExp(`${term}.{0,20}(\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        categorizedData[category] = parseFloat(match[1].replace(/[$,]/g, ''));
        break;
      }
    }
  }

  return {
    extractedNumbers: numbers,
    categorizedData,
    confidence: numbers.length > 0 ? 'high' : 'low',
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const financialRecordId = formData.get('financialRecordId');

    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded');
    }

    // Initialize Tesseract worker
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Convert file to image data
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Perform OCR
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    // Extract and analyze financial data from text
    const extractedData = extractFinancialData(text);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store OCR results
    if (financialRecordId) {
      const { error } = await supabase
        .from('financial_analysis')
        .upsert({
          financial_record_id: financialRecordId,
          ocr_verification_results: extractedData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: extractedData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
