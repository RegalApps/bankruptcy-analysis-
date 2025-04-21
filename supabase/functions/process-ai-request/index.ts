
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, documentId } = await req.json();

    // Enhanced system prompt for form analysis
    const systemPrompt = `You are an expert in Canadian bankruptcy and insolvency documents, specializing in form analysis and risk assessment. 
    Pay special attention to Form 31 (Proof of Claim) requirements including:
    - Creditor identification and contact details
    - Claim amount and classification
    - Supporting documentation requirements
    - Signature and attestation requirements
    
    For any form analysis:
    1. Identify the form type and number
    2. Extract all relevant fields and data
    3. Assess compliance with OSB requirements
    4. Flag any missing required information
    5. Provide a risk assessment
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        temperature: 0.2, // Lower temperature for more focused analysis
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store analysis results if document ID is provided
    if (documentId) {
      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('document_analysis')
        .select('*')
        .eq('document_id', documentId)
        .maybeSingle();

      if (!fetchError) {
        const analysisContent = {
          formType: 'form-31',
          aiAnalysis: aiResponse,
          lastUpdated: new Date().toISOString(),
          riskAssessment: extractRiskAssessment(aiResponse),
          requiredFields: extractRequiredFields(aiResponse),
          complianceStatus: assessComplianceStatus(aiResponse)
        };

        if (existingAnalysis) {
          await supabase
            .from('document_analysis')
            .update({ content: analysisContent })
            .eq('document_id', documentId);
        } else {
          await supabase
            .from('document_analysis')
            .insert({
              document_id: documentId,
              content: analysisContent
            });
        }
      }
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-ai-request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper functions for parsing AI response
function extractRiskAssessment(aiResponse: string) {
  // Extract risk assessment section from AI response
  const riskPattern = /Risk Assessment:[\s\S]*?(?=\n\n|$)/i;
  const match = aiResponse.match(riskPattern);
  return match ? match[0] : '';
}

function extractRequiredFields(aiResponse: string) {
  // Extract required fields section from AI response
  const fieldsPattern = /Required Fields:[\s\S]*?(?=\n\n|$)/i;
  const match = aiResponse.match(fieldsPattern);
  return match ? match[0].split('\n').filter(line => line.trim()) : [];
}

function assessComplianceStatus(aiResponse: string) {
  // Determine compliance status based on AI response
  const hasErrors = aiResponse.toLowerCase().includes('error') || 
                   aiResponse.toLowerCase().includes('missing required');
  const hasWarnings = aiResponse.toLowerCase().includes('warning') || 
                     aiResponse.toLowerCase().includes('recommended');
                     
  return {
    status: hasErrors ? 'non-compliant' : hasWarnings ? 'warning' : 'compliant',
    timestamp: new Date().toISOString()
  };
}
