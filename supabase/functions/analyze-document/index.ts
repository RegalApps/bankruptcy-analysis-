
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
}

interface ExtractedInfo {
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  formNumber: string;
  formType: string;
  dateSigned: string;
  trusteeName: string;
  trusteeAddress?: string;
  trusteePhone?: string;
  trusteeEmail?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  totalDebts?: string;
  totalAssets?: string;
  monthlyIncome?: string;
  summary: string;
}

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation: string;
  impact: string;
  requiredAction: string;
  solution: string;
  deadline: string;
}

interface RegulatoryCompliance {
  status: 'compliant' | 'non_compliant' | 'requires_review';
  details: string;
  references: string[];
}

interface AnalysisResult {
  extracted_info: ExtractedInfo;
  risks: Risk[];
  regulatory_compliance: RegulatoryCompliance;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { documentId, documentText, includeRegulatory = true, includeClientExtraction = true, extractionMode = 'standard', title = '' } = await req.json() as AnalysisRequest;

    console.log(`Analysis request received for document ID: ${documentId}, includes regulatory: ${includeRegulatory}, includes client extraction: ${includeClientExtraction}, mode: ${extractionMode}`);

    // Validate input
    if (!documentId && !documentText) {
      throw new Error('Either documentId or documentText must be provided');
    }

    let textToAnalyze = documentText || '';

    // If only documentId is provided, fetch the document from storage
    if (documentId && !documentText) {
      // Get document storage path
      const { data: documentData, error: docError } = await supabase
        .from('documents')
        .select('storage_path, title')
        .eq('id', documentId)
        .single();

      if (docError) {
        throw new Error(`Failed to fetch document: ${docError.message}`);
      }

      // Use provided title or document title
      title = title || documentData.title;

      // Get document content from storage if not provided
      if (!textToAnalyze) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('documents')
          .download(documentData.storage_path);

        if (fileError) {
          throw new Error(`Failed to download document: ${fileError.message}`);
        }

        // Convert file to text (this is simplified - proper handling would depend on file type)
        textToAnalyze = await fileData.text();
      }
    }

    // Analyze the document text
    const result = await analyzeDocument(textToAnalyze, title, extractionMode);

    // If we have a documentId, save the analysis to the database
    if (documentId) {
      // Get the user ID who owns the document
      const { data: documentOwner, error: ownerError } = await supabase
        .from('documents')
        .select('user_id')
        .eq('id', documentId)
        .single();

      if (ownerError) {
        throw new Error(`Failed to fetch document owner: ${ownerError.message}`);
      }

      // Save analysis results
      const { error: analysisError } = await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          user_id: documentOwner.user_id,
          content: result
        });

      if (analysisError) {
        throw new Error(`Failed to save analysis: ${analysisError.message}`);
      }

      // Update document status
      const { error: updateError } = await supabase
        .from('documents')
        .update({ ai_processing_status: 'complete' })
        .eq('id', documentId);

      if (updateError) {
        throw new Error(`Failed to update document status: ${updateError.message}`);
      }

      // If we have client information and the feature is enabled, try to create/associate client
      if (includeClientExtraction && result.extracted_info.clientName) {
        await createOrUpdateClient(supabase, result.extracted_info, documentOwner.user_id);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function analyzeDocument(text: string, title: string, mode: string): Promise<AnalysisResult> {
  console.log(`Analyzing document with title: "${title}" using ${mode} mode`);
  
  // Prepare the extracted information
  const extractedInfo = extractDocumentInformation(text, title, mode);
  
  // Generate risks based on the extracted information
  const risks = identifyRisks(extractedInfo, text);
  
  // Perform regulatory compliance check
  const regulatoryCompliance = checkRegulatoryCompliance(extractedInfo, risks);
  
  return {
    extracted_info: extractedInfo,
    risks: risks,
    regulatory_compliance: regulatoryCompliance
  };
}

function extractDocumentInformation(text: string, title: string, mode: string): ExtractedInfo {
  // Use the title to guess form type and number if not found in text
  let formNumber = '';
  let formType = '';
  
  // Extract form number from title or text
  const formNumberMatch = title.match(/Form\s+(\d+[A-Z]?)/i) || 
                         title.match(/F(\d+[A-Z]?)/i) ||
                         text.match(/Form\s+(\d+[A-Z]?)/i) ||
                         text.match(/Form(?:ulary)?\s*:?\s*(\d+[A-Z]?)/i);
  
  if (formNumberMatch) {
    formNumber = formNumberMatch[1];
  }
  
  // Determine form type from title or text content
  if (title.toLowerCase().includes('bankruptcy') || text.toLowerCase().includes('bankruptcy')) {
    formType = 'bankruptcy';
  } else if (title.toLowerCase().includes('proposal') || text.toLowerCase().includes('consumer proposal')) {
    formType = 'proposal';
  } else if (title.toLowerCase().includes('meeting') || text.toLowerCase().includes('meeting of creditors')) {
    formType = 'meeting';
  } else if (title.toLowerCase().includes('court') || text.toLowerCase().includes('court order')) {
    formType = 'court';
  } else if (title.toLowerCase().includes('security') || text.toLowerCase().includes('security agreement')) {
    formType = 'security';
  }
  
  // Extract client name using various patterns
  let clientName = '';
  const clientNamePatterns = [
    /(?:debtor|client|name)(?:\s*:|\s+is|\s+of)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:I|We),?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:name|client)(?::|;|,)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i
  ];
  
  for (const pattern of clientNamePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      clientName = match[1].trim();
      break;
    }
  }
  
  // If no client name found, use a placeholder
  if (!clientName) {
    clientName = "Unknown Client";
  }
  
  // Extract trustee name
  let trusteeName = '';
  const trusteePatterns = [
    /(?:trustee|licensed insolvency trustee|LIT)(?:\s*:|\s+is|\s+name)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i,
    /(?:appointed|assigned)(?:\s+trustee)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})/i
  ];
  
  for (const pattern of trusteePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      trusteeName = match[1].trim();
      break;
    }
  }
  
  // If no trustee name found, use a placeholder
  if (!trusteeName) {
    trusteeName = "Unknown Trustee";
  }
  
  // Extract signature date
  let dateSigned = '';
  const datePatterns = [
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\d{1,2}[\s-/.,]\w{3,9}[\s-/.,]\d{2,4})/i,
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\w{3,9}[\s-/.,]\d{1,2}[\s-/.,]\d{2,4})/i,
    /(?:date|signed|executed|dated)(?:\s*:|\s+on)?\s+(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      dateSigned = match[1].trim();
      break;
    }
  }
  
  // Extract additional details based on comprehensive mode
  let clientAddress = '';
  let clientPhone = '';
  let clientEmail = '';
  let trusteeAddress = '';
  let trusteePhone = '';
  let trusteeEmail = '';
  let estateNumber = '';
  let district = '';
  let divisionNumber = '';
  let courtNumber = '';
  let totalDebts = '';
  let totalAssets = '';
  let monthlyIncome = '';
  
  if (mode === 'comprehensive') {
    // Client address
    const addressPatterns = [
      /(?:address|residence)(?:\s*:|\s+is|\s+of)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i,
      /(?:residing|lives|located) at ([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        clientAddress = match[1].trim().replace(/\r?\n/g, ', ');
        break;
      }
    }
    
    // Client phone
    const phonePattern = /(?:phone|tel|telephone|contact)(?:\s*:|\s+is|\s+number)?\s*((?:\+?1[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4})/i;
    const phoneMatch = text.match(phonePattern);
    if (phoneMatch && phoneMatch[1]) {
      clientPhone = phoneMatch[1].trim();
    }
    
    // Client email
    const emailPattern = /(?:email|e-mail)(?:\s*:|\s+is)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const emailMatch = text.match(emailPattern);
    if (emailMatch && emailMatch[1]) {
      clientEmail = emailMatch[1].trim();
    }
    
    // Trustee address
    const trusteeAddressPatterns = [
      /(?:trustee|LIT)(?:\s+address|\s+office|\s+location)(?:\s*:|\s+is|\s+at)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i,
      /(?:office|location)(?:\s+of)?\s+(?:trustee|LIT)(?:\s*:|\s+is|\s+at)?\s+([0-9].{5,50}?)(?:\r?\n|,|\.|;)/i
    ];
    
    for (const pattern of trusteeAddressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        trusteeAddress = match[1].trim().replace(/\r?\n/g, ', ');
        break;
      }
    }
    
    // Estate number
    const estatePattern = /(?:estate|file|case)(?:\s*:|\s+no\.|\s+number|\s+#)?\s*([0-9A-Z-]+)/i;
    const estateMatch = text.match(estatePattern);
    if (estateMatch && estateMatch[1]) {
      estateNumber = estateMatch[1].trim();
    }
    
    // District
    const districtPattern = /(?:district|jurisdiction|in the)(?:\s*:|\s+of)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i;
    const districtMatch = text.match(districtPattern);
    if (districtMatch && districtMatch[1]) {
      district = districtMatch[1].trim();
    }
    
    // Total debts
    const debtPatterns = [
      /(?:total|sum of|amount of)?\s*(?:debts|liabilities|indebtedness)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:debts|liabilities)\s*(?::|total|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
    ];
    
    for (const pattern of debtPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        totalDebts = `$${match[1].trim()}`;
        break;
      }
    }
    
    // Total assets
    const assetPatterns = [
      /(?:total|sum of|amount of)?\s*(?:assets|property|possessions)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:assets|property)(?:\s*:|total|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
    ];
    
    for (const pattern of assetPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        totalAssets = `$${match[1].trim()}`;
        break;
      }
    }
    
    // Monthly income
    const incomePatterns = [
      /(?:monthly|regular)?\s*(?:income|earnings|salary)(?:\s*:|is)?\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:income|earnings|salary)(?:\s*:|per month|:|\s+of)\s*(?:\$|CAD)?\s*([\d,]+(?:\.\d{2})?)/i
    ];
    
    for (const pattern of incomePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        monthlyIncome = `$${match[1].trim()}`;
        break;
      }
    }
  }
  
  // Create a summary of the document
  const documentSummary = generateDocumentSummary(
    formType, formNumber, clientName, trusteeName, dateSigned, 
    totalDebts, totalAssets, estateNumber
  );
  
  return {
    clientName,
    clientAddress,
    clientPhone,
    clientEmail,
    formNumber,
    formType,
    dateSigned,
    trusteeName,
    trusteeAddress,
    trusteePhone,
    trusteeEmail,
    estateNumber,
    district,
    divisionNumber,
    courtNumber,
    totalDebts,
    totalAssets,
    monthlyIncome,
    summary: documentSummary
  };
}

function generateDocumentSummary(
  formType: string,
  formNumber: string,
  clientName: string,
  trusteeName: string,
  dateSigned: string,
  totalDebts: string = '',
  totalAssets: string = '',
  estateNumber: string = ''
): string {
  let summary = '';
  
  if (formType === 'bankruptcy') {
    summary = `This is a bankruptcy form`;
  } else if (formType === 'proposal') {
    summary = `This is a consumer proposal form`;
  } else if (formType === 'meeting') {
    summary = `This is a meeting of creditors form`;
  } else if (formType === 'court') {
    summary = `This is a court document`;
  } else if (formType === 'security') {
    summary = `This is a security agreement form`;
  } else {
    summary = `This is a document`;
  }
  
  if (formNumber) {
    summary += ` (Form ${formNumber})`;
  }
  
  summary += ` for ${clientName}.`;
  
  if (dateSigned) {
    summary += ` The form was submitted on ${dateSigned}.`;
  }
  
  if (trusteeName && trusteeName !== 'Unknown Trustee') {
    summary += ` The trustee assigned to this case is ${trusteeName}.`;
  }
  
  if (estateNumber) {
    summary += ` Estate number: ${estateNumber}.`;
  }
  
  if (totalDebts && totalAssets) {
    summary += ` The client has total debts of ${totalDebts} and total assets valued at ${totalAssets}.`;
  } else if (totalDebts) {
    summary += ` The client has total debts of ${totalDebts}.`;
  } else if (totalAssets) {
    summary += ` The client has total assets valued at ${totalAssets}.`;
  }
  
  return summary;
}

function identifyRisks(extractedInfo: ExtractedInfo, text: string): Risk[] {
  const risks: Risk[] = [];
  
  // Check for missing financial details
  if (!extractedInfo.totalDebts && !extractedInfo.totalAssets && !extractedInfo.monthlyIncome) {
    risks.push({
      type: "Missing Financial Details",
      description: "There are no income, assets, liabilities, or creditor details present in the extracted information.",
      severity: "high",
      regulation: "BIA Reference: Section 158(a) requires a debtor to disclose full financial affairs to the trustee. Directive Reference: OSB Directive No. 6R3 states the requirement to file a Statement of Affairs.",
      impact: "May delay the bankruptcy process and lead to rejection of filing.",
      requiredAction: "Submit complete financial disclosure within 5 days.",
      solution: "Attach a Statement of Affairs with required financial details.",
      deadline: "5 days"
    });
  }
  
  // Check for signature indications
  if (!text.toLowerCase().includes('signed') && !text.toLowerCase().includes('signature')) {
    risks.push({
      type: "Lack of Required Signatures",
      description: "The form does not indicate whether it has been signed by the debtor or trustee.",
      severity: "medium",
      regulation: "BIA Reference: Section 50.4(8) mandates signatures for formal insolvency proceedings. Directive Reference: OSB Form Guidelines state that official documents must have authenticated signatures.",
      impact: "Document may be considered invalid without proper signatures.",
      requiredAction: "Obtain signatures before next trustee meeting.",
      solution: "Use digital signing (e.g., DocuSign API integration).",
      deadline: "3 days"
    });
  }
  
  // Check for creditor information
  if (!text.toLowerCase().includes('creditor') && !text.toLowerCase().includes('liabilities')) {
    risks.push({
      type: "No Creditor Information Provided",
      description: "There is no evidence of creditor claims or liabilities.",
      severity: "high",
      regulation: "BIA Reference: Section 158(c) states that a debtor must disclose all creditors and amounts owed. Directive Reference: OSB Directive No. 11 outlines creditor claim procedures.",
      impact: "Creditors may not be properly notified of proceedings.",
      requiredAction: "Submit creditor details within 3 days.",
      solution: "Use OCR and AI-driven form processing to extract financial details from bank statements.",
      deadline: "3 days"
    });
  }
  
  // Check for asset declarations
  if (!text.toLowerCase().includes('asset') && !text.toLowerCase().includes('property')) {
    risks.push({
      type: "No Mention of Assets or Exemptions",
      description: "There is no declaration of assets, which is critical for determining surplus income and potential liquidation.",
      severity: "medium",
      regulation: "BIA Reference: Section 67(1) discusses the division of assets under bankruptcy. Directive Reference: OSB Directive No. 11R2 details asset disclosure requirements.",
      impact: "May result in improper handling of debtor assets.",
      requiredAction: "Disclose assets before initial bankruptcy assessment.",
      solution: "Automate asset tracking through the CRM system.",
      deadline: "7 days"
    });
  }
  
  return risks;
}

function checkRegulatoryCompliance(extractedInfo: ExtractedInfo, risks: Risk[]): RegulatoryCompliance {
  // Check if there are any high-severity risks
  const hasHighRisks = risks.some(risk => risk.severity === 'high');
  
  // Check if essential fields are missing
  const missingEssentialFields = !extractedInfo.clientName || 
                               !extractedInfo.dateSigned || 
                               !extractedInfo.trusteeName;
  
  if (hasHighRisks || missingEssentialFields) {
    return {
      status: 'non_compliant',
      details: "This document does not meet compliance requirements due to missing essential information or high-severity risks.",
      references: risks.map(risk => risk.regulation).filter(r => r)
    };
  } else if (risks.length > 0) {
    return {
      status: 'requires_review',
      details: "This document requires review to address potential compliance issues.",
      references: risks.map(risk => risk.regulation).filter(r => r)
    };
  } else {
    return {
      status: 'compliant',
      details: "This document meets all basic compliance requirements.",
      references: []
    };
  }
}

async function createOrUpdateClient(supabase: any, clientInfo: ExtractedInfo, userId: string) {
  if (!clientInfo.clientName || clientInfo.clientName === 'Unknown Client') {
    return null;
  }
  
  try {
    // Check if client already exists
    const { data: existingClients, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .ilike('name', clientInfo.clientName)
      .limit(1);
      
    if (checkError) throw checkError;
    
    // If client exists, update their information
    if (existingClients && existingClients.length > 0) {
      const clientId = existingClients[0].id;
      
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          email: clientInfo.clientEmail || null,
          phone: clientInfo.clientPhone || null,
          metadata: {
            address: clientInfo.clientAddress || null,
            totalDebts: clientInfo.totalDebts || null,
            totalAssets: clientInfo.totalAssets || null,
            monthlyIncome: clientInfo.monthlyIncome || null,
            lastUpdated: new Date().toISOString()
          }
        })
        .eq('id', clientId);
        
      if (updateError) throw updateError;
      
      console.log(`Updated existing client with ID: ${clientId}`);
      return clientId;
    }
    
    // Create new client
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name: clientInfo.clientName,
        email: clientInfo.clientEmail || null,
        phone: clientInfo.clientPhone || null,
        metadata: {
          address: clientInfo.clientAddress || null,
          totalDebts: clientInfo.totalDebts || null,
          totalAssets: clientInfo.totalAssets || null,
          monthlyIncome: clientInfo.monthlyIncome || null
        }
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    console.log(`Created new client with ID: ${newClient.id}`);
    return newClient.id;
  } catch (error) {
    console.error('Error creating/updating client:', error);
    return null;
  }
}
