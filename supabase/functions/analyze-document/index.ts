
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractFormDetails(text: string) {
  // Extract form number - check for various formats
  const formPatterns = [
    /form\s*(?:no\.?|number|#)?\s*(\d+)/i,
    /f(?:orm)?\-?(\d+)/i,
    /^(?:form)?\s*(\d+)/im
  ];

  let formNumber = '';
  for (const pattern of formPatterns) {
    const match = text.match(pattern);
    if (match) {
      formNumber = match[1];
      break;
    }
  }

  // Detect Form 33 from filename or content
  if (text.toLowerCase().includes('f33') || text.toLowerCase().includes('form 33')) {
    formNumber = '33';
  }

  return {
    formNumber,
    type: formNumber ? `Form ${formNumber}` : 'Unknown Form',
    isConsumerProposal: formNumber === '33'
  };
}

function analyzeForm33(text: string) {
  const info: any = {
    risks: []
  };

  // Extract consumer debtor details with multiple patterns
  const debtorPatterns = [
    /(?:consumer\s+debtor|debtor)(?:'s)?\s*name\s*[:]\s*([^\n\r.]+)/i,
    /name\s+of\s+(?:consumer\s+)?debtor\s*[:]\s*([^\n\r.]+)/i,
    /(?:^|\n)name\s*[:]\s*([^\n\r.]+)/i
  ];

  for (const pattern of debtorPatterns) {
    const match = text.match(pattern);
    if (match) {
      info.clientName = match[1].trim();
      break;
    }
  }

  // Extract administrator details
  const adminPatterns = [
    /administrator\s*[:]\s*([^\n\r.]+)/i,
    /(?:licensed\s+)?insolvency\s+(?:trustee|administrator)\s*[:]\s*([^\n\r.]+)/i,
    /trustee\s*[:]\s*([^\n\r.]+)/i
  ];

  for (const pattern of adminPatterns) {
    const match = text.match(pattern);
    if (match) {
      info.trusteeName = match[1].trim();
      break;
    }
  }

  // Extract date with multiple patterns
  const datePatterns = [
    /(?:filing|filed)\s*date\s*[:]\s*([^\n\r.]+)/i,
    /date\s*(?:of\s*filing)?\s*[:]\s*([^\n\r.]+)/i,
    /dated\s*(?:this)?\s*[:]\s*([^\n\r.]+)/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      info.dateSigned = match[1].trim();
      break;
    }
  }

  // Risk Assessment
  if (!info.clientName) {
    info.risks.push({
      type: "Missing Consumer Debtor Information",
      description: "Consumer debtor's name is not clearly specified in the document",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "May affect the validity of the consumer proposal",
      requiredAction: "Ensure consumer debtor's full name is included",
      solution: "Add complete consumer debtor information to the form"
    });
  }

  if (!info.trusteeName) {
    info.risks.push({
      type: "Missing Administrator Information",
      description: "Licensed Insolvency Trustee/Administrator information is not specified",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "Cannot verify authorized administrator for the proposal",
      requiredAction: "Include licensed administrator details",
      solution: "Add complete administrator information to the form"
    });
  }

  if (!info.dateSigned) {
    info.risks.push({
      type: "Missing Filing Date",
      description: "Filing date is not clearly specified",
      severity: "medium",
      regulation: "BIA Section 66.13",
      impact: "Cannot determine timing requirements for the proposal process",
      requiredAction: "Add filing date",
      solution: "Include the date of filing on the form"
    });
  }

  // Add Form 33 specific risks
  info.risks.push({
    type: "Consumer Proposal Timeline",
    description: "Notice of Intention initiates strict timeline requirements",
    severity: "medium",
    regulation: "BIA Section 66.13",
    impact: "Must file consumer proposal within 10 days of filing Notice of Intention",
    requiredAction: "Monitor filing deadline",
    solution: "Ensure consumer proposal is filed within 10 days of this notice"
  });

  return info;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText?.length });

    if (!documentId || !documentText) {
      throw new Error('Document ID and text are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Extract form details
    const formDetails = extractFormDetails(documentText);
    console.log('Detected form details:', formDetails);

    // Process form specific information
    let extractedInfo = {
      type: formDetails.type,
      formNumber: formDetails.formNumber,
      clientName: '',
      trusteeName: '',
      dateSigned: '',
      summary: formDetails.formNumber === '33' 
        ? 'Notice of Intention to Make a Consumer Proposal under Section 66.13 of the Bankruptcy and Insolvency Act. This initiates a consumer proposal process and provides protection from creditors while the proposal is being prepared.'
        : `This is ${formDetails.type}. Please refer to the Bankruptcy and Insolvency Act for specific requirements.`
    };

    // Add form-specific analysis
    if (formDetails.isConsumerProposal) {
      const form33Info = analyzeForm33(documentText);
      extractedInfo = {
        ...extractedInfo,
        ...form33Info
      };
    }

    console.log('Extracted info:', extractedInfo);

    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      throw new Error('Failed to save analysis');
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
