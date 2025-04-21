
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

    // Form-specific system prompts for enhanced analysis
    let systemPrompt = `You are an expert in Canadian bankruptcy and insolvency documents, specializing in form analysis and risk assessment.`;
    
    // Check if this is a Form 31 analysis 
    if (message.toLowerCase().includes('form 31') || message.toLowerCase().includes('proof of claim')) {
      systemPrompt += `
      You are analyzing Form 31 (Proof of Claim). Pay special attention to:
      - Creditor identification and contact details (Section 1)
      - Claim amount and classification (Sections A-G)
      - Supporting documentation requirements (Section 2)
      - Signature and attestation requirements (Section 3)
      - Security description if applicable

      Form 31 requires:
      1. Complete creditor information
      2. Selection of proper claim type (A-G checkboxes)
      3. Valid claim amount
      4. Appropriate supporting documents
      5. Proper signature and dating
      
      Ensure you flag any missing required fields as HIGH risk items.
      `;
    } 
    // Check if this is a Form 47 analysis
    else if (message.toLowerCase().includes('form 47') || message.toLowerCase().includes('consumer proposal')) {
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
    } 
    // General analysis for other forms
    else {
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
        model: 'gpt-4o-mini',  // Using the recommended model
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
        // Process the AI response to extract structured information
        let formType = 'unknown';
        let formNumber = '';
        
        // Identify form type from AI response
        if (aiResponse.toLowerCase().includes('form 31') || aiResponse.toLowerCase().includes('proof of claim')) {
          formType = 'form-31';
          formNumber = '31';
        } else if (aiResponse.toLowerCase().includes('form 47') || aiResponse.toLowerCase().includes('consumer proposal')) {
          formType = 'form-47';
          formNumber = '47';
        }
        
        // Extract structured risk assessment and required fields
        const analysisContent = {
          formType,
          formNumber,
          aiAnalysis: aiResponse,
          lastUpdated: new Date().toISOString(),
          extracted_info: extractFormInfo(aiResponse, formType),
          risks: extractRiskAssessment(aiResponse),
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
function extractRiskAssessment(aiResponse) {
  // Extract risk items from AI response
  const risks = [];
  
  // Match risk patterns in the response
  const riskPattern = /risk|missing|incomplete|required|invalid/i;
  const lines = aiResponse.split('\n');
  
  let currentRisk = null;
  
  for (const line of lines) {
    // Check for risk headers with severity indicators
    const highRiskMatch = line.match(/high risk|critical|severe/i);
    const mediumRiskMatch = line.match(/medium risk|moderate|warning/i);
    const lowRiskMatch = line.match(/low risk|minor/i);
    
    if ((highRiskMatch || mediumRiskMatch || lowRiskMatch) && riskPattern.test(line)) {
      // Start a new risk item
      if (currentRisk) {
        risks.push(currentRisk);
      }
      
      currentRisk = {
        type: line.replace(/[:-].*$/, '').trim(),
        description: line.replace(/^[^:]*:/, '').trim() || line,
        severity: highRiskMatch ? 'high' : (mediumRiskMatch ? 'medium' : 'low'),
        regulation: '',
        solution: ''
      };
    } 
    // Continue building the current risk with additional details
    else if (currentRisk && line.trim()) {
      // Check for solution or regulation information
      if (/solution|recommendation|fix|resolve/i.test(line)) {
        currentRisk.solution = line.replace(/^[^:]*:/, '').trim();
      } else if (/regulation|compliance|requirement|bla|law|act|directive/i.test(line)) {
        currentRisk.regulation = line.replace(/^[^:]*:/, '').trim();
      } else {
        // Append to description if not a special field
        currentRisk.description += ' ' + line.trim();
      }
    }
  }
  
  // Add the last risk if there is one
  if (currentRisk) {
    risks.push(currentRisk);
  }
  
  // If no structured risks were found, extract based on paragraphs
  if (risks.length === 0) {
    // Fallback method: extract paragraphs that mention risks
    const paragraphs = aiResponse.split('\n\n');
    
    for (const paragraph of paragraphs) {
      if (riskPattern.test(paragraph)) {
        const severity = /high|critical|severe/i.test(paragraph) ? 'high' :
                       (/medium|moderate|warning/i.test(paragraph) ? 'medium' : 'low');
        
        risks.push({
          type: paragraph.substring(0, 40).replace(/[:-].*$/, '').trim() + '...',
          description: paragraph,
          severity,
          regulation: '',
          solution: ''
        });
      }
    }
  }
  
  return risks;
}

function extractRequiredFields(aiResponse) {
  // Extract required fields section from AI response
  const fieldsPattern = /required fields|key fields|mandatory information/i;
  const sections = aiResponse.split('\n\n');
  
  for (const section of sections) {
    if (fieldsPattern.test(section)) {
      return section.split('\n').filter(line => line.trim()).map(line => line.trim());
    }
  }
  
  return [];
}

function extractFormInfo(aiResponse, formType) {
  // Extract key form information based on form type
  const info = {};
  
  // Common fields to extract
  [
    { field: 'clientName', patterns: [/debtor name:([^,\n]+)/i, /client name:([^,\n]+)/i] },
    { field: 'trusteeName', patterns: [/trustee:([^,\n]+)/i, /lit name:([^,\n]+)/i] },
    { field: 'dateSigned', patterns: [/date signed:([^,\n]+)/i, /signature date:([^,\n]+)/i] },
    { field: 'formNumber', patterns: [/form number:([^,\n]+)/i, /form #:([^,\n]+)/i] }
  ].forEach(({ field, patterns }) => {
    patterns.some(pattern => {
      const match = aiResponse.match(pattern);
      if (match && match[1]) {
        info[field] = match[1].trim();
        return true;
      }
      return false;
    });
  });
  
  // Form 31 specific fields
  if (formType === 'form-31') {
    [
      { field: 'claimantName', patterns: [/creditor name:([^,\n]+)/i, /claimant:([^,\n]+)/i] },
      { field: 'claimAmount', patterns: [/claim amount:([^,\n]+)/i, /amount:([^,\n]+)/i] },
      { field: 'claimType', patterns: [/claim type:([^,\n]+)/i, /type of claim:([^,\n]+)/i] }
    ].forEach(({ field, patterns }) => {
      patterns.some(pattern => {
        const match = aiResponse.match(pattern);
        if (match && match[1]) {
          info[field] = match[1].trim();
          return true;
        }
        return false;
      });
    });
  }
  
  // Form 47 specific fields
  if (formType === 'form-47') {
    [
      { field: 'proposalType', patterns: [/proposal type:([^,\n]+)/i] },
      { field: 'monthlyPayment', patterns: [/monthly payment:([^,\n]+)/i, /payment:([^,\n]+)/i] }
    ].forEach(({ field, patterns }) => {
      patterns.some(pattern => {
        const match = aiResponse.match(pattern);
        if (match && match[1]) {
          info[field] = match[1].trim();
          return true;
        }
        return false;
      });
    });
  }
  
  // Set defaults for form number and type if not found
  info.type = formType || 'unknown';
  info.formNumber = info.formNumber || (formType === 'form-31' ? '31' : formType === 'form-47' ? '47' : '');
  
  return info;
}

function assessComplianceStatus(aiResponse) {
  // Determine compliance status based on AI response
  const hasErrors = aiResponse.toLowerCase().includes('error') || 
                   aiResponse.toLowerCase().includes('missing required') ||
                   aiResponse.toLowerCase().includes('high risk');
                   
  const hasWarnings = aiResponse.toLowerCase().includes('warning') || 
                     aiResponse.toLowerCase().includes('recommended') ||
                     aiResponse.toLowerCase().includes('medium risk');
                     
  return {
    status: hasErrors ? 'non-compliant' : hasWarnings ? 'warning' : 'compliant',
    timestamp: new Date().toISOString()
  };
}
