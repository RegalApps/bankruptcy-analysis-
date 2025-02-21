
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
    const date = new Date(dateStr);
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

function extractFormType(text: string): string {
  const formMatch = text.match(/form\s*(?:no\.|number|#)?\s*(\d+)/i);
  return formMatch ? `form${formMatch[1]}` : 'unknown';
}

function extractFormNumber(text: string): string {
  const formMatch = text.match(/form\s*(?:no\.|number|#)?\s*(\d+)/i);
  return formMatch ? formMatch[1] : '';
}

function extractDates(text: string): { dateSigned?: string; dateBankruptcy?: string } {
  const dates: { dateSigned?: string; dateBankruptcy?: string } = {};
  
  // Look for dates in various formats
  const datePatterns = [
    /(?:signed|date|dated)(?:\s+on)?\s*[:;]?\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i,
    /(?:bankruptcy|filed)(?:\s+on|date)?\s*[:;]?\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/i
  ];

  const [signedMatch, bankruptcyMatch] = datePatterns.map(pattern => text.match(pattern));
  
  if (signedMatch) dates.dateSigned = standardizeDate(signedMatch[1]);
  if (bankruptcyMatch) dates.dateBankruptcy = standardizeDate(bankruptcyMatch[1]);

  return dates;
}

function extractNames(text: string): { clientName?: string; trusteeName?: string; officialReceiver?: string } {
  const names: { clientName?: string; trusteeName?: string; officialReceiver?: string } = {};
  
  // Look for names in various contexts
  const trusteePattern = /(?:licensed(?:\s+insolvency)?\s+trustee|trustee)[:\s]+([A-Za-z\s,]+?)(?=\n|$|\d|licensed)/i;
  const clientPattern = /(?:debtor|client|bankrupt)[:\s]+([A-Za-z\s,]+?)(?=\n|$|\d)/i;
  const receiverPattern = /(?:official\s+receiver)[:\s]+([A-Za-z\s,]+?)(?=\n|$|\d)/i;

  const trusteeMatch = text.match(trusteePattern);
  const clientMatch = text.match(clientPattern);
  const receiverMatch = text.match(receiverPattern);

  if (trusteeMatch) names.trusteeName = trusteeMatch[1].trim();
  if (clientMatch) names.clientName = clientMatch[1].trim();
  if (receiverMatch) names.officialReceiver = receiverMatch[1].trim();

  return names;
}

function extractNumbers(text: string): { estateNumber?: string; district?: string; divisionNumber?: string; courtNumber?: string } {
  const numbers: { estateNumber?: string; district?: string; divisionNumber?: string; courtNumber?: string } = {};
  
  const estatePattern = /(?:estate\s*(?:no\.|number|#)?)[:\s]+(\d[\d-]*)/i;
  const districtPattern = /district[:\s]+(\d+)/i;
  const divisionPattern = /division[:\s]+(?:no\.|number|#)?[:\s]*(\d+)/i;
  const courtPattern = /court[:\s]+(?:no\.|number|#)?[:\s]*(\d+)/i;

  const estateMatch = text.match(estatePattern);
  const districtMatch = text.match(districtPattern);
  const divisionMatch = text.match(divisionPattern);
  const courtMatch = text.match(courtPattern);

  if (estateMatch) numbers.estateNumber = estateMatch[1];
  if (districtMatch) numbers.district = districtMatch[1];
  if (divisionMatch) numbers.divisionNumber = divisionMatch[1];
  if (courtMatch) numbers.courtNumber = courtMatch[1];

  return numbers;
}

function parseDocument(text: string): DocumentInfo {
  console.log('Parsing document text:', text);
  
  const flags: string[] = [];
  const formType = extractFormType(text);
  const formNumber = extractFormNumber(text);
  
  // Extract various components
  const dates = extractDates(text);
  const names = extractNames(text);
  const numbers = extractNumbers(text);
  
  // Meeting details
  const meetingMatch = text.match(/meeting\s+of\s+creditors[:\s]+([^\.]+)/i);
  const chairMatch = text.match(/chair(?:person)?[:\s]+([^\.]+)/i);
  const securityMatch = text.match(/security[:\s]+([^\.]+)/i);

  // Validate and flag missing information
  if (!formNumber) flags.push('Form number not found');
  if (!names.clientName) flags.push('Client/Debtor name not found');
  if (!names.trusteeName) flags.push('Trustee name not found');
  if (!dates.dateSigned) flags.push('Date signed not found');
  
  const documentInfo: DocumentInfo = {
    type: formType,
    formNumber,
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
    console.log(`Processing document ${documentId} for user ${user.id}`);

    if (!documentText?.trim()) throw new Error('Document text is empty');

    const cleanedText = documentText.replace(/\s+/g, ' ').trim();
    const documentInfo = parseDocument(cleanedText);
    
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
