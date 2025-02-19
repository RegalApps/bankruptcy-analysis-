
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client to get user information
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Get user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { documentText, documentId } = await req.json();
    
    console.log('Received request with document ID:', documentId);
    
    if (!documentText) {
      console.error('No document text provided');
      throw new Error('Document text is required');
    }

    if (!documentId) {
      console.error('No document ID provided');
      throw new Error('Document ID is required');
    }

    // Call OpenAI API to analyze the document
    console.log('Calling OpenAI API...');
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
            content: `You are an expert in bankruptcy and insolvency document analysis, specifically for Canadian bankruptcy forms. Extract all required information and assess compliance with regulations.

            For bankruptcy forms, look for and extract these specific fields:
            1. Form Number (usually at the top of the document)
            2. Client/Debtor Name
            3. Licensed Insolvency Trustee Name
            4. Estate Number
            5. District Information
            6. Division Number
            7. Court Number
            8. Meeting of Creditors Details
            9. Chair Information
            10. Security Details
            11. Date of Bankruptcy
            12. Date Form Signed
            13. Official Receiver Information

            For risk assessment, specifically check for:
            1. Missing required fields (list each missing field specifically)
            2. Incomplete information in required fields
            3. Inconsistencies between dates (comparing date of bankruptcy, date signed, and meeting dates)
            4. Missing signatures or authorizations
            5. Non-compliance with form requirements (check against official guidelines)
            6. Deadline-related risks (identify any approaching or passed deadlines)
            7. Documentation completeness (check if all required attachments are mentioned)
            8. Accuracy of financial information (check for any discrepancies)
            9. Procedural compliance (verify if proper procedures were followed)
            10. Creditor-related risks (assess if creditor rights are properly addressed)

            Provide a detailed assessment with:
            - Clear identification of each risk
            - Specific description of what's missing or incorrect
            - Severity level (high/medium/low) based on potential impact
            - References to relevant sections of bankruptcy regulations where applicable

            Return the analysis in this exact JSON format:
            {
              "extracted_info": {
                "formNumber": string | null,
                "clientName": string | null,
                "trusteeName": string | null,
                "estateNumber": string | null,
                "district": string | null,
                "divisionNumber": string | null,
                "courtNumber": string | null,
                "meetingOfCreditors": string | null,
                "chairInfo": string | null,
                "securityInfo": string | null,
                "dateBankruptcy": string | null,
                "dateSigned": string | null,
                "officialReceiver": string | null,
                "summary": string,
                "risks": [
                  {
                    "type": string,
                    "description": string (be specific about which fields are missing or incomplete),
                    "severity": "low" | "medium" | "high",
                    "regulation": string | null
                  }
                ]
              }
            }`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
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
      // Extract JSON from the response content, removing any markdown formatting
      const jsonContent = data.choices[0].message.content.replace(/```json\n|\n```/g, '');
      parsedAnalysis = JSON.parse(jsonContent);
      console.log("Parsed analysis:", parsedAnalysis);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse document analysis results');
    }

    // Store the analysis in the database with user_id
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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
