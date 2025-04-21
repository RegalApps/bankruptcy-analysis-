
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
    const { message, documentId, module, formType, title, testMode } = requestData;

    // Debug information collection
    const debugInfo = {
      timestamps: {
        start: new Date().toISOString(),
        openAIRequestStart: null,
        openAIRequestEnd: null,
        analysisStorageStart: null,
        analysisStorageEnd: null,
        end: null
      },
      status: {
        openAIKeyPresent: Boolean(openAIApiKey),
        openAIRequestSuccess: false,
        documentFound: false,
        documentUpdated: false,
        analysisStorageSuccess: false
      },
      metadata: {
        documentId,
        module,
        formType,
        title,
        testMode: Boolean(testMode),
        messageLength: message?.length || 0
      },
      errors: []
    };

    // Validate OpenAI API key presence
    if (!openAIApiKey) {
      console.error("ERROR: OpenAI API key is missing");
      debugInfo.errors.push('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    // Log key presence (without exposing the actual key)
    console.log(`OpenAI API key status: ${openAIApiKey ? 'Present (masked: ' + 
      `${openAIApiKey.substring(0, 3)}...${openAIApiKey.substring(openAIApiKey.length - 3)}` + ')' : 'Missing'}`);
    
    // Test mode - just check API connectivity without full document analysis
    if (testMode) {
      try {
        debugInfo.timestamps.openAIRequestStart = new Date().toISOString();
        const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: 'You are a test assistant. Please respond with "OpenAI connection successful."' 
              },
              { 
                role: 'user', 
                content: 'Test OpenAI connection' 
              }
            ],
            max_tokens: 20,
          }),
        });
        
        debugInfo.timestamps.openAIRequestEnd = new Date().toISOString();
        
        if (!testResponse.ok) {
          const errorBody = await testResponse.text();
          console.error(`OpenAI API test error: ${testResponse.status} - ${errorBody}`);
          debugInfo.errors.push(`OpenAI API returned error: ${testResponse.status} - ${errorBody}`);
          throw new Error(`OpenAI API error: Status ${testResponse.status}`);
        }
        
        const testData = await testResponse.json();
        debugInfo.status.openAIRequestSuccess = true;
        
        return new Response(
          JSON.stringify({ 
            response: "OpenAI connection test successful", 
            debugInfo: debugInfo,
            testData: testData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("OpenAI test mode error:", error);
        debugInfo.errors.push(`OpenAI test error: ${error.message}`);
        
        return new Response(
          JSON.stringify({ 
            error: error.message,
            debugInfo: debugInfo,
            timestamp: new Date().toISOString()
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // Form-specific system prompts for enhanced analysis
    let systemPrompt = `You are an expert in Canadian bankruptcy and insolvency documents, specializing in form analysis and risk assessment.`;
    
    // Enhanced prompt for Form 31
    if (formType === 'form-31' || (title && title.toLowerCase().includes('proof of claim'))) {
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
      
      IMPORTANT: Always return results with proper JSON structure containing these fields:
      - extracted_info: Containing all extracted document information including creditorName, debtorName, claimAmount, claimType, securityDetails
      - summary: A brief overview of the document (approximately 2-3 sentences)
      - risks: An array of objects with type, description, severity, regulation, and solution fields
      `;
    } else if (formType === 'form-47' || (title && title.toLowerCase().includes('consumer proposal'))) {
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
      
      IMPORTANT: Always return results with proper JSON structure containing these fields:
      - extracted_info: Containing all extracted document information
      - summary: A brief overview of the document
      - risks: An array of objects with type, description, severity, regulation, and solution fields
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
      
      IMPORTANT: Always return results with proper JSON structure containing these fields:
      - extracted_info: Containing all extracted document information
      - summary: A brief overview of the document
      - risks: An array of objects with type, description, severity, regulation, and solution fields
      `;
    }

    console.log(`Starting OpenAI API request with model: gpt-4o-mini`);
    console.log(`Message length: ${message?.length} characters`);
    console.log(`Form type detected: ${formType || 'Unknown'}`);
    
    debugInfo.timestamps.openAIRequestStart = new Date().toISOString();
    
    // Verify we have a message to process
    if (!message || message.length < 10) {
      debugInfo.errors.push('Document content too short or empty');
      throw new Error('Document content too short or empty. Please check the file.');
    }
    
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
        response_format: { type: "json_object" }, // Enforce JSON response
      }),
    });

    const responseTime = Date.now() - startTime;
    debugInfo.timestamps.openAIRequestEnd = new Date().toISOString();
    console.log(`OpenAI API responded in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      debugInfo.errors.push(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    debugInfo.status.openAIRequestSuccess = true;
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log(`Received AI response of length: ${aiResponse?.length} characters`);
    console.log(`Response first 100 chars: ${aiResponse?.substring(0, 100)}...`);

    // Try parsing the response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      console.log("Successfully parsed OpenAI response as JSON");
      
      // Log parsed data structure to help with debugging
      console.log("Parsed response structure:");
      console.log("- extracted_info present:", !!parsedResponse.extracted_info);
      console.log("- summary present:", !!parsedResponse.summary);
      console.log("- risks present:", !!parsedResponse.risks && Array.isArray(parsedResponse.risks));
      
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", e);
      console.log("Raw response:", aiResponse);
      // Attempt to extract structured data from unstructured response
      parsedResponse = {
        extracted_info: {
          summary: aiResponse?.substring(0, 500)
        },
        risks: extractRisksFromText(aiResponse || "")
      };
    }

    // Ensure we have all required fields with default values if missing
    parsedResponse = {
      extracted_info: parsedResponse?.extracted_info || {},
      summary: parsedResponse?.summary || 
               parsedResponse?.extracted_info?.summary || 
               "Document analyzed but no summary was generated.",
      risks: parsedResponse?.risks || []
    };

    // Store analysis results if document ID provided
    if (documentId) {
      try {
        debugInfo.timestamps.analysisStorageStart = new Date().toISOString();
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
          debugInfo.errors.push(`Error fetching document: ${docError}`);
        } else {
          debugInfo.status.documentFound = !!document?.length;
          console.log(`Retrieved document data: ${document ? 'success' : 'not found'}`);
        }

        // First, delete any existing analysis for this document to prevent duplicates
        console.log(`Deleting existing analysis for document ID: ${documentId}`);
        const { error: deleteError } = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/document_analysis?document_id=eq.${documentId}`, {
          method: 'DELETE',
          headers: {
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        }).then(res => res.ok ? {error: null} : res.json());

        if (deleteError) {
          console.warn('Error deleting existing analysis:', deleteError);
          debugInfo.errors.push(`Error deleting existing analysis: ${deleteError}`);
        } else {
          console.log('Successfully deleted existing analysis entries if any');
        }

        // Prepare consistent analysis structure
        const analysisPayload = {
          document_id: documentId,
          user_id: "system", // We'll update this with actual user ID if available
          content: {
            extracted_info: parsedResponse.extracted_info,
            summary: parsedResponse.summary,
            risks: parsedResponse.risks,
            full_analysis: aiResponse,
            debug_info: debugInfo
          }
        };
        
        console.log(`Preparing analysis payload with extracted info and ${parsedResponse.risks?.length} risks`);
        
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
          debugInfo.errors.push(`Error saving analysis: ${analysisError}`);
        } else {
          console.log('Analysis saved successfully to document_analysis table');
          debugInfo.status.analysisStorageSuccess = true;
        }
          
        // Update document status and metadata with form information
        const updateMetadata = {
          ...(document?.[0]?.metadata || {}),
          last_analyzed: new Date().toISOString(),
          analysis_status: 'complete',
          formType: formType || parsedResponse.extracted_info?.formType || null,
          // Also store key extracted fields in document metadata for easier querying
          clientName: parsedResponse.extracted_info?.clientName || 
                     parsedResponse.extracted_info?.debtorName || null,
          formNumber: parsedResponse.extracted_info?.formNumber || 
                     (formType === 'form-31' ? '31' : formType === 'form-47' ? '47' : null)
        };
        
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
            metadata: updateMetadata
          })
        }).then(res => res.ok ? {error: null} : res.json());
        
        if (updateError) {
          console.error('Error updating document status:', updateError);
          debugInfo.errors.push(`Error updating document status: ${updateError}`);
        } else {
          console.log('Document status updated successfully');
          debugInfo.status.documentUpdated = true;
        }

        debugInfo.timestamps.analysisStorageEnd = new Date().toISOString();
      } catch (storageError) {
        console.error('Error storing analysis results:', storageError);
        debugInfo.errors.push(`Error storing analysis results: ${storageError.message}`);
      }
    }

    // Complete debug info
    debugInfo.timestamps.end = new Date().toISOString();

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        parsedData: parsedResponse, 
        debugInfo: debugInfo 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-ai-request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to extract risk items from text
function extractRisksFromText(text: string) {
  console.log("Extracting risks from text...");
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
  
  // Look for structured risk information in a more general way
  const sections = text.split(/\n\n|\r\n\r\n/);
  sections.forEach(section => {
    if (section.toLowerCase().includes('risk') && !section.toLowerCase().includes('low risk') && 
        !section.toLowerCase().includes('medium risk') && !section.toLowerCase().includes('high risk')) {
      // Check if this section contains risk information
      const lines = section.split(/\n|\r\n/);
      if (lines.length >= 2) {
        // Try to determine severity based on content
        let severity = 'medium'; // Default
        if (section.toLowerCase().includes('critical') || section.toLowerCase().includes('severe') ||
            section.toLowerCase().includes('important') || section.toLowerCase().includes('major')) {
          severity = 'high';
        } else if (section.toLowerCase().includes('minor') || section.toLowerCase().includes('small')) {
          severity = 'low';
        }
        
        risks.push({
          type: lines[0].trim(),
          description: lines.slice(1).join(' ').trim(),
          severity: severity,
          regulation: "BIA Requirement",
          solution: "Review and address this issue"
        });
      }
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
  
  console.log(`Extracted ${risks.length} risks from text`);
  return risks;
}
