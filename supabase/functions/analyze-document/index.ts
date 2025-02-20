import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function determineFormType(formNumber: string): string {
  // Official form types based on OSBC documentation
  const formTypes: Record<string, string> = {
    '1': 'Bankruptcy and Insolvency Form',
    '2': 'Certificate of Appointment',
    '3': 'Notice of Intention to Enforce Security',
    '4': 'Certificate of Filing of a Notice of Intention to Enforce Security',
    '5': 'Certificate of Filing of a Notice of Intention to Make a Proposal',
    '6': 'Certificate of Filing of a Proposal',
    '7': 'Certificate of Assignment',
    '8': 'Certificate of Appointment of a Receiver',
    '9': 'Certificate of Substantial Performance of Receiver\'s Duties',
    '10': 'Notice of Disposition of Collateral',
    '11': 'Proof of Claim',
    '12': 'Application for Bankruptcy Order',
    '13': 'Application for Consolidation Order',
    '14': 'Order for Examination',
    '15': 'Summons to Witness',
    '16': 'Warrant for Apprehension of Person',
    '17': 'Warrant of Committal',
    '18': 'Warrant of Search and Seizure',
    '19': 'Warrant for Arrest of Absconding Debtor',
    '20': 'Order to Pay',
    '21': 'Assignment for the General Benefit of Creditors',
    '22': 'Demand for Payment',
    '23': 'Notice of Retention of Property',
    '24': 'Notice of Disclaimer of Lease',
    '25': 'Notice of Redemption of Security',
    '26': 'Notice of Dispute',
    '27': 'Notice by Bankrupt of Dispute of Statement of Receipts and Disbursements',
    '28': 'Notice of Application for a Consolidation Order',
    '29': 'Report of Trustee on Proposal',
    '30': 'Certificate of Performance of Proposal',
    '31': 'Notice of Cancellation of Securities',
    '32': 'Notice to Disclaim or Resiliate Commercial Lease',
    '33': 'Notice of Intention to Make a Consumer Proposal',
    '34': 'Consumer Proposal',
    '35': 'Certificate of Filing of a Consumer Proposal',
    '36': 'Report of the Administrator on Consumer Proposal',
    '37': 'Notice of Default of Consumer Proposal',
    '38': 'Certificate of Full Performance of Consumer Proposal',
    '39': 'Notice of Hearing of Application for Court Approval of Consumer Proposal',
    '40': 'Notice of Motion',
    '41': 'Affidavit',
    '42': 'Notice of Hearing',
    '43': 'Order',
    '44': 'Statement of Affairs (Non-Business Bankruptcy)',
    '45': 'Notice of Bankruptcy and Calling of First Meeting of Creditors',
    '46': 'Declaration Under Section 158(d) of the Act',
    '47': 'Monthly Income and Expense Statement of the Bankrupt',
    '48': 'Statement of Discharged Bankrupt\'s Receipts and Disbursements',
    '49': 'Assignment for General Benefit of Creditors',
    '50': 'Notice of Assignment',
    '51': 'Certificate of Assignment',
    '52': 'Petition for Receiving Order',
    '53': 'Receiving Order',
    '54': 'Notice of Bankruptcy Order',
    '55': 'Notice of First Meeting of Creditors',
    '56': 'Minutes of First Meeting of Creditors',
    '57': 'List of Creditors',
    '58': 'Notice of Motion for Court Approval',
    '59': 'Order Approving Proposal',
    '60': 'Notice of Hearing of Application for Absolute Discharge',
    '61': 'Order of Discharge',
    '62': 'Notice of Application for Court Approval of Proposal',
    '63': 'Order Approving Proposal',
    '64': 'Assignment of Book Debts',
    '65': 'Notice of Intention to Make a Proposal',
    '66': 'Notice of Mediation',
    '67': 'Notice of First Meeting of Creditors',
    '68': 'Notice of Bankruptcy, First Meeting of Creditors and Impending Automatic Discharge of Bankrupt',
    '69': 'Notice of Bankruptcy and First Meeting of Creditors',
    '70': 'Notice of Proposal to Creditors',
    '71': 'Notice of Hearing of Application for Court Approval of Proposal',
    '72': 'Notice of Appeal to Court of Justice From Decision of Registrar',
    '73': 'Notice of Appearance',
    '74': 'Notice of Contestation of Claim or Dividend',
    '75': 'Notice of Disallowance of Claim, Right to Priority or Security',
    '76': 'Notice of Dividend and Application for Discharge of Trustee',
    '77': 'Notice to Creditor of Estate of Deceased',
    '78': 'Statement of Affairs (Business Bankruptcy)',
    '79': 'Statement of Affairs (Business Proposal)',
    '80': 'Voting Letter',
    '81': 'Proof of Security',
    '82': 'Proof of Claim',
    '83': 'Dividend Sheet',
    '84': 'Notice of Cancellation of Bankruptcy',
    '85': 'Notice of Annulment of Bankruptcy',
    '86': 'Notice of Final Dividend and Application for Discharge of Trustee',
    '87': 'Notice of Deemed Taxation of Trustee\'s Accounts and Discharge of Trustee',
    '88': 'Dividend Sheet and Application for Discharge of Trustee',
    '89': 'Notice of Impending Automatic Discharge of First-Time Bankrupt',
    '90': 'Notice of Mediation — Assessment Certificate',
    '91': 'Notice of Impending Discharge',
    '92': 'Notice to Creditor of Consumer Proposal',
    '93': 'Notice of Default of Consumer Proposal',
    '94': 'Certificate of Full Performance of Consumer Proposal',
    '95': 'Notice of Withdrawal of Consumer Proposal',
    '96': 'Report of Trustee on Bankrupt\'s Application for Discharge'
  };

  const baseFormNumber = formNumber.split('.')[0];
  return formTypes[baseFormNumber] || 'Unknown Form Type';
}

function generateFormSummary(formNumber: string, formTitle: string): string {
  // Official form summaries based on OSBC documentation
  const formSummaries: Record<string, string> = {
    '49': 'This form is used when a debtor assigns all property for the general benefit of creditors. It initiates bankruptcy proceedings under Section 49(1) of the BIA.',
    '65': 'This form notifies creditors of a debtor\'s intention to make a proposal. It provides a 30-day stay of proceedings under Section 50.4(1) of the BIA.',
    '66': 'This form provides notice of mediation proceedings to resolve disputes between the trustee and bankrupt regarding conditions for discharge or surplus income under Directive 6R3.',
    '67': 'This form notifies creditors of the first meeting, where they can discuss the bankruptcy/proposal, appoint inspectors, and give directions to the trustee under Section 102 of the BIA.',
    '68': 'This comprehensive notice informs creditors of the bankruptcy, schedules the first meeting, and provides information about the impending automatic discharge under Sections 102 and 168.1 of the BIA.',
    '69': 'This form notifies creditors of both the bankruptcy and the first creditors\' meeting, combining essential information under Section 102 of the BIA.',
    '70': 'This form presents the terms of a proposal to creditors, allowing them to vote on the proposed debt resolution under Section 51(1) of the BIA.',
    '71': 'This notice informs interested parties of the court hearing to approve a proposal under Section 58 of the BIA.',
    '72': 'This form initiates an appeal of a Registrar\'s decision to a Court of Justice under Section 192 of the BIA.',
    '74': 'This form notifies of a contestation of a claim or dividend under Section 135(3) of the BIA.',
    '75': 'This notice informs creditors when their claim, priority, or security has been disallowed under Section 135(3) of the BIA.',
    '76': 'This form announces dividend distribution and the trustee\'s application for discharge under Section 152 of the BIA.',
    '77': 'This specialized notice informs creditors about claims against a deceased person\'s estate under Section 68.1 of the BIA.',
    '78': 'This detailed financial disclosure form for business bankruptcies lists all assets, liabilities, income, and expenses under Section 158(d) of the BIA.',
    '79': 'Similar to Form 78, this statement of affairs is specifically for business proposals under Section 50(2) of the BIA.',
    '84': 'This form notifies of the cancellation of a bankruptcy under Section 181(2) of the BIA.',
    '85': 'This notice informs of the annulment of a bankruptcy by court order under Section 181(1) of the BIA.',
    '86': 'This form announces the final dividend distribution and trustee\'s discharge application under Section 152 of the BIA.',
    '87': 'This notice informs of the deemed taxation of trustee\'s accounts and discharge under Section 152(8) of the BIA.',
    '89': 'This form provides notice of an impending automatic discharge for first-time bankrupts under Section 168.1 of the BIA.',
    '90': 'This form certifies the completion of mediation assessment under Directive 6R3.',
    '91': 'This general notice informs of an impending discharge from bankruptcy.',
    '92': 'This form presents the terms of a consumer proposal to creditors under Section 66.13 of the BIA.',
    '93': 'This notice informs creditors that a consumer proposal is in default under Section 66.31 of the BIA.',
    '94': 'This certificate confirms the successful completion of a consumer proposal under Section 66.38 of the BIA.',
    '29': 'This is a detailed report prepared by the trustee analyzing and assessing the proposal. It includes the trustee\'s opinion on the reasonableness of the proposal and the debtor\'s ability to perform it.',
    '1': 'This is a general bankruptcy and insolvency form used for various proceedings under the BIA.',
    '11': 'This form is used by creditors to submit their claims against the bankruptcy estate, detailing the amount and nature of their debt.',
    '12': 'This form is used to apply for a bankruptcy order against a debtor who has committed an act of bankruptcy.',
    '21': 'This form is used when a debtor voluntarily assigns all property for the benefit of creditors.',
    '44': 'This form is a detailed financial disclosure document specifically for individuals declaring personal (non-business) bankruptcy.'
  };

  const baseFormNumber = formNumber.split('.')[0];
  return formSummaries[baseFormNumber] || 
    `This is ${formTitle}. Please refer to the Bankruptcy and Insolvency Act for specific requirements.`;
}

function extractFormInfo(text: string, formNumber: string) {
  const baseFormNumber = formNumber.split('.')[0];
  const formType = determineFormType(formNumber);
  
  let extractedInfo: any = {
    type: formType,
    formNumber: formNumber,
    summary: generateFormSummary(formNumber, formType)
  };

  // Form-specific extraction logic based on form categories
  switch (baseFormNumber) {
    // Bankruptcy Forms
    case '21':
    case '44':
    case '78':
      return {
        ...extractedInfo,
        ...extractBankruptcyFormInfo(text)
      };

    // Proposal Forms
    case '5':
    case '6':
    case '29':
    case '34':
    case '65':
    case '70':
      return {
        ...extractedInfo,
        ...extractProposalFormInfo(text)
      };

    // Notice Forms
    case '3':
    case '45':
    case '67':
    case '68':
    case '69':
      return {
        ...extractedInfo,
        ...extractNoticeFormInfo(text)
      };

    // Court Forms
    case '12':
    case '71':
    case '72':
      return {
        ...extractedInfo,
        ...extractCourtFormInfo(text)
      };

    // Claims and Dividend Forms
    case '11':
    case '74':
    case '75':
    case '76':
    case '82':
    case '83':
      return {
        ...extractedInfo,
        ...extractClaimsAndDividendFormInfo(text)
      };

    // Consumer Proposal Forms
    case '33':
    case '92':
    case '93':
    case '94':
      return {
        ...extractedInfo,
        ...extractConsumerProposalFormInfo(text)
      };

    // Certificate Forms
    case '2':
    case '30':
    case '38':
      return {
        ...extractedInfo,
        ...extractCertificateFormInfo(text)
      };

    default:
      return {
        ...extractedInfo,
        ...extractGenericFormInfo(text)
      };
  }
}

function extractBankruptcyFormInfo(text: string) {
  const info: any = {};

  // Extract client/debtor name
  const clientMatch = text.match(/(?:debtor|bankrupt)(?:'s)?\s*name\s*[:]\s*([^\n\r]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  // Extract trustee information
  const trusteeMatch = text.match(/(?:trustee|licensed\s+insolvency\s+trustee)[:]\s*([^\n\r]+)/i);
  info.trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  // Extract estate number
  const estateMatch = text.match(/estate\s*(?:no|number|#)\s*[:]\s*([^\n\r]+)/i);
  info.estateNumber = estateMatch ? estateMatch[1].trim() : '';

  // Extract district information
  const districtMatch = text.match(/(?:district|division)\s*[:]\s*([^\n\r]+)/i);
  info.district = districtMatch ? districtMatch[1].trim() : '';

  // Extract date of bankruptcy
  const dateMatch = text.match(/date\s*of\s*bankruptcy\s*[:]\s*([^\n\r]+)/i);
  info.dateBankruptcy = dateMatch ? dateMatch[1].trim() : '';

  return info;
}

function extractProposalFormInfo(text: string) {
  const info: any = {};

  // Extract client/debtor name
  const clientMatch = text.match(/(?:debtor|insolvent\s+person)[:]\s*([^\n\r]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  // Extract trustee information
  const trusteeMatch = text.match(/(?:trustee|proposal\s+trustee)[:]\s*([^\n\r]+)/i);
  info.trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  // Extract filing date
  const dateMatch = text.match(/(?:filing|filed)\s*date[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  // Extract court information
  const courtMatch = text.match(/court\s*(?:no|number|file)[:]\s*([^\n\r]+)/i);
  info.courtNumber = courtMatch ? courtMatch[1].trim() : '';

  return info;
}

function extractNoticeFormInfo(text: string) {
  const info: any = {};

  // Extract meeting details
  const meetingMatch = text.match(/meeting\s*(?:will\s*be\s*held|scheduled|date)[:]\s*([^\n\r]+)/i);
  info.meetingOfCreditors = meetingMatch ? meetingMatch[1].trim() : '';

  // Extract chair information
  const chairMatch = text.match(/chair(?:person|man)?[:]\s*([^\n\r]+)/i);
  info.chairInfo = chairMatch ? chairMatch[1].trim() : '';

  // Extract security information if present
  const securityMatch = text.match(/security\s*(?:details|information)[:]\s*([^\n\r]+)/i);
  info.securityInfo = securityMatch ? securityMatch[1].trim() : '';

  return info;
}

function extractCourtFormInfo(text: string) {
  const info: any = {};

  // Extract court file number
  const courtMatch = text.match(/court\s*(?:no|number|file)[:]\s*([^\n\r]+)/i);
  info.courtNumber = courtMatch ? courtMatch[1].trim() : '';

  // Extract division number
  const divisionMatch = text.match(/division\s*(?:no|number)[:]\s*([^\n\r]+)/i);
  info.divisionNumber = divisionMatch ? divisionMatch[1].trim() : '';

  // Extract district
  const districtMatch = text.match(/district[:]\s*([^\n\r]+)/i);
  info.district = districtMatch ? districtMatch[1].trim() : '';

  return info;
}

function extractClaimsAndDividendFormInfo(text: string) {
  const info: any = {};

  // Extract creditor information
  const creditorMatch = text.match(/creditor(?:'s)?\s*name[:]\s*([^\n\r]+)/i);
  info.creditorName = creditorMatch ? creditorMatch[1].trim() : '';

  // Extract claim amount
  const amountMatch = text.match(/(?:claim|amount)\s*[:]\s*\$?\s*([\d,.]+)/i);
  info.claimAmount = amountMatch ? amountMatch[1].trim() : '';

  // Extract dividend information
  const dividendMatch = text.match(/dividend\s*[:]\s*([^\n\r]+)/i);
  info.dividendInfo = dividendMatch ? dividendMatch[1].trim() : '';

  return info;
}

function extractConsumerProposalFormInfo(text: string) {
  const info: any = {};

  // Extract consumer debtor name
  const clientMatch = text.match(/(?:consumer|debtor)[:]\s*([^\n\r]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  // Extract administrator information
  const adminMatch = text.match(/administrator[:]\s*([^\n\r]+)/i);
  info.trusteeName = adminMatch ? adminMatch[1].trim() : '';

  // Extract proposal date
  const dateMatch = text.match(/(?:date|dated)[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return info;
}

function extractCertificateFormInfo(text: string) {
  const info: any = {};

  // Extract certificate details
  const certificateMatch = text.match(/certificate\s*(?:of|details)[:]\s*([^\n\r]+)/i);
  info.certificateDetails = certificateMatch ? certificateMatch[1].trim() : '';

  // Extract official receiver information
  const receiverMatch = text.match(/official\s*receiver[:]\s*([^\n\r]+)/i);
  info.officialReceiver = receiverMatch ? receiverMatch[1].trim() : '';

  // Extract date
  const dateMatch = text.match(/(?:date|dated)[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return info;
}

function extractGenericFormInfo(text: string) {
  // Generic extraction for any form type
  const info: any = {};

  // Extract common fields
  const clientMatch = text.match(/(?:debtor|bankrupt|insolvent person)[:]\s*([^\n\r]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  const trusteeMatch = text.match(/(?:trustee|administrator)[:]\s*([^\n\r]+)/i);
  info.trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  const dateMatch = text.match(/(?:date|dated)[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  return info;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { documentText, documentId } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText?.length });

    if (!documentText) {
      throw new Error('No document text provided');
    }

    // First identify the form number
    const formMatch = documentText.match(/Form\s+(\d+(\.\d+)?(\([a-zA-Z]\))?)/i);
    const formNumber = formMatch ? formMatch[1] : '';
    
    // Extract information based on form type
    const extractedInfo = extractFormInfo(documentText, formNumber);
    console.log('Extracted information:', extractedInfo);

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) throw analysisError;

    return new Response(
      JSON.stringify({ success: true, analysis: extractedInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function analyzeForm29Risks(text: string, data: any) {
  const risks = [];
  
  if (!data.trusteeName) {
    risks.push({
      type: "Missing Trustee Information",
      description: "Trustee's name or details are not specified",
      severity: "high",
      regulation: "BIA Requirements for Trustee Reports",
      impact: "Cannot verify trustee's assessment of proposal",
      requiredAction: "Add trustee information",
      solution: "Include complete trustee details in the report"
    });
  }

  // Check for required sections in the report
  if (!text.includes('opinion') && !text.includes('assessment')) {
    risks.push({
      type: "Missing Trustee Opinion",
      description: "Trustee's opinion on the proposal is not clearly stated",
      severity: "high",
      regulation: "BIA Section 50(10)",
      impact: "Cannot assess viability of proposal",
      requiredAction: "Add trustee's opinion",
      solution: "Include detailed assessment and opinion on the proposal"
    });
  }

  return risks;
}

function analyzeForm66Risks(text: string, data: any) {
  const risks = [];
  
  if (!data.clientName) {
    risks.push({
      type: "Missing Recipient",
      description: "The recipient's name is not clearly specified",
      severity: "high",
      regulation: "BIA Mediation Requirements",
      impact: "May affect proper service of notice",
      requiredAction: "Add recipient name",
      solution: "Ensure the 'To:' field clearly specifies the recipient"
    });
  }

  if (!text.includes('mediation')) {
    risks.push({
      type: "Missing Mediation Details",
      description: "Mediation information not clearly specified",
      severity: "high",
      regulation: "BIA Mediation Process Requirements",
      impact: "Could invalidate mediation notice",
      requiredAction: "Add mediation details",
      solution: "Include complete mediation process information"
    });
  }

  return risks;
}

function analyzeForm67Risks(text: string, data: any) {
  const risks = [];
  
  if (!data.meetingOfCreditors) {
    risks.push({
      type: "Missing Meeting Details",
      description: "Meeting date and time not specified",
      severity: "high",
      regulation: "BIA Section 102 - Meetings of Creditors",
      impact: "Creditors cannot attend without proper notice",
      requiredAction: "Add meeting details",
      solution: "Include complete meeting date, time, and location"
    });
  }

  return risks;
}

function analyzeForm68Risks(text: string, data: any) {
  const risks = [];

  if (!data.dateBankruptcy) {
    risks.push({
      type: "Missing Bankruptcy Date",
      description: "Date of bankruptcy not specified",
      severity: "high",
      regulation: "BIA Section 49(2)",
      impact: "Critical date for proceedings timeline",
      requiredAction: "Add bankruptcy date",
      solution: "Include the official date of bankruptcy"
    });
  }

  return risks;
}

function analyzeForm78Risks(text: string, data: any) {
  const risks = [];

  if (!text.includes('assets') || !text.includes('liabilities')) {
    risks.push({
      type: "Incomplete Financial Information",
      description: "Assets or liabilities section may be incomplete",
      severity: "high",
      regulation: "BIA Section 158(d)",
      impact: "Incomplete disclosure may affect proceedings",
      requiredAction: "Complete financial disclosure",
      solution: "Ensure all assets and liabilities are listed"
    });
  }

  return risks;
}

function analyzeForm92Risks(text: string, data: any) {
  const risks = [];

  if (!text.includes('proposal') || !text.includes('terms')) {
    risks.push({
      type: "Missing Proposal Terms",
      description: "Proposal terms not clearly outlined",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "Creditors cannot assess the proposal",
      requiredAction: "Add proposal terms",
      solution: "Include complete terms of the consumer proposal"
    });
  }

  return risks;
}

function analyzeGenericRisks(text: string, data: any) {
  const risks = [];

  // Only add risks that are actually present
  if (!data.clientName || !data.dateSigned) {
    risks.push({
      type: "Missing Essential Information",
      description: "Basic document information is incomplete",
      severity: "medium",
      regulation: "BIA Documentation Requirements",
      impact: "May affect document validity",
      requiredAction: "Complete missing information",
      solution: "Add all required basic information"
    });
  }

  return risks;
}
