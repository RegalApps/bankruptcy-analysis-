
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedInfo {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  appointmentDate: string;
  appointmentTime: string;
  propertyAddress: string;
  inspectionDate: string;
  trusteeName: string;
  trusteeTitle: string;
  flags: string[];
}

function standardizeDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('/').map(s => s.trim());
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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

function standardizeTime(timeStr: string): string {
  try {
    const [time, period] = timeStr.toLowerCase().split(/([ap]m)/);
    const [hours, minutes] = time.split(':').map(n => parseInt(n));
    const ampm = period || (hours >= 12 ? 'pm' : 'am');
    const standardHours = hours % 12 || 12;
    return `${standardHours}:${minutes.toString().padStart(2, '0')} ${ampm.toUpperCase()}`;
  } catch (e) {
    console.error('Error standardizing time:', e);
    return timeStr;
  }
}

function capitalizeAddress(address: string): string {
  return address
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseDocument(text: string): ExtractedInfo {
  console.log('Starting document parsing with text:', text);
  
  const flags: string[] = [];
  
  // Extract client name (first words before any numbers)
  const clientNameMatch = text.match(/^([A-Za-z\s]+?)(?=\d|$)/);
  const clientName = clientNameMatch ? clientNameMatch[1].trim() : '';
  if (!clientName) flags.push('Client name could not be identified');
  
  // Extract phone number
  const phoneMatch = text.match(/(\d{3}-\d{3}-\d{4})/);
  const clientPhone = phoneMatch ? phoneMatch[1] : '';
  if (!clientPhone) flags.push('Phone number not found or in incorrect format');
  
  // Extract addresses
  const addressPattern = /(\d+[^,\n]*(?:drive|street))/gi;
  const addresses = text.match(addressPattern) || [];
  const [clientAddress, propertyAddress] = addresses.map(capitalizeAddress);
  
  if (!clientAddress) flags.push('Client address not found');
  if (!propertyAddress) flags.push('Property address not found');
  
  // Extract appointment date and time
  const dateTimeMatch = text.match(/(\d{1,2})\s*(February|Feb)[,\s]*(\d{4})\s*(\d{1,2}):(\d{2})(?:pm|am)?/i);
  let appointmentDate = '';
  let appointmentTime = '';
  
  if (dateTimeMatch) {
    const [_, day, month, year, hours, minutes] = dateTimeMatch;
    appointmentDate = `${day} ${month}, ${year}`;
    appointmentTime = standardizeTime(`${hours}:${minutes}`);
  } else {
    flags.push('Appointment date/time not found or in incorrect format');
  }
  
  // Extract inspection date
  const inspectionDateMatch = text.match(/(\d{4}\/\s*\d{2}\/\s*\d{2})/);
  const inspectionDate = inspectionDateMatch 
    ? standardizeDate(inspectionDateMatch[1].replace(/\s+/g, ''))
    : '';
  
  if (!inspectionDate) flags.push('Inspection date not found or in incorrect format');
  
  // Extract trustee information
  const trusteeMatch = text.match(/([A-Za-z\s]+)\s+Trustee\b/i);
  const trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';
  const trusteeTitle = trusteeMatch ? 'Trustee' : '';
  
  if (!trusteeName) flags.push('Trustee information not found');

  const extractedInfo: ExtractedInfo = {
    clientName,
    clientPhone,
    clientAddress,
    appointmentDate,
    appointmentTime,
    propertyAddress,
    inspectionDate,
    trusteeName,
    trusteeTitle,
    flags
  };

  console.log('Extracted information:', extractedInfo);
  return extractedInfo;
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
    const extractedInfo = parseDocument(cleanedText);
    
    const analysisResult = {
      type: 'Appointment Document',
      extracted_info: {
        type: 'Appointment',
        clientInfo: {
          name: extractedInfo.clientName,
          phoneNumber: extractedInfo.clientPhone,
          address: extractedInfo.clientAddress
        },
        appointmentDetails: {
          date: extractedInfo.appointmentDate,
          time: extractedInfo.appointmentTime
        },
        propertyInfo: {
          address: extractedInfo.propertyAddress,
          inspectionDate: extractedInfo.inspectionDate
        },
        trusteeInfo: {
          name: extractedInfo.trusteeName,
          title: extractedInfo.trusteeTitle
        },
        flags: extractedInfo.flags
      },
      summary: 'Appointment and Property Inspection Document'
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
