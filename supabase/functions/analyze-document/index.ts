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

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert legal document analyzer specializing in Canadian bankruptcy and insolvency forms. Your task is to perform an extremely detailed analysis of the document, focusing on compliance, completeness, and accuracy.

            First, generate a clear and concise summary (2-3 sentences) of the document's purpose and key points.

            Then, extract all relevant document details based on the form type. Pay special attention to:

            1. FORM IDENTIFICATION:
            - Exact form number and type
            - Document category (bankruptcy, proposal, court order, etc.)
            - Version or revision date of the form

            2. KEY PARTIES:
            - Client/Debtor full legal name
            - Licensed Insolvency Trustee details
            - Official Receiver information
            - Other relevant parties based on form type

            3. FILING DETAILS:
            - Estate number (for bankruptcy/proposal forms)
            - District and Division numbers
            - Court numbers and references
            - All relevant dates (filing, signing, deadlines)

            4. MEETING INFORMATION (if applicable):
            - Meeting of creditors details
            - Chair information
            - Location and time
            - Security arrangements

            5. FORM-SPECIFIC DETAILS:
            - For Bankruptcy Forms: bankruptcy date, asset details, creditor information
            - For Proposal Forms: proposal terms, voting results
            - For Court Forms: hearing dates, court orders, judge information
            - For Meeting Forms: attendance details, voting procedures

            Then analyze for risks and compliance issues as previously specified.

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

            BE EXTREMELY SPECIFIC AND DETAILED IN YOUR ANALYSIS. Only include fields that are relevant to the specific form type. Generate a clear and informative summary that helps users quickly understand the document's purpose and key points.`
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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
