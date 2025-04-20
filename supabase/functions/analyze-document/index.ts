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

// Add timeout to prevent function from running indefinitely
const FUNCTION_TIMEOUT = 25000; // 25 seconds - edge functions have a 30s limit

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Use a timer to enforce function timeout
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

    console.log(`Analysis request received for document ID: ${documentId}, form type: ${formType}, isExcelFile: ${isExcelFile}`);

    // If no document ID or text, return error
    if (!documentId && !documentText) {
      throw new Error('Either documentId or documentText must be provided');
    }
    
    // Fast path for Excel files - just extract client name and metadata, no full analysis
    if (isExcelFile && documentId) {
      console.log("Processing Excel file with simplified workflow");
      
      // Extract client name from filename if possible
      let clientName = "Unknown Client";
      if (title) {
        const nameMatch = title.match(/(?:form[- ]?76[- ]?|)([a-z\s]+)(?:\.|$)/i);
        if (nameMatch && nameMatch[1]) {
          clientName = nameMatch[1].trim();
          console.log(`Extracted client name from Excel filename: ${clientName}`);
        }
      }
      
      // Update document with basic metadata - fast operation
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

    // --------- 1. Enhanced form field extraction ---------
    // Extract form fields for specialized OpenAI prompt
    let formFields: any = {};
    if (documentText) {
      // Use same logic as extractFormFields (JS duplicated here for Deno)
      const getField = (regex: RegExp) => {
        const match = documentText.match(regex);
        return match ? match[1].trim() : "";
      };
      let detectedFormNumber = "";
      if (/form[\s\-]*31\b/i.test(documentText) || /\bproof of claim\b/i.test(documentText)) {
        detectedFormNumber = "31";
      } else if (/form[\s\-]*47\b/i.test(documentText) || /\bconsumer proposal\b/i.test(documentText)) {
        detectedFormNumber = "47";
      }
      formFields = {
        formNumber: detectedFormNumber || getField(/form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i),
        clientName: getField(/(?:debtor|client)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i),
        claimantName: getField(/(?:claimant|creditor)\s*name[\s:]*([\w\s.-]+)/i),
        trusteeName: getField(/(?:trustee|lit)[\s:]*([\w\s.-]+)/i),
        dateSigned: getField(/(?:date|signed)[\s:]*([\d\/.-]+)/i),
      };
    }

    // --------- 2. Specialized OpenAI prompt per form type ---------
    let openAIPrompt = "";
    if (
      formFields.formNumber === "47" ||
      formType === "form-47" ||
      /form[\s-]*47\b/i.test(title) ||
      /consumer proposal/i.test(title)
    ) {
      openAIPrompt =
`You are a professional document analyst for Canadian insolvency forms.

FORM: 47 - Consumer Proposal

Please extract the following details:

- **Client/Consumer Debtor Name**
- **Administrator (Trustee) Name and Address**
- **Filing Date, Submission Deadline, First Payment Date**
- **Secured Creditors Payment Terms**
- **Preferred Claims Payment Terms**
- **Administrator Fees and Expenses**
- **Unsecured Creditors Payment Schedule**
- **Dividend Distribution Schedule**
- **Signatures (debtor, administrator, witness - include detected names/roles and if missing)**
- **Summary of document purpose (1-2 sentences, plain English)**
- **ALL regulatory deadlines and their status (met/missing/approaching)**

Also, perform a detailed compliance & risk review as follows:

- Identify and list any *missing fields, signature issues, deadline risks, payment discrepancies, incomplete schedules, or regulatory problems*.
- For each risk, include: **type (compliance/legal/etc), severity (high/med/low), BIA/OSB reference, impact, required action, recommended solution, and a deadline if relevant.**

Return a structured JSON result:
{
  "summary":"",
  "extracted_info": { ... },
  "risk_assessment": [ ... ],
  "signatures": [
    { "role":"debtor", "present":true, ... }
  ]
}`;
    }
    else if (
      formFields.formNumber === "31" ||
      formType === "form-31" ||
      /form[\s-]*31\b/i.test(title) ||
      /proof of claim/i.test(title)
    ) {
      openAIPrompt =
`You are a Canadian insolvency and bankruptcy document analysis assistant.

FORM: 31 - Proof of Claim

Extract these details:

- **Creditor/Claimant Name**
- **Debtor Name**
- **Amount of Claim, Classification (secured/unsecured/preferred)**
- **Execution Date and Location**
- **Signature of Creditor and Witness (are they present?)**
- **Bankruptcy estate/case number**

Provide a concise summary of claim details.

Perform a compliance & legal risk check:

- Check for missing or incorrectly completed sections.
- Check statutory references (e.g., BIA Section 124/125), signature requirements and deadlines.

List all detected risks/problems as a JSON array including for each: type, section, severity, impact, solution.

Return a structured JSON like:
{
  "summary":"",
  "form_fields": {},
  "risk_assessment": []
}`;
    }
    else {
      openAIPrompt =
`You are an expert in Canadian bankruptcy and insolvency document analysis. Please extract the client detail, summary, and compliance risk assessment for this form.`;
    }

    // --------- 3. Send tailored prompt to OpenAI ---------
    // In production, ensure you have openAIApiKey wired/available here
    let openAIResponseContent = "";
    if (documentText) {
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
            { role: 'user', content: documentText }
          ],
          temperature: 0.2
        }),
      });
      const aiJSON = await fetchAI.json();
      openAIResponseContent = aiJSON.choices?.[0]?.message?.content || "";
    }

    // --------- 4. Parse AI result (as best as possible) and save ---------
    let aiData = {};
    try {
      aiData = openAIResponseContent ? JSON.parse(openAIResponseContent) : {};
    } catch (err) {
      aiData = { summary: openAIResponseContent, error: "Could not parse JSON; original OpenAI response provided." };
    }

    const result = {
      ...(
        typeof aiData === "object" && aiData !== null
        ? aiData
        : { summary: openAIResponseContent }
      ),
      extracted_fields: formFields
    };

    if (documentId) {
      await Promise.race([
        (async () => {
          try {
            // Get the user ID who owns the document
            const { data: documentOwner, error: ownerError } = await supabase
              .from('documents')
              .select('user_id')
              .eq('id', documentId)
              .single();

            if (ownerError) {
              console.error('Error fetching document owner:', ownerError);
              // Continue with default processing even if owner lookup fails
            } 
            
            if (documentOwner) {
              // Save analysis results
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

              // Update document status
              const { error: updateError } = await supabase
                .from('documents')
                .update({ 
                  ai_processing_status: 'complete',
                  metadata: {
                    formType: result.extracted_info.formType,
                    formNumber: result.extracted_info.formNumber,
                    processing_complete: true,
                    last_analyzed: new Date().toISOString(),
                    processing_steps_completed: ["analysis_complete"],
                    processing_time_ms: Date.now() - new Date().getTime(),
                    client_name: result.extracted_info.clientName,
                    submission_deadline: result.extracted_info.submissionDeadline,
                    filing_date: result.extracted_info.filingDate,
                    administratorName: result.extracted_info.administratorName,
                    documentStatus: result.extracted_info.documentStatus
                  }
                })
                .eq('id', documentId);

              if (updateError) {
                console.error('Error updating document status:', updateError);
              }
              
              // Create a deadline notification for Form 47 based on submission deadline
              if (result.extracted_info.formNumber === '47' && result.extracted_info.submissionDeadline) {
                const submissionDate = new Date(result.extracted_info.submissionDeadline);
                const now = new Date();
                
                if (submissionDate > now) {
                  try {
                    // Add deadline to document
                    const { data: document } = await supabase
                      .from('documents')
                      .select('deadlines')
                      .eq('id', documentId)
                      .single();
                      
                    const deadlines = document?.deadlines || [];
                    
                    await supabase
                      .from('documents')
                      .update({
                        deadlines: [
                          ...deadlines,
                          {
                            title: "Consumer Proposal Submission Deadline",
                            dueDate: submissionDate.toISOString(),
                            description: "Final deadline for submitting Form 47 Consumer Proposal"
                          }
                        ]
                      })
                      .eq('id', documentId);
                      
                    console.log('Added submission deadline to document');
                  } catch (err) {
                    console.error('Error adding deadline:', err);
                  }
                }
              }
            } else {
              // If we can't find the owner, still update the document status
              const { error: updateError } = await supabase
                .from('documents')
                .update({ 
                  ai_processing_status: 'complete',
                  metadata: {
                    formType: result.extracted_info.formType,
                    formNumber: result.extracted_info.formNumber,
                    processing_complete: true,
                    last_analyzed: new Date().toISOString()
                  }
                })
                .eq('id', documentId);

              if (updateError) {
                console.error('Error updating document status:', updateError);
              }
            }
          } catch (dbError) {
            console.error('Database operation error:', dbError);
            // Even if DB operations fail, we'll still return results to client
          }
        })(),
        timeoutPromise
      ]);
    }

    console.log('Analysis completed successfully');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    
    // If we have a document ID, update its status to failed
    try {
      const requestData = await req.json() as AnalysisRequest;
      if (requestData.documentId) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('documents')
          .update({ 
            ai_processing_status: 'failed',
            metadata: {
              processing_error: error.message,
              error_timestamp: new Date().toISOString()
            }
          })
          .eq('id', requestData.documentId);
      }
    } catch (updateError) {
      console.error('Error updating document status after failure:', updateError);
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      structureValid: false,
      requiredFieldsPresent: false,
      signaturesValid: false,
      risks: [{
        type: "error",
        description: "Document analysis failed: " + error.message,
        severity: "high"
      }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Helper function stub for future implementation
function extractClientName(text: string): string {
  // Simple extraction logic
  const namePattern = /client\s*name\s*[:;]\s*([^\n,]+)/i;
  const match = text.match(namePattern);
  return match ? match[1].trim() : "Unknown Client";
}
