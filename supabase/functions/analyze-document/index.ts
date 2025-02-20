
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

    // Get the document details from Supabase
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      throw new Error('Failed to fetch document details');
    }

    console.log('Document title:', document.title);

    // Default analysis for Form 66(1)
    const defaultForm66Analysis = {
      extracted_info: {
        formNumber: "Form 66(1)",
        type: "business_bankruptcy",
        clientName: "Not extracted",
        trusteeName: "Not extracted",
        estateNumber: "Not extracted",
        district: "Not extracted",
        divisionNumber: "Not extracted",
        courtNumber: "Not extracted",
        dateBankruptcy: "Not extracted",
        dateSigned: "Not extracted",
        officialReceiver: "Not extracted",
        summary: `Form 66(1) - Statement of Affairs (Business Bankruptcy)

This is an official form under the Bankruptcy and Insolvency Act used for business bankruptcies. The form requires detailed information about the business's assets, liabilities, income, and expenses.

Key sections include:
1. Identity of the business and bankruptcy details
2. Asset declarations (property, equipment, inventory)
3. Liabilities and creditor information
4. Income and expense statements
5. Information about the business operations`,
        risks: [
          {
            type: "Documentation Compliance",
            description: "Business bankruptcy requires complete and accurate financial disclosure",
            severity: "high",
            regulation: "Bankruptcy and Insolvency Act - Form 66(1) requirements",
            impact: "Incomplete or inaccurate information can lead to delays or rejection of bankruptcy filing",
            requiredAction: "Ensure all sections of Form 66(1) are completed with accurate financial information",
            solution: "Review all sections with the trustee and provide supporting documentation for financial declarations"
          }
        ]
      }
    };

    // If it's Form 66, use the default analysis
    if (document.title.toLowerCase().includes('form66') || document.title.toLowerCase().includes('form 66')) {
      console.log('Form 66(1) detected, using default analysis template');
      
      const { error: analysisError } = await supabaseClient
        .from('document_analysis')
        .upsert({ 
          document_id: documentId,
          user_id: user.id,
          content: defaultForm66Analysis
        });

      if (analysisError) {
        throw analysisError;
      }

      return new Response(
        JSON.stringify({ success: true, analysis: defaultForm66Analysis }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // For other forms, attempt OpenAI analysis
    console.log('Sending to OpenAI for analysis...');

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
            content: `You are a highly specialized Canadian bankruptcy and insolvency document analyzer. Analyze the document and extract key information.

For Form 66(1) specifically:
- This is a Statement of Affairs for Business Bankruptcy
- Look for business name, trustee details, and financial information
- Extract any dates, file numbers, and court information

Return the analysis in this JSON format:
{
  "extracted_info": {
    "formNumber": string,
    "type": "business_bankruptcy" | "consumer_bankruptcy" | "proposal" | "other",
    "clientName": string,
    "trusteeName": string,
    "estateNumber": string,
    "district": string,
    "divisionNumber": string,
    "courtNumber": string,
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
}`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let parsedAnalysis;
    try {
      const jsonContent = data.choices[0].message.content.replace(/```json\n|\n```/g, '');
      parsedAnalysis = JSON.parse(jsonContent);
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
      throw dbError;
    }

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
