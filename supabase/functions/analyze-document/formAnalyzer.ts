
import { analyzeRisks } from "./riskAnalyzer.ts";
import { validateForm } from "./validation/formValidation.ts";

export async function processDocument(text: string, includeRegulatory: boolean = true) {
  console.log('Processing document text length:', text.length);

  // Regular expressions for extracting information
  const formNumberRegex = /Form\s*(?:No\.?)?\s*(\d+)/i;
  const clientNameRegex = /(?:Debtor|Client):\s*([^\n]+)/i;
  const trusteeNameRegex = /(?:Licensed\s+Insolvency\s+)?Trustee:\s*([^\n]+)/i;
  const estateNumberRegex = /Estate\s*(?:No\.?)?\s*(\d+)/i;
  const dateSignedRegex = /(?:Date[d]?|Signed):\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i;
  const bankruptcyDateRegex = /Date\s+of\s+Bankruptcy:\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i;
  const districtRegex = /District(?:\s+of)?:\s*([^\n]+)/i;
  const divisionNumberRegex = /Division\s*(?:No\.?)?\s*(\d+)/i;
  const courtNumberRegex = /Court\s*(?:No\.?)?\s*(\d+)/i;

  // Extract information using regex
  const formNumber = (text.match(formNumberRegex) || [])[1] || '';
  const clientName = (text.match(clientNameRegex) || [])[1] || '';
  const trusteeName = (text.match(trusteeNameRegex) || [])[1] || '';
  const estateNumber = (text.match(estateNumberRegex) || [])[1] || '';
  const dateSigned = (text.match(dateSignedRegex) || [])[1] || '';
  const bankruptcyDate = (text.match(bankruptcyDateRegex) || [])[1] || '';
  const district = (text.match(districtRegex) || [])[1] || '';
  const divisionNumber = (text.match(divisionNumberRegex) || [])[1] || '';
  const courtNumber = (text.match(courtNumberRegex) || [])[1] || '';

  // Determine document type based on content
  const documentType = determineDocumentType(text);

  // Extract client and trustee info
  const clientInfo = {
    name: clientName?.trim(),
    address: extractAddress(text, clientName)
  };

  const trusteeInfo = {
    name: trusteeName?.trim(),
    address: extractAddress(text, trusteeName)
  };

  // Generate summary
  const summary = generateSummary(text, documentType);

  // Analyze risks and validate form
  const risks = await analyzeRisks(text, documentType);
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
    meetingInfo: extractMeetingInfo(text),
    chairInfo: extractChairInfo(text),
    securityInfo: extractSecurityInfo(text),
    officialReceiver: extractOfficialReceiver(text),
    summary,
    risks,
    regulatoryCompliance: validationResults
  };
}

function determineDocumentType(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('bankruptcy') || lowerText.includes('bankrupt')) return 'bankruptcy';
  if (lowerText.includes('proposal')) return 'proposal';
  if (lowerText.includes('receivership')) return 'receivership';
  if (lowerText.includes('court')) return 'court';
  return 'general';
}

function extractAddress(text: string, name: string): string {
  if (!name) return '';
  const nameIndex = text.indexOf(name);
  if (nameIndex === -1) return '';
  
  const addressSection = text.substring(nameIndex + name.length, nameIndex + 200);
  const lines = addressSection.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes('Estate No') && !line.includes('Date'));
  
  return lines.slice(0, 3).join(', ');
}

function extractMeetingInfo(text: string): string {
  const meetingRegex = /Meeting of Creditors[:\s]*([^\n]+)/i;
  return (text.match(meetingRegex) || [])[1] || '';
}

function extractChairInfo(text: string): string {
  const chairRegex = /Chair(?:person)?[:\s]*([^\n]+)/i;
  return (text.match(chairRegex) || [])[1] || '';
}

function extractSecurityInfo(text: string): string {
  const securityRegex = /Security[:\s]*([^\n]+)/i;
  return (text.match(securityRegex) || [])[1] || '';
}

function extractOfficialReceiver(text: string): string {
  const receiverRegex = /Official\s+Receiver[:\s]*([^\n]+)/i;
  return (text.match(receiverRegex) || [])[1] || '';
}

function generateSummary(text: string, documentType: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const relevantSentences = sentences
    .filter(s => {
      const lower = s.toLowerCase();
      return lower.includes(documentType) ||
             lower.includes('estate') ||
             lower.includes('creditor') ||
             lower.includes('trustee');
    })
    .slice(0, 3);
  
  return relevantSentences.join('. ') + '.';
}
