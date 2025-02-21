
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
    clientInfo?: {
      name: string;
      phoneNumber?: string;
      address?: string;
    };
    appointmentDetails?: {
      date: string;
      time: string;
    };
    propertyInfo?: {
      address: string;
      inspectionDate?: string;
    };
    trusteeInfo?: {
      name: string;
      title: string;
    };
  };
  summary?: string;
}

function capitalizeAddress(address: string): string {
  return address
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseDateTime(dateTimeStr: string): { date: string; time: string } {
  const date = new Date(dateTimeStr);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  
  return {
    date: `${day} ${month}, ${year}`,
    time: `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  };
}

async function parseDocument(text: string): Promise<AnalysisResult['extracted_info']> {
  try {
    console.log('Parsing document text:', text);
    
    // Extract client name (assuming it's at the start)
    const clientNameMatch = text.match(/^([A-Za-z\s]+?)(?=\d|$)/);
    
    // Extract phone number
    const phoneMatch = text.match(/(\d{3}-\d{3}-\d{4})/);
    
    // Extract addresses
    const addresses = text.match(/\d+[^,\n]*(?:drive|street)/gi);
    
    // Extract date and time
    const dateTimeMatch = text.match(/(\d{1,2}\s+[A-Za-z]+,\s*\d{4}\s+\d{1,2}:\d{2}(?:am|pm)?)/i);
    
    // Extract inspection date
    const inspectionDateMatch = text.match(/(\d{4}\/\s*\d{2}\/\s*\d{2})/);
    
    // Extract trustee information
    const trusteeMatch = text.match(/([A-Za-z\s]+)\s+Trustee\b/i);

    let dateTime = { date: '', time: '' };
    if (dateTimeMatch) {
      try {
        dateTime = parseDateTime(dateTimeMatch[1]);
      } catch (e) {
        console.error('Error parsing date time:', e);
      }
    }

    const extractedInfo = {
      type: 'Appointment Document',
      clientInfo: {
        name: clientNameMatch ? clientNameMatch[1].trim() : '',
        phoneNumber: phoneMatch ? phoneMatch[1] : '',
        address: addresses ? capitalizeAddress(addresses[0]) : ''
      },
      appointmentDetails: {
        date: dateTime.date,
        time: dateTime.time
      },
      propertyInfo: {
        address: addresses && addresses[1] ? capitalizeAddress(addresses[1]) : '',
        inspectionDate: inspectionDateMatch ? inspectionDateMatch[1].replace(/\s+/g, '') : ''
      },
      trusteeInfo: {
        name: trusteeMatch ? trusteeMatch[1].trim() : '',
        title: 'Trustee'
      }
    };

    console.log('Extracted info:', extractedInfo);
    return extractedInfo;
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error(`Failed to parse document: ${error.message}`);
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
    
    let analysisResult: AnalysisResult = {
      type: 'Appointment Document',
      extracted_info: await parseDocument(cleanedText),
      summary: 'Appointment and Property Inspection Document'
    };

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
