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

    console.log(`Analysis request received for document ID: ${documentId}, form type: ${formType}, isExcelFile: ${isExcelFile}`);

    if (!documentId && !documentText) {
      throw new Error('Either documentId or documentText must be provided');
    }
    
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

    let formFields: any = {};
    if (documentText) {
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
        claimAmount: getField(/(?:claim|amount)[\s:]*\$?\s*([\d,.]+)/i),
        estateNumber: getField(/(?:estate|bankruptcy)\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i),
        courtFileNumber: getField(/court\s+file\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i),
      };
      
      if (detectedFormNumber === "31") {
        formFields.securityDescription = getField(/security\s+(?:held|described|valued)[\s:]*([^.]+)/i);
        formFields.claimType = getField(/claim(?:s|ed)?\s+as\s+(?:an?\s+)?(unsecured|secured|preferred|priority|wage earner|farmer|fisherman|director)/i);
        
        const checkboxPattern = /\b[☑✓✗]?\s*([a-g])(?:\s*\.|\s+[a-z]+)/i;
        const checkboxMatch = documentText.match(checkboxPattern);
        if (checkboxMatch && checkboxMatch[1]) {
          formFields.claimCheckbox = checkboxMatch[1].toUpperCase();
        }
      }
    }

    let openAIPrompt = "";
    if (
      formFields.formNumber === "47" ||
      formType === "form-47" ||
      /form[\s-]*47\b/i.test(title) ||
      /consumer proposal/i.test(title)
    ) {
      openAIPrompt =
`You are a professional document analyst for Canadian insolvency forms.

FORM: 47 - Consumer Proposal (Statement of Affairs)

Please extract the following critical details from this document according to the Bankruptcy and Insolvency Act (BIA):

# 1. IDENTIFICATION AND FILING DETAILS
- **Client/Consumer Name** (full legal name)
- **Address** (current residential)
- **Administrator/Trustee Name and License Number**
- **Filing Date** and if present, the Submission Deadline
- **Marital Status** and details of any Spouse/Partner
- **Occupation** and Employer information
- **Business Interests** if self-employed or director positions

# 2. FINANCIAL SNAPSHOT
## Assets Section:
- **Primary Residence Value** (market value, mortgage)
- **Vehicles** (make, model, year, value)
- **Bank Accounts** (institutions, balances)
- **Investments** (RRSP, stocks, other investments with values)
- **Other Significant Assets** (list all with values)
- **Total Value of Assets**

## Liabilities Section:
- **Secured Debts** (creditors, amounts, security details)
- **Preferred Creditors** (name, reason for preference, amounts)
- **Unsecured Creditors** (names and amounts)
- **Total Liabilities**

# 3. INCOME & EXPENSE ANALYSIS
- **Monthly Income** (all sources, breakdown)
- **Monthly Expenses** (categorized)
- **Surplus Income Calculation** (if present: net income minus threshold)
- **OSB Threshold** used (based on family size)
- **Family Size** (number of dependents)

# 4. PROPOSAL DETAILS
- **Monthly Proposal Payment** amount
- **Proposal Duration** (months/years)
- **Total Proposal Value** (payment × months)
- **Secured Creditor Payment Terms**
- **Unsecured Creditor Distribution**
- **Administrator Fees & Costs**

# 5. SIGNATURES & AUTHENTICATION
- **Debtor Signature** (present: yes/no)
- **Administrator Signature** (present: yes/no)
- **Witness Signature/Oath** (present: yes/no)
- **Electronic Filing Indicators** (Form 1.1 reference)

# 6. COMPREHENSIVE RISK ASSESSMENT
Identify all compliance and legal risks including:
- **Missing Mandatory Fields** (specify which sections are incomplete)
- **Signature Issues** (missing signatures or improper authentication)
- **Financial Discrepancies** (unusual values, missing assets)
- **Surplus Calculation Issues** (errors in calculation or missing)
- **Proposal Adequacy Risk** (insufficient payments relative to assets/income)
- **Documentation Gaps** (missing supporting documents)

For each risk, provide:
- Risk type (compliance, legal, financial, documentation)
- Severity (high, medium, low)
- Specific BIA or OSB reference (e.g., "BIA Section 66.13" or "Directive 6R3")
- Detailed impact description
- Required action and solution
- Suggested deadline

Return all information in a structured JSON format:
{
  "summary": "One-paragraph consumer proposal summary",
  "extracted_info": {
    "clientName": "",
    "filingDate": "",
    "submissionDeadline": "",
    // all other extracted fields
  },
  "financial_data": {
    "total_assets": "$0.00",
    "total_liabilities": "$0.00",
    "monthly_income": "$0.00",
    "monthly_expenses": "$0.00",
    "surplus_income": "$0.00"
  },
  "proposal_details": {
    "monthly_payment": "$0.00",
    "duration_months": 0,
    "total_value": "$0.00"
  },
  "signature_verification": {
    "debtor_signed": true/false,
    "administrator_signed": true/false,
    "properly_sworn": true/false
  },
  "comprehensive_risks": [
    {
      "type": "compliance",
      "description": "",
      "severity": "high/medium/low", 
      "regulation": "BIA Section X",
      "impact": "",
      "required_action": "",
      "solution": "",
      "deadline": ""
    }
  ],
  "regulatory_compliance": {
    "status": "compliant/requires_review/non_compliant",
    "references": ["BIA Section 66.13", "Directive 6R3"],
    "details": "Compliance assessment summary"
  }
}`;
    }
    else if (
      formFields.formNumber === "31" ||
      formType === "form-31" ||
      /form[\s-]*31\b/i.test(title) ||
      /proof of claim/i.test(title)
    ) {
      openAIPrompt =
`You are a Canadian insolvency and bankruptcy document expert analyzing Form 31 - Proof of Claim.

Use the following comprehensive framework to analyze the document:

1. DOCUMENT VERIFICATION
Confirm this is Form 31 (Proof of Claim) and note if it's the current prescribed version
Check for estate/bankruptcy number and court file number
If either are missing, flag as HIGH risk compliance issue

2. PARTY INFORMATION EXTRACTION
Extract and validate all of the following:
- Debtor's full legal name and address
- Creditor's full legal name and address
- Representative information (if applicable)
- Contact methods (phone, email)
Flag any missing party information as compliance risks

3. CLAIM DETAILS
Extract the following with high precision:
- Total claim amount in Canadian dollars (must be specific dollar amount)
- Interest calculation details (if present)
- Currency conversion information (if claim in foreign currency)

4. CLAIM TYPE CLASSIFICATION
Identify which claim type checkbox (Section 4) is selected:
□A. Unsecured claim (BIA s. 124)
□B. Lease disclaimer (BIA s. 65.2(4)) - landlords only
□C. Secured claim - must include security description and value (BIA s. 128(1))
□D. Farmer/Fisherman claim (BIA s. 81.2(1))
□E. Wage earner claim (BIA s. 81.3(8), 81.4(8))
□F. Director liability (BIA s. 50(13))
□G. Securities customer claim (BIA s. 262)

5. SUPPORTING DOCUMENTS
Identify if these required attachments are mentioned:
- Statement of account (Schedule A)
- Supporting documents/evidence
- Affidavit (if required)
- Security documents (for secured claims)
- Proxy form (Form 36) if representative filing
Flag missing supporting documents as risks

6. SIGNATURE & AUTHENTICATION
Verify if the document appears to be:
- Properly signed (by creditor or authorized representative)
- Witnessed correctly
- Properly dated in full (day, month, year)
- If electronic filing, check for Form 1.1 reference
Flag any signature issues as HIGH risk compliance issues

7. COMPREHENSIVE RISK ASSESSMENT
For each risk identified, provide:
- Risk type (compliance, legal, operational)
- Severity level (High/Medium/Low)
- Specific BIA section or rule reference
- Impact description
- Required action
- Recommended solution
- Deadline for resolution

Return a comprehensive JSON response with these sections:
{
  "document_verification": {
    "is_form_31": true|false,
    "current_version": true|false,
    "file_numbers": {
      "estate_number": "string",
      "court_file_number": "string"
    },
    "verification_risks": [...]
  },
  "party_information": {
    "debtor": { "name": "", "address": "", "entity_type": "" },
    "creditor": { "name": "", "address": "", "type": "" },
    "representative": { "name": "", "relationship": "" },
    "contact_info": { "phone": "", "email": "" },
    "party_info_risks": [...]
  },
  "claim_details": {
    "total_amount": "$0.00",
    "interest_details": "",
    "currency_info": "",
    "claim_details_risks": [...]
  },
  "claim_type": {
    "selected_type": "A|B|C|D|E|F|G",
    "classification": "unsecured|secured|etc",
    "security_description": "",
    "security_value": "",
    "claim_type_risks": [...]
  },
  "supporting_documents": {
    "mentioned_documents": [],
    "missing_documents": [],
    "document_risks": [...]
  },
  "signature_authentication": {
    "is_signed": true|false,
    "signature_date": "",
    "electronic_filing_form": true|false,
    "signature_risks": [...]
  },
  "comprehensive_risks": [
    {
      "type": "compliance|legal|operational",
      "severity": "high|medium|low",
      "reference": "BIA s.XXX",
      "description": "",
      "impact": "",
      "required_action": "",
      "solution": "",
      "deadline": ""
    }
  ],
  "summary": "",
  "compliance_score": 0-100
}`;
    }
    else {
      openAIPrompt =
`You are an expert in Canadian bankruptcy and insolvency document analysis. Please extract the client detail, summary, and compliance risk assessment for this form.`;
    }

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

              let documentMetadata = {
                formType: result.extracted_info?.formType,
                formNumber: result.extracted_info?.formNumber,
                processing_complete: true,
                last_analyzed: new Date().toISOString(),
                processing_steps_completed: ["analysis_complete"],
                processing_time_ms: Date.now() - new Date().getTime(),
                client_name: result.extracted_info?.clientName,
                submission_deadline: result.extracted_info?.submissionDeadline,
                filing_date: result.extracted_info?.filingDate,
                administratorName: result.extracted_info?.administratorName
              };
              
              if (formFields.formNumber === "31" || 
                  /form[\s-]*31\b/i.test(title) || 
                  /proof of claim/i.test(title)) {
                documentMetadata = {
                  ...documentMetadata,
                  formNumber: "31",
                  formType: "proof-of-claim",
                  claimant_name: result.party_information?.creditor?.name || result.extracted_info?.claimantName,
                  claim_amount: result.claim_details?.total_amount || formFields.claimAmount,
                  claim_type: result.claim_type?.classification || formFields.claimType,
                  security_description: result.claim_type?.security_description || formFields.securityDescription,
                  compliance_score: result.compliance_score,
                  has_compliance_issues: (result.comprehensive_risks?.length > 0) || false
                };
              }

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
              
              if (formFields.formNumber === "47" || 
                  /form[\s-]*47\b/i.test(title) || 
                  /consumer proposal/i.test(title)) {
                
                if (aiData.proposal_details?.duration_months && aiData.extracted_info?.filingDate) {
                  try {
                    const { data: document } = await supabase
                      .from('documents')
                      .select('deadlines')
                      .eq('id', documentId)
                      .single();
                      
                    const deadlines = document?.deadlines || [];
                    const newDeadlines = [];
                    
                    const filingDate = new Date(aiData.extracted_info.filingDate);
                    
                    const creditorsMeetingDate = new Date(filingDate);
                    creditorsMeetingDate.setDate(filingDate.getDate() + 45);
                    
                    newDeadlines.push({
                      title: "Meeting of Creditors Deadline",
                      dueDate: creditorsMeetingDate.toISOString(),
                      description: "Must hold meeting within 45 days of filing (BIA s. 66.15(1))",
                      severity: "high",
                      reference: "BIA s. 66.15(1)"
                    });
                    
                    const courtApprovalDate = new Date(creditorsMeetingDate);
                    courtApprovalDate.setDate(creditorsMeetingDate.getDate() + 15);
                    
                    newDeadlines.push({
                      title: "Court Application Deadline (if needed)",
                      dueDate: courtApprovalDate.toISOString(),
                      description: "Apply to court within 15 days after meeting if needed (BIA s. 66.22)",
                      severity: "medium",
                      reference: "BIA s. 66.22"
                    });
                    
                    const firstPaymentDate = new Date(courtApprovalDate);
                    firstPaymentDate.setDate(courtApprovalDate.getDate() + 30);
                    
                    newDeadlines.push({
                      title: "First Payment Due",
                      dueDate: firstPaymentDate.toISOString(),
                      description: "First proposal payment due (estimate)",
                      severity: "medium",
                      reference: "Consumer Proposal Terms"
                    });
                    
                    if (Array.isArray(aiData.comprehensive_risks)) {
                      for (const risk of aiData.comprehensive_risks) {
                        if (risk.deadline && risk.severity === 'high') {
                          const dueDate = new Date();
                          if (/\d+ days?/.test(risk.deadline)) {
                            const days = parseInt(risk.deadline.match(/(\d+)/)[1]);
                            dueDate.setDate(dueDate.getDate() + days);
                          } else if (/immediate|asap/i.test(risk.deadline)) {
                            dueDate.setDate(dueDate.getDate() + 1); // Tomorrow
                          }
                          
                          newDeadlines.push({
                            title: `Form 47 - ${risk.type}`,
                            dueDate: dueDate.toISOString(),
                            description: risk.required_action || risk.description,
                            severity: risk.severity,
                            reference: risk.regulation
                          });
                        }
                      }
                    }
                    
                    if (newDeadlines.length > 0) {
                      await supabase
                        .from('documents')
                        .update({
                          deadlines: [...deadlines, ...newDeadlines]
                        })
                        .eq('id', documentId);
                        
                      console.log(`Added ${newDeadlines.length} deadlines from Form 47 analysis`);
                    }
                  } catch (err) {
                    console.error('Error adding Form 47 deadlines:', err);
                  }
                }

                const documentMetadata = {
                  formType: "form-47",
                  formNumber: "47",
                  processing_complete: true,
                  last_analyzed: new Date().toISOString(),
                  processing_steps_completed: ["analysis_complete"],
                  client_name: aiData.extracted_info?.clientName,
                  administrator_name: aiData.extracted_info?.administratorName,
                  filing_date: aiData.extracted_info?.filingDate,
                  submission_deadline: aiData.extracted_info?.submissionDeadline,
                  form47_details: {
                    proposal_duration: aiData.proposal_details?.duration_months || 0,
                    monthly_payment: aiData.proposal_details?.monthly_payment || "$0.00",
                    total_value: aiData.proposal_details?.total_value || "$0.00",
                    surplus_income: aiData.financial_data?.surplus_income || "$0.00",
                    total_assets: aiData.financial_data?.total_assets || "$0.00",
                    total_liabilities: aiData.financial_data?.total_liabilities || "$0.00"
                  },
                  signature_status: aiData.signature_verification?.debtor_signed && 
                                 aiData.signature_verification?.administrator_signed ? 
                                 "signed" : "unsigned",
                  has_compliance_issues: (aiData.comprehensive_risks?.length > 0) || false,
                  oath_status: aiData.signature_verification?.properly_sworn ? "sworn" : "unsworn"
                };

                await supabase
                  .from('documents')
                  .update({ 
                    ai_processing_status: 'complete',
                    metadata: documentMetadata
                  })
                  .eq('id', documentId);
                  
                console.log('Updated document metadata with Form 47 details');
              }
            } else {
              const { error: updateError } = await supabase
                .from('documents')
                .update({ 
                  ai_processing_status: 'complete',
                  metadata: {
                    formType: result.extracted_info?.formType,
                    formNumber: result.extracted_info?.formNumber,
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

function extractClientName(text: string): string {
  const namePattern = /client\s*name\s*[:;]\s*([^\n,]+)/i;
  const match = text.match(namePattern);
  return match ? match[1].trim() : "Unknown Client";
}
