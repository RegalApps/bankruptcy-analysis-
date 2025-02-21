import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentInfo {
  type: string;
  formNumber?: string;
  clientName?: string;
  trusteeName?: string;
  dateSigned?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingDetails?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  flags: string[];
}

function standardizeDate(dateStr: string): string {
  try {
    let date: Date;
    
    const yearFirstMatch = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (yearFirstMatch) {
      const [_, year, month, day] = yearFirstMatch;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      const dateParts = dateStr.match(/(\d{1,2})\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[,\s]*(\d{4})/i);
      
      if (dateParts) {
        const [_, day, month, year] = dateParts;
        const monthIndex = new Date(`${month} 1, 2000`).getMonth();
        date = new Date(parseInt(year), monthIndex, parseInt(day));
      } else {
        date = new Date(dateStr);
      }
    }

    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  } catch (e) {
    console.error('Error standardizing date:', e);
    return dateStr;
  }
}

function extractFormInfo(text: string): { type: string; formNumber: string } {
  const patterns = [
    /\b[Ff]orm\s*(?:no\.|number|#)?\s*(\d+)/i,
    /\b[Ff]orm\s*(\d+)/i,
    /\bForm\s*([A-Z\d]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        type: `form${match[1].toLowerCase()}`,
        formNumber: match[1]
      };
    }
  }

  return { type: 'unknown', formNumber: '' };
}

function extractNames(text: string): { clientName?: string; trusteeName?: string; officialReceiver?: string } {
  const names: { clientName?: string; trusteeName?: string; officialReceiver?: string } = {};
  
  const patterns = {
    client: [
      /(?:debtor|client|bankrupt)['\s]*(?:name)?[:\s]+([A-Za-z\s.,]+?)(?=\n|$|\d|(?:address|phone|trustee|official|date))/i,
      /Name(?:\s+of)?(?:\s+the)?(?:\s+debtor)?[:\s]+([A-Za-z\s.,]+?)(?=\n|$|\d|(?:address|phone|trustee|official|date))/i,
      /([A-Za-z\s.,]+?)(?:\s+(?:is\s+the\s+debtor|has\s+filed|signed))/i
    ],
    trustee: [
      /(?:licensed(?:\s+insolvency)?(?:\s+trustee)|trustee)[:\s]+([A-Za-z\s.,]+?)(?=\n|$|\d|licensed)/i,
      /trustee[:\s]+([A-Za-z\s.,]+?)(?=\n|$|\d|(?:address|phone|date))/i,
      /([A-Za-z\s.,]+?)(?:\s+is\s+(?:the\s+)?(?:licensed\s+)?trustee)/i
    ],
    receiver: [
      /official\s+receiver[:\s]+([A-Za-z\s.,]+?)(?=\n|$|\d)/i,
      /([A-Za-z\s.,]+?)(?:\s+is\s+the\s+official\s+receiver)/i
    ]
  };

  for (const pattern of patterns.client) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      names.clientName = match[1].trim();
      break;
    }
  }

  for (const pattern of patterns.trustee) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      names.trusteeName = match[1].trim();
      break;
    }
  }

  for (const pattern of patterns.receiver) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      names.officialReceiver = match[1].trim();
      break;
    }
  }

  return names;
}

function extractDates(text: string): { dateSigned?: string; dateBankruptcy?: string } {
  const dates: { dateSigned?: string; dateBankruptcy?: string } = {};
  
  const patterns = {
    signed: [
      /(?:signed|executed|dated|date)[:\s]+(?:on\s+)?([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i,
      /(?:dated?|as\s+of)\s+(?:this\s+)?(\d{1,2}(?:st|nd|rd|th)?\s+(?:day\s+)?(?:of\s+)?[A-Za-z]+,?\s*\d{4})/i,
      /date:\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i
    ],
    bankruptcy: [
      /(?:bankruptcy|filing)(?:\s+date)?[:\s]+([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i,
      /date\s+of\s+bankruptcy[:\s]+([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i
    ]
  };

  for (const pattern of patterns.signed) {
    const match = text.match(pattern);
    if (match && match[1]) {
      dates.dateSigned = standardizeDate(match[1].replace(/(?:st|nd|rd|th)/, ''));
      break;
    }
  }

  for (const pattern of patterns.bankruptcy) {
    const match = text.match(pattern);
    if (match && match[1]) {
      dates.dateBankruptcy = standardizeDate(match[1]);
      break;
    }
  }

  return dates;
}

function extractNumbers(text: string): { estateNumber?: string; district?: string; divisionNumber?: string; courtNumber?: string } {
  const numbers: { estateNumber?: string; district?: string; divisionNumber?: string; courtNumber?: string } = {};
  
  const patterns = {
    estate: [
      /estate\s*(?:no\.|number|#)?[:\s]+(\d[\d-]*)/i,
      /(?:bankruptcy|file)\s*(?:no\.|number|#)?[:\s]+(\d[\d-]*)/i
    ],
    district: [
      /district[:\s]+(?:no\.|number|#)?[:\s]*(\d+)/i,
      /(?:in|of)\s+the\s+(\d+)(?:st|nd|rd|th)\s+district/i
    ],
    division: [
      /division[:\s]+(?:no\.|number|#)?[:\s]*(\d+)/i,
      /(\d+)(?:st|nd|rd|th)\s+division/i
    ],
    court: [
      /court[:\s]+(?:no\.|number|#)?[:\s]*(\d+)/i,
      /(?:in|of)\s+the\s+(\d+)(?:st|nd|rd|th)\s+court/i
    ]
  };

  for (const [key, patternList] of Object.entries(patterns)) {
    for (const pattern of patternList) {
      const match = text.match(pattern);
      if (match && match[1]) {
        numbers[key as keyof typeof numbers] = match[1].replace(/(?:st|nd|rd|th)/, '');
        break;
      }
    }
  }

  return numbers;
}

function parseDocument(text: string): DocumentInfo {
  console.log('Starting document parsing with text:', text);
  
  const flags: string[] = [];
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,()]/g, ' ')
    .trim();

  console.log('Cleaned text:', cleanedText);
  
  const formInfo = extractFormInfo(cleanedText);
  
  const names = extractNames(cleanedText);
  const dates = extractDates(cleanedText);
  const numbers = extractNumbers(cleanedText);
  
  const meetingMatch = cleanedText.match(/meeting\s+of\s+creditors[:\s]+([^\.]+)/i);
  const chairMatch = cleanedText.match(/chair(?:person)?[:\s]+([^\.]+)/i);
  const securityMatch = cleanedText.match(/security[:\s]+([^\.]+)/i);

  if (!formInfo.formNumber) flags.push('Form number not found');
  if (!names.clientName) flags.push('Client/Debtor name not found');
  if (!names.trusteeName) flags.push('Trustee name not found');
  if (!dates.dateSigned) flags.push('Date signed not found');
  
  const documentInfo: DocumentInfo = {
    type: formInfo.type,
    formNumber: formInfo.formNumber,
    ...names,
    ...dates,
    ...numbers,
    meetingDetails: meetingMatch ? meetingMatch[1].trim() : undefined,
    chairInfo: chairMatch ? chairMatch[1].trim() : undefined,
    securityInfo: securityMatch ? securityMatch[1].trim() : undefined,
    flags
  };

  console.log('Extracted document info:', documentInfo);
  return documentInfo;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) throw new Error('Invalid user token');

    const { documentText, documentId } = await req.json();
    console.log(`Processing document ${documentId}`);
    console.log('Raw document text:', documentText);

    if (!documentText?.trim()) throw new Error('Document text is empty');

    const documentInfo = parseDocument(documentText);
    
    const analysisResult = {
      type: documentInfo.type,
      extracted_info: {
        ...documentInfo,
        type: documentInfo.type
      },
      summary: `Document analysis complete. Form type: ${documentInfo.type}. ${documentInfo.flags.length} issues found.`
    };

    console.log('Final analysis result:', analysisResult);

    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        content: analysisResult,
        user_id: user.id
      });

    if (analysisError) throw analysisError;

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
