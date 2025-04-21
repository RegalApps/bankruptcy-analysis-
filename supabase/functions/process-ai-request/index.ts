
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
    // Log request details
    console.log("Received AI processing request");
    const requestData = await req.json();
    const { message, documentId, module } = requestData;

    // Validate OpenAI API key presence
    if (!openAIApiKey) {
      console.error("ERROR: OpenAI API key is missing");
      throw new Error('OpenAI API key is not configured');
    }

    // Log key presence (without exposing the actual key)
    console.log(`OpenAI API key status: ${openAIApiKey ? 'Present (masked: ' + 
      `${openAIApiKey.substring(0, 3)}...${openAIApiKey.substring(openAIApiKey.length - 3)}` + ')' : 'Missing'}`);
    
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

    console.log(`Starting OpenAI API request with model: gpt-4o-mini`);
    console.log(`Message length: ${message.length} characters`);
    
    const startTime = Date.now();
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

    const responseTime = Date.now() - startTime;
    console.log(`OpenAI API responded in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log(`Received AI response of length: ${aiResponse.length} characters`);
    console.log(`Response first 100 chars: ${aiResponse.substring(0, 100)}...`);

    // Store analysis results if document ID provided
    if (documentId) {
      try {
        console.log(`Storing analysis results for document ID: ${documentId}`);
        
        // Get document data to update metadata
        const { data: document, error: docError } = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/documents?id=eq.${documentId}&select=*`, {
          headers: {
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
          }
        }).then(res => res.json());
        
        if (docError) {
          console.error('Error fetching document:', docError);
        } else {
          console.log(`Retrieved document data: ${document ? 'success' : 'not found'}`);
        }

        // Store analysis in document_analysis table
        const analysisPayload = {
          document_id: documentId,
          user_id: "system", // We'll update this with actual user ID if available
          content: {
            extracted_info: {
              formType: document?.[0]?.metadata?.formType || 'unknown',
              formNumber: document?.[0]?.metadata?.formNumber || '',
              summary: aiResponse.substring(0, 500),
            },
            risks: extractRisksFromText(aiResponse),
            full_analysis: aiResponse
          }
        };
        
        console.log(`Preparing analysis payload: ${JSON.stringify(analysisPayload).substring(0, 200)}...`);
        
        const { error: analysisError } = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/document_analysis`, {
          method: 'POST',
          headers: {
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(analysisPayload)
        }).then(res => res.ok ? {error: null} : res.json());

        if (analysisError) {
          console.error('Error saving analysis:', analysisError);
        } else {
          console.log('Analysis saved successfully to document_analysis table');
        }
          
        // Update document status
        const { error: updateError } = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/documents?id=eq.${documentId}`, {
          method: 'PATCH',
          headers: {
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            ai_processing_status: 'complete',
            metadata: {
              ...document?.[0]?.metadata,
              last_analyzed: new Date().toISOString(),
              analysis_status: 'complete'
            }
          })
        }).then(res => res.ok ? {error: null} : res.json());
        
        if (updateError) {
          console.error('Error updating document status:', updateError);
        } else {
          console.log('Document status updated successfully');
        }
      } catch (storageError) {
        console.error('Error storing analysis results:', storageError);
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

// Helper function to extract risk items from text
function extractRisksFromText(text) {
  const risks = [];
  
  // Look for RISK patterns in the text
  const riskPatterns = [
    /HIGH RISK:? (.*?)(?=\n|$)/gi,
    /MEDIUM RISK:? (.*?)(?=\n|$)/gi,
    /LOW RISK:? (.*?)(?=\n|$)/gi,
    /Risk: (.*?)(?=\n|$)/gi
  ];
  
  riskPatterns.forEach((pattern, index) => {
    const severity = index === 0 ? 'high' : index === 1 ? 'medium' : 'low';
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      risks.push({
        type: `Risk Item ${risks.length + 1}`,
        description: match[1].trim(),
        severity: severity,
        regulation: "BIA Requirement",
        solution: "Review and correct the issue"
      });
    }
  });
  
  // If no specific risk patterns found, look for sections containing risk words
  if (risks.length === 0) {
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (/risk|missing|incomplete|required|invalid/i.test(line)) {
        risks.push({
          type: "Potential Issue",
          description: line.trim(),
          severity: "medium",
          regulation: "BIA Requirement",
          solution: "Review and verify compliance"
        });
      }
    });
  }
  
  // If we still didn't find risks and text is long enough, create at least one default risk item
  if (risks.length === 0 && text.length > 300) {
    risks.push({
      type: "Document Review Needed",
      description: "AI analysis completed, but no specific risks were automatically identified. Manual review recommended.",
      severity: "low",
      regulation: "BIA General Compliance",
      solution: "Review the document manually to ensure all requirements are met."
    });
  }
  
  return risks;
}
