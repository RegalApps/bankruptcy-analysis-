
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  documentId?: string;
  documentText?: string;
  includeRegulatory?: boolean;
  includeClientExtraction?: boolean;
  extractionMode?: 'standard' | 'comprehensive';
  title?: string;
  formType?: string;
  isExcelFile?: boolean;
}

const FUNCTION_TIMEOUT = 25000; // 25 seconds - edge functions have a 30s limit

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Function timed out after 25 seconds')), FUNCTION_TIMEOUT);
  });

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      documentId, 
      documentText, 
      includeRegulatory = true, 
      includeClientExtraction = true, 
      extractionMode = 'standard', 
      title = '',
      formType = '',
      isExcelFile = false
    } = await req.json();

    console.log(`Analysis request received for document ID: ${documentId}, form type: ${formType}, title: ${title}`);

    if (!documentId && !documentText) {
      throw new Error('Either documentId or documentText must be provided');
    }
    
    // Handle Excel files with simplified workflow
    if (isExcelFile && documentId) {
      console.log("Processing Excel file with simplified workflow");
      
      let clientName = "Unknown Client";
      if (title) {
        const nameMatch = title.match(/(?:form[- ]?76[- ]?|)([a-z\s]+)(?:\.|$)/i);
        if (nameMatch && nameMatch[1]) {
          clientName = nameMatch[1].trim();
          console.log(`Extracted client name from Excel filename: ${clientName}`);
        }
      }
      
      await supabase
        .from('documents')
        .update({ 
          ai_processing_status: 'complete',
          metadata: {
            fileType: 'excel',
            formType: formType || 'unknown',
            formNumber: formType === 'form-76' ? '76' : (title.match(/Form\s+(\d+)/i)?.[1] || ''),
            client_name: clientName,
            processing_complete: true,
            processing_time_ms: 200,
            last_analyzed: new Date().toISOString(),
            simplified_processing: true
          }
        })
        .eq('id', documentId);
        
      return new Response(JSON.stringify({
        success: true,
        message: "Excel file processed with simplified workflow",
        extracted_info: {
          clientName,
          fileType: 'excel',
          formType: formType || 'unknown',
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // If we have a document ID but no document text, retrieve the document content
    let processedDocumentText = documentText;
    if (documentId && !documentText) {
      console.log(`Fetching document content for ID: ${documentId}`);
      const { data: document, error } = await supabase
        .from('documents')
        .select('metadata, title, storage_path')
        .eq('id', documentId)
        .single();
      
      if (error) {
        console.error("Error fetching document:", error);
        throw error;
      }
      
      if (document?.metadata?.content) {
        processedDocumentText = document.metadata.content;
        console.log("Retrieved document content from metadata");
      } else if (document?.storage_path) {
        // If we don't have content in metadata, we could retrieve the file from storage
        // This would need implementation based on your storage setup
        console.log("Document content not available in metadata");
      }
    }

    // Validate that we have actual document text from a form, not documentation about forms
    let validatedText = processedDocumentText || "";
    
    // Check if this appears to be documentation instead of actual form content
    const isDocumentationPattern = /\bAI\b|\bassistant\b|\bextract the following\b|\btemplate\b|\bjson format\b|\breturn json\b|\bsample output\b/i;
    const hasDocumentationIndicators = isDocumentationPattern.test(validatedText);
    
    if (hasDocumentationIndicators) {
      console.warn("Warning: Document text appears to contain documentation instead of actual form data");
      
      // Log a sample of the problematic content for debugging
      console.log("Sample of problematic content:", validatedText.substring(0, 200));
      
      // We could implement fallback extraction here
      // This might involve retrieving the actual document from storage
    }

    // Check if we have a detectable form type from the content or title
    let detectedFormType = "";
    let detectedFormNumber = "";
    
    // Look for form type in title or content
    if (title?.toLowerCase().includes("form 31") || title?.toLowerCase().includes("proof of claim") || 
        validatedText?.toLowerCase().includes("form 31") || validatedText?.toLowerCase().includes("proof of claim")) {
      detectedFormType = "form-31";
      detectedFormNumber = "31";
      console.log("Detected Form 31 (Proof of Claim)");
    } else if (title?.toLowerCase().includes("form 47") || title?.toLowerCase().includes("consumer proposal") ||
               validatedText?.toLowerCase().includes("form 47") || validatedText?.toLowerCase().includes("consumer proposal")) {
      detectedFormType = "form-47";
      detectedFormNumber = "47";
      console.log("Detected Form 47 (Consumer Proposal)");
    }

    // Extract basic form fields from document text for validation
    let formFields: any = {};
    if (validatedText) {
      const getField = (regex: RegExp) => {
        const match = validatedText.match(regex);
        return match ? match[1].trim() : "";
      };
      
      formFields = {
        formNumber: detectedFormNumber || getField(/form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i),
        clientName: getField(/(?:debtor|client)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i),
        claimantName: getField(/(?:claimant|creditor)\s*name[\s:]*([\w\s.-]+)/i),
        trusteeName: getField(/(?:trustee|lit)[\s:]*([\w\s.-]+)/i),
        dateSigned: getField(/(?:date|signed)[\s:]*([\d\/.-]+)/i),
        claimAmount: getField(/(?:claim|amount)[\s:]*\$?\s*([\d,.]+)/i),
        estateNumber: getField(/(?:estate|bankruptcy)\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i),
        courtFileNumber: getField(/court\s+file\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i),
      };
      
      // Form 31 specific fields
      if (detectedFormNumber === "31") {
        formFields.securityDescription = getField(/security\s+(?:held|described|valued)[\s:]*([^.]+)/i);
        formFields.claimType = getField(/claim(?:s|ed)?\s+as\s+(?:an?\s+)?(unsecured|secured|preferred|priority|wage earner|farmer|fisherman|director)/i);
        
        const checkboxPattern = /\b[☑✓✗]?\s*([a-g])(?:\s*\.|\s+[a-z]+)/i;
        const checkboxMatch = validatedText.match(checkboxPattern);
        if (checkboxMatch && checkboxMatch[1]) {
          formFields.claimCheckbox = checkboxMatch[1].toUpperCase();
        }
      }
      
      console.log("Initial form field extraction:", formFields);
    }

    // Check if we have valid form data based on the extracted fields
    const hasValidFormData = formFields.clientName || formFields.claimantName || formFields.claimAmount;
    
    if (!hasValidFormData) {
      console.warn("Warning: No valid form data could be extracted from document text");
    }

    // Configure the OpenAI prompt based on form type
    let openAIPrompt = "";
    if (detectedFormType === "form-31" || 
        formType === "form-31" || 
        /form[\s-]*31\b/i.test(title) || 
        /proof of claim/i.test(title)) {
      openAIPrompt =
`You are a Canadian bankruptcy document analyst specializing in Form 31 (Proof of Claim).

IMPORTANT: You are analyzing a REAL Form 31 document, NOT documentation ABOUT Form 31.
EXTRACT ACTUAL DATA from the document, do NOT return general information about the form.

Analyze the provided Form 31 document and extract the following specific data:

PARTY INFORMATION:
- Debtor's full legal name (the person/company who is bankrupt)
- Creditor's full name (the person/company making the claim)
- Creditor's complete address
- Representative information (if present)
- Contact information (phone, email)

CLAIM DETAILS:
- Total claim amount (exact dollar figure)
- Claim type (which box A-J is checked)
- Security details (if claim is secured)
- Estate/bankruptcy number
- Supporting documents mentioned
- Signature status (signed or unsigned)
- Date of signature

IMPORTANT: Extract ONLY what's ACTUALLY in the document. Do not make up information.
If a field is not present in the document, mark it as "Not provided" rather than inventing content.

Return in this exact JSON format:
{
  "extracted_info": {
    "formType": "form-31",
    "formNumber": "31",
    "debtorName": "",
    "creditorName": "",
    "creditorAddress": "",
    "claimAmount": "",
    "claimType": "",
    "estateNumber": "", 
    "dateSigned": "",
    "securityDescription": "",
    "supportingDocuments": "",
    "isSigned": true/false
  },
  "summary": "Brief one-sentence summary of this specific claim",
  "risks": [
    {
      "type": "Missing information/compliance issue",
      "description": "Specific description of what's missing",
      "severity": "high/medium/low",
      "regulation": "Specific BIA section number",
      "solution": "How to resolve this specific issue"
    }
  ]
}`;
    } 
    else if (detectedFormType === "form-47" || 
             formType === "form-47" || 
             /form[\s-]*47\b/i.test(title) || 
             /consumer proposal/i.test(title)) {
      openAIPrompt =
`You are a Canadian bankruptcy document analyst specializing in Form 47 (Consumer Proposal).

IMPORTANT: You are analyzing a REAL Form 47 document, NOT documentation ABOUT Form 47.
EXTRACT ACTUAL DATA from the document, do NOT return general information about the form.

Analyze the provided Form 47 document and extract these specific details:

CLIENT INFORMATION:
- Client/Consumer's full legal name (as it appears on the form)
- Current residential address
- Administrator/trustee name and license number (if visible)
- Filing date (exact date on the form)
- Marital status and spouse/partner details (if provided)

FINANCIAL DETAILS:
- Monthly proposal payment amount (exact figure)
- Proposal duration (months/years)
- Total assets value (if listed)
- Total liabilities amount (if listed)
- Monthly income (if provided)
- Monthly expenses (if provided)

SIGNATURES & AUTHENTICATION:
- Whether debtor has signed (yes/no)
- Whether administrator has signed (yes/no)
- Whether witness signature is present (yes/no)

IMPORTANT: Extract ONLY what's ACTUALLY in the document. Do not make up information.
If a field is not present, mark it as "Not provided" rather than inventing content.

Return in this exact JSON format:
{
  "extracted_info": {
    "formType": "form-47",
    "formNumber": "47",
    "clientName": "",
    "clientAddress": "",
    "administratorName": "",
    "filingDate": "",
    "proposalPayment": "",
    "proposalDuration": "",
    "totalAssets": "",
    "totalLiabilities": "",
    "monthlyIncome": "",
    "monthlyExpenses": ""
  },
  "summary": "Brief one-sentence summary of this specific consumer proposal",
  "risks": [
    {
      "type": "Missing information/compliance issue",
      "description": "Specific description of what's missing",
      "severity": "high/medium/low",
      "regulation": "Specific BIA section number",
      "solution": "How to resolve this specific issue"
    }
  ]
}`;
    }
    else {
      openAIPrompt =
`You are an expert in Canadian bankruptcy and insolvency document analysis.

IMPORTANT: You are analyzing a REAL bankruptcy document, NOT documentation ABOUT bankruptcy forms.
EXTRACT ACTUAL DATA from the document, do NOT return general information about document types.

Please extract:
1. The specific form type/number (if detectable)
2. Client/debtor name as it appears in the document
3. Any dates mentioned (filing dates, signature dates)
4. Any monetary amounts mentioned
5. Any risks or compliance issues visible in the document

Use concise, factual extraction only. If information isn't present, indicate "Not provided" rather than inventing content.

Return in this exact JSON format:
{
  "extracted_info": {
    "formType": "",
    "formNumber": "",
    "clientName": "",
    "dateSigned": "",
    "otherDates": {},
    "monetaryAmounts": {}
  },
  "summary": "Brief factual summary of this specific document",
  "risks": []
}`;
    }

    // Only call OpenAI if we have document text to process
    let openAIResponseContent = "";
    let aiData: any = {};
    
    console.log("Calling OpenAI with document text length:", (validatedText || "").length);
    
    if (validatedText) {
      // Add debug info to help diagnose problematic content
      const textSample = validatedText.substring(0, 200) + '...';
      console.log("Sample of text being sent to OpenAI:", textSample);
      
      try {
        // Call OpenAI API with better error handling
        const fetchAI = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: openAIPrompt },
              { role: 'user', content: validatedText }
            ],
            temperature: 0.1  // Lower temperature for more deterministic extraction
          }),
        });
        
        if (!fetchAI.ok) {
          const errorText = await fetchAI.text();
          console.error(`OpenAI API error (${fetchAI.status}):`, errorText);
          throw new Error(`OpenAI API error: ${fetchAI.status} - ${errorText}`);
        }
        
        const aiJSON = await fetchAI.json();
        openAIResponseContent = aiJSON.choices?.[0]?.message?.content || "";
        
        // Log the AI response for debugging
        console.log("OpenAI response received, length:", openAIResponseContent.length);
        console.log("Response sample:", openAIResponseContent.substring(0, 200) + '...');
      } catch (aiError) {
        console.error("Error calling OpenAI API:", aiError);
        throw new Error(`OpenAI API error: ${aiError.message}`);
      }
    }

    // Parse and validate the AI response
    try {
      if (openAIResponseContent) {
        try {
          aiData = JSON.parse(openAIResponseContent);
          console.log("Successfully parsed OpenAI response as JSON");
        } catch (parseErr) {
          console.error("Error parsing OpenAI response as JSON:", parseErr);
          // Handle non-JSON responses by extracting JSON from the text
          const jsonMatch = openAIResponseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              aiData = JSON.parse(jsonMatch[0]);
              console.log("Extracted and parsed JSON from OpenAI response");
            } catch (extractErr) {
              console.error("Failed to extract JSON from OpenAI response:", extractErr);
              aiData = { 
                summary: "Error: Could not parse OpenAI response", 
                extracted_info: formFields,
                error: "Could not parse JSON; using basic field extraction"
              };
            }
          } else {
            console.warn("Response doesn't contain valid JSON structure");
            aiData = { 
              summary: openAIResponseContent.substring(0, 100), 
              extracted_info: formFields,
              error: "Could not parse JSON; using basic field extraction"
            };
          }
        }
      } else {
        // If we didn't get an OpenAI response, use our basic extraction
        console.log("No OpenAI response, using basic field extraction");
        aiData = {
          extracted_info: formFields,
          summary: "Document analysis performed using basic extraction",
        };
      }
    } catch (validationErr) {
      console.error("Error during response validation:", validationErr);
      aiData = { 
        summary: "Error during validation", 
        extracted_info: formFields,
        error: validationErr.message
      };
    }

    // Add validation to ensure we have actual form data in the response
    if (aiData && typeof aiData === 'object') {
      // Check if extracted_info exists and has data
      if (!aiData.extracted_info || Object.keys(aiData.extracted_info).length === 0) {
        console.warn("No extracted_info in OpenAI response, using basic extraction");
        aiData.extracted_info = formFields;
      }
      
      // Ensure we have formType and formNumber
      if (!aiData.extracted_info.formType) {
        aiData.extracted_info.formType = detectedFormType || formType || 'unknown';
      }
      
      if (!aiData.extracted_info.formNumber) {
        aiData.extracted_info.formNumber = detectedFormNumber || formFields.formNumber || '';
      }
      
      // Validate risks structure
      if (!Array.isArray(aiData.risks)) {
        aiData.risks = [];
      }
      
      // Ensure risks have proper structure
      aiData.risks = aiData.risks.map(risk => ({
        type: risk.type || 'Unknown Risk',
        description: risk.description || 'No description provided',
        severity: risk.severity || 'medium',
        regulation: risk.regulation || 'Not specified',
        solution: risk.solution || 'Review document for completeness'
      }));
      
      // Add a special risk if we detected documentation instead of form data
      if (hasDocumentationIndicators) {
        aiData.risks.push({
          type: "Document Content Issue",
          description: "The document appears to contain documentation about forms rather than actual form data",
          severity: "high",
          regulation: "BIA Processing Requirements",
          solution: "Upload the actual form document rather than documentation"
        });
      }
    }
    
    // Create complete result object
    const result = {
      ...(typeof aiData === "object" && aiData !== null ? aiData : { summary: openAIResponseContent }),
      extracted_fields: formFields,
      processing_info: {
        detectedFormType,
        documentLength: validatedText?.length || 0,
        processingTime: new Date().toISOString(),
        documentIdUsed: documentId || null,
        hasDocumentationIndicators,
        hasValidFormData
      }
    };
    
    // Log the final result for debugging
    console.log("Final analysis result created");

    // Store results in Supabase if we have a document ID
    if (documentId) {
      try {
        console.log(`Storing analysis results for document ID: ${documentId}`);
        
        // Get document owner
        const { data: documentOwner, error: ownerError } = await supabase
          .from('documents')
          .select('user_id')
          .eq('id', documentId)
          .single();

        if (ownerError) {
          console.error('Error fetching document owner:', ownerError);
        }

        if (documentOwner) {
          // Store analysis in document_analysis table
          const { error: analysisError } = await supabase
            .from('document_analysis')
            .upsert({
              document_id: documentId,
              user_id: documentOwner.user_id,
              content: result,
              created_at: new Date().toISOString()
            });

          if (analysisError) {
            console.error('Error saving analysis:', analysisError);
          }

          // Update document metadata
          let documentMetadata: Record<string, any> = {
            formType: result.extracted_info?.formType,
            formNumber: result.extracted_info?.formNumber,
            processing_complete: true,
            last_analyzed: new Date().toISOString(),
            processing_steps_completed: ["analysis_complete"],
            processing_time_ms: Date.now() - new Date().getTime(),
            client_name: result.extracted_info?.clientName || result.extracted_info?.debtorName,
            submission_deadline: result.extracted_info?.submissionDeadline,
            filing_date: result.extracted_info?.filingDate,
            administratorName: result.extracted_info?.administratorName
          };
          
          // Add form-specific metadata
          if (detectedFormType === "form-31" || 
              /form[\s-]*31\b/i.test(title) || 
              /proof of claim/i.test(title)) {
            documentMetadata = {
              ...documentMetadata,
              formNumber: "31",
              formType: "proof-of-claim",
              claimant_name: result.extracted_info?.creditorName || result.extracted_info?.claimantName,
              claim_amount: result.extracted_info?.claimAmount || formFields.claimAmount,
              claim_type: result.extracted_info?.claimType || formFields.claimType,
              security_description: result.extracted_info?.securityDescription || formFields.securityDescription,
              has_compliance_issues: (result.risks?.length > 0) || false
            };
          } else if (detectedFormType === "form-47" ||
                    /form[\s-]*47\b/i.test(title) ||
                    /consumer proposal/i.test(title)) {
            documentMetadata = {
              ...documentMetadata,
              formNumber: "47",
              formType: "consumer-proposal",
              proposal_payment: result.extracted_info?.proposalPayment,
              proposal_duration: result.extracted_info?.proposalDuration,
              total_assets: result.extracted_info?.totalAssets,
              total_liabilities: result.extracted_info?.totalLiabilities,
              has_compliance_issues: (result.risks?.length > 0) || false
            };
          }

          // Update document metadata
          const { error: updateError } = await supabase
            .from('documents')
            .update({ 
              ai_processing_status: 'complete',
              metadata: documentMetadata
            })
            .eq('id', documentId);

          if (updateError) {
            console.error('Error updating document status:', updateError);
          }
        }
      } catch (dbError) {
        console.error('Database operation error:', dbError);
      }
    }

    // Return the analysis result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
