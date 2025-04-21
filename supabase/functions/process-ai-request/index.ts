
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

    console.log("Using OpenAI API key:", openAIApiKey ? `${openAIApiKey.substring(0, 4)}...${openAIApiKey.substring(openAIApiKey.length - 4)}` : "No key found");

    // Form-specific system prompts for enhanced analysis
    let systemPrompt = `You are an expert in Canadian bankruptcy and insolvency documents, specializing in form analysis and risk assessment.`;
    
    if (message.toLowerCase().includes('form 31') || message.toLowerCase().includes('proof of claim')) {
      systemPrompt += `
      You are analyzing Form 31 (Proof of Claim). Pay special attention to these elements based on the BIA framework:
      
      1. Document Verification:
      - Form title must be "Form 31 - Proof of Claim" (BIA Form 31)
      - Current version prescribed by the Superintendent (Rule 150)
      - Estate/bankruptcy number must be included (Rule 73)
      - Court file reference if applicable (Rule 73(1))
      
      2. Key Information to Extract:
      - Debtor identification (full legal name, address, entity type)
      - Creditor details (full legal name, complete mailing address, business/individual status)
      - Representative information (name, address, relationship to creditor)
      - Contact methods (phone, email, fax)
      - Total claim amount (in Canadian funds)
      - Interest calculation details
      - Claim type classification (A-J codes)
      - Security details for secured claims
      
      3. Required Attachments:
      - Schedule A: Statement of Account
      - Supporting documents (original or certified copies)
      - Affidavit if applicable (Form 95)
      - Security documents for secured claims
      - Proxy Form (Form 36) if representative filing
      
      4. Critical Verification Points:
      - Signature and authentication (Rule 31(1))
      - Correct claim classification (Section 4)
      - Priority claims properly supported (s. 136)
      - Related party relationships disclosed (s. 4(5))
      - Filed within claim period (s. 124(4))
      
      5. Critical Deadlines for Form 31:
      - Claims for first meeting: 2 days before creditor meeting (BIA s. 102(1))
      - Ordinary bankruptcy claims: 30 days after first creditor meeting (BIA s. 124(4))
      - Claims after notice: Time specified in notice (BIA s. 124(2)) 
      - Late filing allowance: Within trustee's discretion (BIA s. 124(4))
      - Pre-discharge claims: Before discharge (BIA s. 178)
      
      For any section, identify if there are HIGH, MEDIUM, or LOW risk issues and provide solutions.
      HIGH risks include missing signatures, no claim amount, wrong debtor name, or missing attachments.
      MEDIUM risks include incorrect claim type, insufficient supporting docs, or undisclosed relationships.
      LOW risks include formatting issues, illegible handwriting, or missing non-essential info.
      
      Structure your response in a clear section-by-section assessment with specific references to the BIA.
      `;
    } else if (message.toLowerCase().includes('form 47') || message.toLowerCase().includes('consumer proposal')) {
      systemPrompt += `
      You are analyzing Form 47 (Consumer Proposal). Pay special attention to:
      - Debtor identification and contact details
      - Administrator/Trustee information 
      - Proposed payment terms and amounts
      - Surplus income calculations
      - Creditor treatment details
      - Signature requirements by all parties

      Form 47 requires:
      1. Complete debtor information
      2. Clear payment terms and amounts
      3. Administrator certification
      4. Proper signatures from all parties
      5. Compliance with surplus income regulations
      
      Ensure you flag any missing required fields as HIGH risk items.
      `;
    } else {
      systemPrompt += `
      Pay attention to all bankruptcy and insolvency forms, looking for:
      - Complete identification details
      - Required signatures and dates
      - Required financial information
      - Supporting documentation requirements
      
      For any form analysis:
      1. Identify the form type and number
      2. Extract all relevant fields and data
      3. Assess compliance with OSB requirements
      4. Flag any missing required information
      5. Provide a risk assessment
      `;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store analysis results if document ID provided
    if (documentId) {
      // For brevity, you may add back detailed result processing here if needed
      // This snippet mainly focuses on key usage and logs for the new key
      console.log(`Document ID: ${documentId} - AI analysis response length: ${aiResponse.length}`);
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
