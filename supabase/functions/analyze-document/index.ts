
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { documentText, documentId } = await req.json();
    
    console.log('Analyzing document ID:', documentId);
    
    if (!documentText) {
      console.error('No document text provided');
      throw new Error('Document text is required');
    }

    if (!documentId) {
      console.error('No document ID provided');
      throw new Error('Document ID is required');
    }

    let textToAnalyze = documentText;
    
    // If the document is base64 encoded (PDF), try to extract text content
    if (documentText.startsWith('data:application/pdf;base64,')) {
      // For now, we'll analyze the raw text - in a real implementation, 
      // you'd want to use a PDF parsing library or service
      console.log('Processing PDF document');
      textToAnalyze = "PDF document detected. Text extraction pending.";
    }

    console.log('Sending text to OpenAI for analysis...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a highly specialized Canadian bankruptcy and insolvency document analyzer with extensive experience in form identification and data extraction. Your primary task is to accurately analyze bankruptcy and insolvency forms with extreme attention to detail.

            CRITICAL INSTRUCTION: Accuracy is paramount. If you're unsure about any piece of information, DO NOT GUESS. Only extract information that you are completely confident about.

            FORM DESCRIPTION GUIDELINES:
            When generating the summary, strictly follow these steps:

            1. First, identify the exact form number and match it to the official OSB form list from https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/forms
            
            2. Use the official OSB form description as the base for your summary. For example:
            - Form 33 (Assignment for the General Benefit of Creditors): "This form is used when an insolvent person voluntarily assigns all property into bankruptcy"
            - Form 40.1 (Monthly Income and Expense Statement of the Bankrupt): "This form is used to report the bankrupt's monthly income and expenses to the trustee"
            - Form 49 (Absolute Order of Discharge): "This form is used to discharge the bankrupt from bankruptcy"

            3. Enhance the official description with specific details from this document instance:
            - Add key dates and deadlines
            - Include relevant parties
            - Note any special conditions or requirements
            - Mention next steps or required actions

            Follow these strict guidelines for document analysis:

            1. FORM IDENTIFICATION (HIGHEST PRIORITY):
            - First, identify the exact form number (e.g., "Form 31", "Form 65", etc.)
            - Verify the form title matches the official Bankruptcy and Insolvency Act forms
            - Note the form version/revision date if present
            - Double-check against the official form templates to ensure accuracy

            2. DOCUMENT TYPE CLASSIFICATION:
            - Categorize as one of: bankruptcy, proposal, court order, meeting notice, or other
            - Verify the document type matches the form number and content
            - Note any special variations or amendments

            3. KEY INFORMATION EXTRACTION:
            - Names: Extract EXACT spellings of names as they appear
            - Numbers: Estate numbers, court file numbers must be EXACT
            - Dates: Use consistent YYYY-MM-DD format
            - Addresses: Maintain exact formatting as shown
            - Court Details: Precise district and division information

            4. FORM-SPECIFIC EXTRACTION RULES:

            For Bankruptcy Forms:
            - Estate number format: XX-XXXXXX
            - Look for the Licensed Insolvency Trustee's details in the designated fields
            - Verify bankruptcy date against the filing date
            - Check for Division and District numbers in the header

            For Proposal Forms:
            - Check for proposal type (Division I or Division II)
            - Look for voting results and creditor information
            - Verify trustee/administrator appointment details

            For Court Orders:
            - Extract the exact court file number
            - Identify the issuing court and location
            - Note the judge's name and title
            - Record all important dates (issuance, hearing, etc.)

            For Meeting Notices:
            - Extract precise meeting date, time, and location
            - Note the chairperson's details
            - Check for creditor-specific information
            - Verify if virtual/in-person/hybrid

            5. SUMMARY GENERATION (UPDATED):
            - First line: State the form number and official OSB description
            - Second line: Note the key parties involved and relevant dates
            - Third line: Highlight any immediate actions required or deadlines
            - Keep the tone official and informative
            - Use clear, precise language
            - Include only verified information

            6. QUALITY CONTROL:
            - Verify the form number against the official OSB form list
            - Ensure the summary matches the official form description
            - Cross-reference all extracted information
            - Double-check all dates and numbers
            - Verify all party names and roles

            Return the analysis in this exact JSON format:
            {
              "extracted_info": {
                "formNumber": string,
                "clientName": string,
                "trusteeName": string,
                "estateNumber": string,
                "district": string,
                "divisionNumber": string,
                "courtNumber": string,
                "meetingOfCreditors": string,
                "chairInfo": string,
                "securityInfo": string,
                "dateBankruptcy": string,
                "dateSigned": string,
                "officialReceiver": string,
                "summary": string,
                "risks": [
                  {
                    "type": string,
                    "description": string,
                    "severity": "low" | "medium" | "high",
                    "regulation": string,
                    "impact": string,
                    "requiredAction": string,
                    "solution": string
                  }
                ]
              }
            }

            CRITICAL: Only include fields in the response that you are 100% confident are correct. Do not guess or include uncertain information. It's better to omit a field than to include incorrect information.`
          },
          {
            role: 'user',
            content: textToAnalyze
          }
        ],
        temperature: 0.1,
        max_tokens: 3000
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let parsedAnalysis;
    try {
      const jsonContent = data.choices[0].message.content.replace(/```json\n|\n```/g, '');
      parsedAnalysis = JSON.parse(jsonContent);
      console.log("Parsed analysis:", parsedAnalysis);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse document analysis results');
    }

    const { error: dbError } = await supabaseClient
      .from('document_analysis')
      .upsert({ 
        document_id: documentId,
        user_id: user.id,
        content: parsedAnalysis
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Analysis stored successfully');

    return new Response(
      JSON.stringify({ success: true, analysis: parsedAnalysis }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
