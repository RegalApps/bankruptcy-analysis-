import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function determineFormType(formNumber: string): string {
  const formTypes: Record<string, string> = {
    '1': 'General Bankruptcy Form',
    '2': 'Certificate of Appointment',
    '3': 'Notice of Intention to Enforce Security',
    '4': 'Certificate of Filing Notice',
    '5': 'Certificate of Filing Notice of Intention',
    '6': 'Certificate of Filing Proposal',
    '7': 'Certificate of Assignment',
    '8': 'Certificate of Appointment of Receiver',
    '9': 'Certificate of Substantial Completion',
    '10': 'Notice of Disposition of Collateral',
    '11': 'Proof of Claim',
    '12': 'Bankruptcy Application',
    '13': 'Consolidation Order Application',
    '14': 'Examination Order',
    '15': 'Summons',
    '16': 'Warrant for Apprehension',
    '17': 'Order for Committal',
    '18': 'Search Warrant',
    '19': 'Arrest Warrant',
    '20': 'Payment Order',
    '21': 'Assignment',
    '22': 'Demand for Payment',
    '23': 'Notice of Retention',
    '24': 'Notice to Disclaim Lease',
    '25': 'Notice of Redemption',
    '26': 'Notice of Dispute',
    '27': 'Notice of Objection',
    '28': 'Notice of Application',
    '29': 'Report on Proposal',
    '30': 'Certificate of Performance',
    '31': 'Notice of Cancellation',
    '32': 'Notice to Terminate Lease',
    '33': 'Notice of Intention (Consumer)',
    '34': 'Consumer Proposal',
    '35': 'Certificate of Filing Consumer Proposal',
    '36': 'Report on Consumer Proposal',
    '37': 'Notice of Default',
    '38': 'Certificate of Full Performance',
    '39': 'Notice of Hearing',
    '40': 'Notice of Motion',
    '41': 'Affidavit',
    '42': 'Notice of Hearing',
    '43': 'Order',
    '44': 'Statement of Affairs',
    '45': 'Notice of Meeting',
    '46': 'Monthly Income Statement',
    '47': 'Monthly Report',
    '48': 'Post-Discharge Report',
    '49': 'Assignment for Benefit of Creditors',
    '50': 'Notice of Bankruptcy',
    '51': 'Trustee Report',
    '52': 'Notice of Mediation',
    '53': 'Mediation Report',
    '54': 'Notice of Taxation',
    '55': 'Bill of Costs',
    '56': 'Notice of Discharge Hearing',
    '57': 'Order of Discharge',
    '58': 'Notice of Dividend',
    '59': 'Dividend Sheet',
    '60': 'Notice of Final Dividend',
    '61': 'Final Statement of Receipts',
    '62': 'Notice of Intended Distribution',
    '63': 'Trustee Final Statement',
    '64': 'Certificate of Discharge',
    '65': 'Notice of Annulment',
    '66': 'Notice of Withdrawal',
    '67': 'Notice of Abandonment',
    '68': 'Notice of Stay',
    '69': 'Notice of Revival',
    '70': 'Notice of Continuance',
    '71': 'Notice of Substitution',
    '72': 'Notice of Change',
    '73': 'Notice of Taxation of Costs',
    '74': 'Bill of Costs',
    '75': 'Notice of Settlement',
    '76': 'Notice of Assessment',
    '77': 'Notice of Reassessment',
    '78': 'Notice of Appeal',
    '79': 'Notice of Cross-Appeal',
    '80': 'Notice of Discontinuance',
    '81': 'Notice of Withdrawal of Appeal',
    '82': 'Notice of Hearing of Appeal',
    '83': 'Order on Appeal',
    '84': 'Notice of Further Appeal',
    '85': 'Notice of Leave to Appeal',
    '86': 'Order Granting Leave',
    '87': 'Notice of Security for Costs',
    '88': 'Order for Security for Costs',
    '89': 'Notice of Motion for Directions',
    '90': 'Order for Directions',
    '91': 'Notice of Motion to Vary',
    '92': 'Order Varying',
    '93': 'Notice of Motion to Set Aside',
    '94': 'Order Setting Aside',
    '95': 'Notice of Motion to Stay',
    '96': 'Order Staying Proceedings'
  };
  return formTypes[formNumber] || 'Unknown Form Type';
}

function generateFormSummary(formNumber: string, formTitle: string): string {
  const formSummaries: Record<string, string> = {
    '1': 'General bankruptcy form used for various proceedings under the BIA. Required by Section 43.',
    '2': 'Official certificate of appointment of trustee/receiver. Required under Section 13.',
    '3': 'Required notice before enforcing security on all or substantially all inventory, accounts receivable or other property. Section 244(1).',
    '4': 'Confirms filing of Notice of Intention to Enforce Security. Section 244(1).',
    '5': 'Certificate confirming filing of Notice of Intention to Make a Proposal. Section 50.4(1).',
    '6': 'Official certificate confirming proposal filing. Required under Section 62.1.',
    '7': 'Confirms filing of assignment in bankruptcy. Section 49(1).',
    '8': 'Official certificate of receiver appointment. Section 245(1).',
    '9': 'Certifies substantial completion of receiver\'s duties. Section 246.',
    '10': 'Required notice for disposing of collateral. Section 59(6).',
    '11': 'Standard form for creditors to submit claims. Section 124.',
    '12': 'Application to court for bankruptcy order. Section 43(1).',
    '13': 'Request to consolidate debts under the BIA. Section 219.',
    '14': 'Court order for examination of persons with knowledge. Section 163.',
    '15': 'Official summons for witnesses. Section 169.',
    '16': 'Warrant for apprehension of persons evading examination. Section 168.',
    '17': 'Court order for committal. Section 168.',
    '18': 'Authorizes search and seizure of property. Section 189.',
    '19': 'Warrant for arrest of absconding debtor. Section 168.',
    '20': 'Court order requiring payment. Section 219.',
    '21': 'Voluntary assignment of property to trustee. Section 49.',
    '22': 'Formal demand for payment. Section 157.',
    '23': 'Notice of trustee\'s intention to retain assets. Section 128.',
    '24': 'Notice to terminate lease agreement. Section 65.2.',
    '25': 'Notice of intention to redeem security. Section 128.',
    '26': 'General notice of dispute. Section 81.',
    '27': 'Bankrupt\'s objection to trustee\'s statement. Section 152.',
    '28': 'Public notice of consolidation application. Section 219.',
    '29': 'Trustee\'s detailed analysis of proposal. Section 58.',
    '30': 'Confirms proposal completion. Section 65.3.',
    '31': 'Notice to cancel security registration. Section 128.',
    '32': 'Notice to terminate commercial lease. Section 65.2.',
    '33': 'Notice of intention for consumer proposal. Section 66.13.',
    '34': 'Official consumer proposal document. Section 66.13.',
    '35': 'Official certificate confirming consumer proposal filing. Section 66.13. Required for initiating the consumer proposal process.',
    '36': 'Administrator\'s report on consumer proposal. Section 66.14.',
    '37': 'Notice of consumer proposal default. Section 66.31.',
    '38': 'Certifies completion of consumer proposal. Section 66.38.',
    '39': 'Notice of court hearing for consumer proposal. Section 66.22.',
    '40': 'General notice of motion. Rules 3 and 4.',
    '41': 'Standard form for sworn statements. Rules 3 and 4.',
    '42': 'Notice of court hearing. Rules 3 and 4.',
    '43': 'Standard court order template. Rules 3 and 4.',
    '44': 'Personal bankruptcy financial disclosure. Section 158.',
    '45': 'Initial creditors\' meeting notice. Section 102.',
    '46': 'Bankrupt\'s monthly income declaration. Section 158.',
    '47': 'Monthly financial report of bankrupt. Section 158.',
    '48': 'Post-discharge financial report. Section 170.',
    '49': 'Assignment for benefit of creditors. Section 49.',
    '50': 'Public notice of bankruptcy filing. Section 102.',
    '51': 'Trustee\'s report on administration. Section 170.',
    '52': 'Notice of mandatory mediation. Section 170.1.',
    '53': 'Mediator\'s report on proceedings. Section 170.1.',
    '54': 'Notice of cost assessment. Rules 58-60.',
    '55': 'Detailed statement of costs. Rules 58-60.',
    '56': 'Notice of discharge hearing date. Section 170.1.',
    '57': 'Court order regarding discharge. Section 172.',
    '58': 'Notice of dividend distribution. Section 148.',
    '59': 'Statement of dividend calculations. Section 148.',
    '60': 'Notice of final dividend payment. Section 151.',
    '61': 'Final accounting of estate. Section 152.',
    '62': 'Notice of proposed distribution. Section 149.',
    '63': 'Trustee\'s final report. Section 152.',
    '64': 'Official discharge certificate. Section 178.',
    '65': 'Notice of bankruptcy annulment. Section 181.',
    '66': 'Notice of proposal withdrawal. Section 66.3.',
    '67': 'Notice of asset abandonment. Section 40.',
    '68': 'Notice of proceedings stay. Section 69.',
    '69': 'Notice of proceeding revival. Section 69.4.',
    '70': 'Notice of proceeding continuation. Section 69.5.',
    '71': 'Notice of trustee substitution. Section 14.06.',
    '72': 'Notice of information change. Rules 3-4.',
    '73': 'Notice of cost taxation. Rules 58-60.',
    '74': 'Detailed cost statement. Rules 58-60.',
    '75': 'Notice of claim settlement. Section 135.',
    '76': 'Notice of claim assessment. Section 135.',
    '77': 'Notice of claim reassessment. Section 135.',
    '78': 'Notice of appeal filing. Section 193.',
    '79': 'Notice of cross-appeal. Section 193.',
    '80': 'Notice of appeal discontinuance. Rules 31-32.',
    '81': 'Notice of appeal withdrawal. Rules 31-32.',
    '82': 'Notice of appeal hearing. Section 193.',
    '83': 'Appeal decision order. Section 193.',
    '84': 'Notice of further appeal. Section 193.',
    '85': 'Application for appeal permission. Section 193.',
    '86': 'Order permitting appeal. Section 193.',
    '87': 'Notice requiring cost security. Rules 58-60.',
    '88': 'Order for cost security. Rules 58-60.',
    '89': 'Request for procedural directions. Rules 3-4.',
    '90': 'Court directions order. Rules 3-4.',
    '91': 'Request to modify order. Rules 3-4.',
    '92': 'Order modification decision. Rules 3-4.',
    '93': 'Request to void order. Rules 3-4.',
    '94': 'Order voiding decision. Rules 3-4.',
    '95': 'Request to pause proceedings. Section 69.',
    '96': 'Order pausing proceedings. Section 69.'
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

  if (baseFormNumber === '35') {
    return {
      ...extractedInfo,
      ...extractForm35Info(text)
    };
  }

  return {
    ...extractedInfo,
    ...extractGenericFormInfo(text)
  };
}

function extractForm35Info(text: string) {
  const info: any = {};

  const adminMatch = text.match(/administrator[:]\s*([^\n\r]+)/i);
  info.trusteeName = adminMatch ? adminMatch[1].trim() : '';

  const debtorMatch = text.match(/consumer\s*debtor[:]\s*([^\n\r]+)/i);
  info.clientName = debtorMatch ? debtorMatch[1].trim() : '';

  const dateMatch = text.match(/(?:filing|filed)\s*date[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  info.risks = analyzeForm35Risks(text, info);

  return info;
}

function analyzeForm35Risks(text: string, info: any) {
  const risks = [];

  if (!info.trusteeName) {
    risks.push({
      type: "Missing Administrator Information",
      description: "Administrator's name is not specified in the certificate",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "May affect validity of consumer proposal filing",
      requiredAction: "Add administrator details",
      solution: "Include complete administrator information"
    });
  }

  if (!info.clientName) {
    risks.push({
      type: "Missing Consumer Debtor Information",
      description: "Consumer debtor's information is incomplete",
      severity: "high",
      regulation: "BIA Section 66.13",
      impact: "Cannot properly identify the consumer proposal party",
      requiredAction: "Add consumer debtor details",
      solution: "Include complete consumer debtor information"
    });
  }

  if (!info.dateSigned) {
    risks.push({
      type: "Missing Filing Date",
      description: "Certificate filing date is not specified",
      severity: "medium",
      regulation: "BIA Section 66.13",
      impact: "Cannot determine timing of consumer proposal process",
      requiredAction: "Add filing date",
      solution: "Include the date of filing certification"
    });
  }

  return risks;
}

function extractGenericFormInfo(text: string) {
  const info: any = {};
  
  const clientMatch = text.match(/(?:debtor|bankrupt|client)[:]\s*([^\n\r]+)/i);
  info.clientName = clientMatch ? clientMatch[1].trim() : '';

  const trusteeMatch = text.match(/(?:trustee|administrator)[:]\s*([^\n\r]+)/i);
  info.trusteeName = trusteeMatch ? trusteeMatch[1].trim() : '';

  const dateMatch = text.match(/(?:date|signed)[:]\s*([^\n\r]+)/i);
  info.dateSigned = dateMatch ? dateMatch[1].trim() : '';

  const estateMatch = text.match(/estate\s*(?:no|number|#)[:]\s*([^\n\r]+)/i);
  info.estateNumber = estateMatch ? estateMatch[1].trim() : '';

  const districtMatch = text.match(/district[:]\s*([^\n\r]+)/i);
  info.district = districtMatch ? districtMatch[1].trim() : '';

  const divisionMatch = text.match(/division\s*(?:no|number|#)[:]\s*([^\n\r]+)/i);
  info.divisionNumber = divisionMatch ? divisionMatch[1].trim() : '';

  return info;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();
    console.log('Analyzing document:', { documentId, textLength: documentText.length });

    const formNumberMatch = documentText.match(/form\s*(?:no\.?|number|#)?\s*:?\s*(\d+)/i);
    const formNumber = formNumberMatch ? formNumberMatch[1] : '';
    
    console.log('Detected form number:', formNumber);

    if (!formNumber) {
      throw new Error('Could not detect form number');
    }

    const extractedInfo = extractFormInfo(documentText, formNumber);
    console.log('Extracted information:', extractedInfo);

    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const { error: analysisError } = await supabase
      .from('document_analysis')
      .upsert({
        document_id: documentId,
        user_id: user.id,
        content: { extracted_info: extractedInfo }
      });

    if (analysisError) {
      throw analysisError;
    }

    return new Response(JSON.stringify({ success: true, data: extractedInfo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
