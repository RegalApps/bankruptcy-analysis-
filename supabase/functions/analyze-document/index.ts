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
    
    console.log('Analyzing document ID:', documentId);
    
    if (!documentText) {
      console.error('No document text provided');
      throw new Error('Document text is required');
    }

    if (!documentId) {
      console.error('No document ID provided');
      throw new Error('Document ID is required');
    }

    // Call OpenAI API with enhanced prompt
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
            content: `You are an expert legal document analyzer specializing in Canadian bankruptcy and insolvency forms. Your task is to perform an extremely detailed analysis of the document, focusing on compliance, completeness, and accuracy. Be extremely specific in identifying issues.

            For each risk or issue found, you must provide:
            1. EXACT LOCATION of the issue (e.g., "Section 4.2, paragraph 2", "Signature field on page 3", etc.)
            2. SPECIFIC DETAILS about what's wrong (not just "missing signature" but "Licensed Insolvency Trustee's signature missing from Form 65 Declaration")
            3. EXPLICIT REFERENCE to the relevant regulation or requirement
            4. CLEAR IMPACT of the issue on the bankruptcy proceeding

            Analyze the following aspects with extreme detail:

            1. MISSING REQUIRED FIELDS:
            - List every required field that is missing
            - Cite the specific section of the form where each field should be
            - Reference the regulatory requirement for each field

            2. INCOMPLETE FIELDS:
            - Identify fields that are present but incomplete
            - Specify exactly what information is missing from each field
            - Explain why the provided information is insufficient

            3. SIGNATURE VERIFICATION:
            - Check ALL required signature locations
            - Verify presence of specific required signatures (debtor, trustee, witness)
            - Confirm date stamps where required
            - Verify witness information completeness

            4. FORM COMPLIANCE:
            - Compare against official form requirements
            - Check formatting and section completeness
            - Verify correct form version is being used
            - Confirm all required attachments are referenced

            5. DATES AND DEADLINES:
            - Verify all dates are properly formatted
            - Check for date inconsistencies
            - Flag any missed or approaching deadlines
            - Confirm chronological order of events

            6. DOCUMENTATION COMPLETENESS:
            - List any missing required attachments
            - Verify cross-references between documents
            - Check for required supporting documentation
            - Confirm all schedules are included and complete

            7. PROCEDURAL COMPLIANCE:
            - Verify proper filing sequence
            - Check notice requirements
            - Confirm proper service to all parties
            - Verify jurisdictional requirements

            For each risk identified, provide:
            {
              "type": "Specific category of the issue",
              "description": "Extremely detailed description including exact location, specific problem, and what needs to be fixed",
              "severity": "high/medium/low based on legal impact",
              "regulation": "Specific reference to the relevant regulation, form requirement, or legal precedent",
              "impact": "Clear explanation of the consequences if not addressed",
              "requiredAction": "Specific steps needed to resolve the issue"
            }

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
                    "requiredAction": string
                  }
                ]
              }
            }

            BE EXTREMELY SPECIFIC AND DETAILED IN YOUR ANALYSIS. FOCUS ON ACTIONABLE INSIGHTS AND CLEAR INSTRUCTIONS FOR RESOLUTION.`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        temperature: 0.2,
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
