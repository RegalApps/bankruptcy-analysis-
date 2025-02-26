import { analyzeRisks } from "./riskAnalyzer.ts";
import { validateForm } from "./validation/formValidation.ts";

export async function processDocument(text: string, includeRegulatory: boolean = true) {
  console.log('Processing document text length:', text.length);

  // Extract basic document info
  const documentType = extractDocumentType(text);
  const formNumber = extractFormNumber(text);
  const clientInfo = extractClientInfo(text);
  const trusteeInfo = extractTrusteeInfo(text);
  
  // Extract dates and numbers
  const dateSigned = extractDate(text, /Dated:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
  const bankruptcyDate = extractDate(text, /Date of Bankruptcy:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
  const estateNumber = extractEstateNumber(text);
  
  // Extract location info
  const district = extractDistrict(text);
  const divisionNumber = extractDivisionNumber(text);
  const courtNumber = extractCourtNumber(text);
  
  // Extract additional info
  const meetingInfo = extractMeetingInfo(text);
  const chairInfo = extractChairInfo(text);
  const securityInfo = extractSecurityInfo(text);
  const officialReceiver = extractOfficialReceiver(text);

  // Generate summary
  const summary = await generateDocumentSummary(text);

  // Analyze risks and compliance
  const riskAnalysis = await analyzeRisks(text, documentType);
  const validationResults = await validateForm(text, documentType);

  return {
    documentType,
    formNumber,
    clientInfo,
    trusteeInfo,
    dateSigned,
    bankruptcyDate,
    estateNumber,
    district,
    divisionNumber,
    courtNumber,
    meetingInfo,
    chairInfo,
    securityInfo,
    officialReceiver,
    summary,
    risks: riskAnalysis,
    regulatoryCompliance: validationResults
  };
}

function extractDocumentType(text: string): string {
  const bankruptcyPattern = /bankruptcy|bankrupt/i;
  const proposalPattern = /proposal|consumer proposal/i;
  const courtPattern = /court order|court filing/i;
  const meetingPattern = /meeting of creditors|creditors meeting/i;
  const securityPattern = /security agreement|collateral/i;

  if (bankruptcyPattern.test(text)) return "bankruptcy";
  if (proposalPattern.test(text)) return "proposal";
  if (courtPattern.test(text)) return "court";
  if (meetingPattern.test(text)) return "meeting";
  if (securityPattern.test(text)) return "security";
  
  return "other";
}

function extractFormNumber(text: string): string {
  const match = text.match(/Form\s+(\d+)/i);
  return match ? match[1] : '';
}

function extractClientInfo(text: string) {
  const namePattern = /(?:Client|Debtor)(?:'s)?\s*Name:?\s*([^\n\r]+)/i;
  const addressPattern = /(?:Client|Debtor)(?:'s)?\s*Address:?\s*([^\n\r]+(?:\n[^\n\r]+)*)/i;
  const phonePattern = /(?:Client|Debtor)(?:'s)?\s*(?:Phone|Tel):?\s*([\d\-\(\)\s\.]+)/i;

  const name = text.match(namePattern)?.[1]?.trim() || '';
  const address = text.match(addressPattern)?.[1]?.trim() || '';
  const phone = text.match(phonePattern)?.[1]?.trim() || '';

  return {
    name,
    address,
    phone
  };
}

function extractTrusteeInfo(text: string) {
  const namePattern = /(?:Trustee|Licensed\s+Insolvency\s+Trustee)(?:'s)?\s*Name:?\s*([^\n\r]+)/i;
  const addressPattern = /(?:Trustee|Licensed\s+Insolvency\s+Trustee)(?:'s)?\s*Address:?\s*([^\n\r]+(?:\n[^\n\r]+)*)/i;
  const phonePattern = /(?:Trustee|Licensed\s+Insolvency\s+Trustee)(?:'s)?\s*(?:Phone|Tel):?\s*([\d\-\(\)\s\.]+)/i;

  const name = text.match(namePattern)?.[1]?.trim() || '';
  const address = text.match(addressPattern)?.[1]?.trim() || '';
  const phone = text.match(phonePattern)?.[1]?.trim() || '';

  return {
    name,
    address,
    phone
  };
}

function extractDate(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match ? match[1] : '';
}

function extractEstateNumber(text: string): string {
  const match = text.match(/Estate No\.?:?\s*(\d+)/i);
  return match ? match[1] : '';
}

function extractDistrict(text: string): string {
  const match = text.match(/District(?:\s+of)?:?\s*([^\n\r]+)/i);
  return match ? match[1].trim() : '';
}

function extractDivisionNumber(text: string): string {
  const match = text.match(/Division No\.?:?\s*(\d+)/i);
  return match ? match[1] : '';
}

function extractCourtNumber(text: string): string {
  const match = text.match(/Court No\.?:?\s*(\d+)/i);
  return match ? match[1] : '';
}

function extractMeetingInfo(text: string): string {
  const pattern = /Meeting of Creditors:?\s*([^\n\r]+(?:\n[^\n\r]+)*)/i;
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function extractChairInfo(text: string): string {
  const pattern = /Chair(?:person)?:?\s*([^\n\r]+(?:\n[^\n\r]+)*)/i;
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function extractSecurityInfo(text: string): string {
  const pattern = /Security Information:?\s*([^\n\r]+(?:\n[^\n\r]+)*)/i;
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function extractOfficialReceiver(text: string): string {
  const pattern = /Official Receiver:?\s*([^\n\r]+)/i;
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

async function generateDocumentSummary(text: string): Promise<string> {
  // Extract key information
  const type = extractDocumentType(text);
  const client = extractClientInfo(text);
  const trustee = extractTrusteeInfo(text);
  const estateNo = extractEstateNumber(text);
  
  // Generate a concise summary
  let summary = `This is a ${type} document`;
  
  if (client.name) {
    summary += ` for ${client.name}`;
  }
  
  if (trustee.name) {
    summary += `, handled by Licensed Insolvency Trustee ${trustee.name}`;
  }
  
  if (estateNo) {
    summary += ` (Estate No. ${estateNo})`;
  }
  
  summary += '. ';
  
  // Add additional context based on document type
  switch (type) {
    case 'bankruptcy':
      const bankruptcyDate = extractDate(text, /Date of Bankruptcy:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
      if (bankruptcyDate) {
        summary += `The bankruptcy was filed on ${bankruptcyDate}. `;
      }
      break;
    case 'meeting':
      const meetingInfo = extractMeetingInfo(text);
      if (meetingInfo) {
        summary += `A meeting of creditors is scheduled: ${meetingInfo}. `;
      }
      break;
    case 'court':
      const courtNo = extractCourtNumber(text);
      if (courtNo) {
        summary += `This is related to court filing number ${courtNo}. `;
      }
      break;
  }
  
  return summary.trim();
}
