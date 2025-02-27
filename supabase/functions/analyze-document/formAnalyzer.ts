
import { analyzeRisks } from "./riskAnalyzer.ts";
import { validateForm } from "./validation/formValidation.ts";

export async function processDocument(text: string, includeRegulatory: boolean = true) {
  console.log('Processing document text length:', text.length);

  // Enhanced regex patterns with multiple variations
  const formNumberRegex = /(?:Form|FORM)\s*(?:No\.?|NUMBER|#)?\s*(\d+)/i;
  const clientNameRegex = /(?:Debtor|Client|DEBTOR|CLIENT|Name of bankrupt|NAME OF BANKRUPT):\s*([^\n]+)/i;
  const trusteeNameRegex = /(?:Licensed\s+Insolvency\s+)?(?:Trustee|TRUSTEE|LIT):\s*([^\n]+)/i;
  const estateNumberRegex = /(?:Estate|ESTATE)\s*(?:No\.?|Number|#)?\s*[:-]?\s*(\d[\d-]+)/i;
  const dateSignedRegex = /(?:Date[d]?|Signed|DATED|SIGNED)(?:\s+(?:at|on))?\s*[:-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i;
  const bankruptcyDateRegex = /(?:Date\s+of\s+[Bb]ankruptcy|Bankruptcy\s+[Dd]ate):\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i;
  const districtRegex = /(?:District|DISTRICT)(?:\s+of)?:\s*([^\n]+)/i;
  const divisionNumberRegex = /(?:Division|DIVISION)\s*(?:No\.?|Number|#)?\s*[:-]?\s*(\d+)/i;
  const courtNumberRegex = /(?:Court|COURT)\s*(?:No\.?|Number|#)?\s*[:-]?\s*(\d+)/i;

  // Enhanced text normalization
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract information using regex with fallback patterns
  const formNumber = (normalizedText.match(formNumberRegex) || [])[1] || '';
  const clientName = (normalizedText.match(clientNameRegex) || [])[1] || '';
  const trusteeName = (normalizedText.match(trusteeNameRegex) || [])[1] || '';
  const estateNumber = (normalizedText.match(estateNumberRegex) || [])[1] || '';
  const dateSigned = (normalizedText.match(dateSignedRegex) || [])[1] || '';
  const bankruptcyDate = (normalizedText.match(bankruptcyDateRegex) || [])[1] || '';
  const district = (normalizedText.match(districtRegex) || [])[1] || '';
  const divisionNumber = (normalizedText.match(divisionNumberRegex) || [])[1] || '';
  const courtNumber = (normalizedText.match(courtNumberRegex) || [])[1] || '';

  // Extract addresses with better context awareness
  const clientInfo = {
    name: clientName?.trim(),
    address: extractAddress(normalizedText, clientName, 'client')
  };

  const trusteeInfo = {
    name: trusteeName?.trim(),
    address: extractAddress(normalizedText, trusteeName, 'trustee')
  };

  // Generate comprehensive summary
  const summary = generateSummary(normalizedText, determineDocumentType(normalizedText));

  // Analyze risks and validate form
  const risks = await analyzeRisks(normalizedText, determineDocumentType(normalizedText));
  const validationResults = await validateForm(normalizedText, determineDocumentType(normalizedText));

  return {
    documentType: determineDocumentType(normalizedText),
    formNumber,
    clientInfo,
    trusteeInfo,
    dateSigned,
    bankruptcyDate,
    estateNumber,
    district,
    divisionNumber,
    courtNumber,
    meetingInfo: extractMeetingInfo(normalizedText),
    chairInfo: extractChairInfo(normalizedText),
    securityInfo: extractSecurityInfo(normalizedText),
    officialReceiver: extractOfficialReceiver(normalizedText),
    summary,
    risks,
    regulatoryCompliance: validationResults
  };
}

function determineDocumentType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (text.includes('Form 76')) return 'Statement of Receipts and Disbursements';
  if (text.includes('Form 49')) return 'Assignment for General Benefit of Creditors';
  if (text.includes('Form 31')) return 'Notice of Bankruptcy';
  if (lowerText.includes('proposal')) return 'Consumer Proposal';
  if (lowerText.includes('bankruptcy') || lowerText.includes('bankrupt')) return 'Bankruptcy';
  if (lowerText.includes('receivership')) return 'Receivership';
  
  return 'General Document';
}

function extractAddress(text: string, name: string, type: 'client' | 'trustee'): string {
  if (!name) return '';
  
  const nameIndex = text.indexOf(name);
  if (nameIndex === -1) return '';
  
  // Look for address markers
  const markers = type === 'client' 
    ? ['residing at', 'address:', 'residence:', 'domiciled at']
    : ['office at', 'located at', 'address:', 'business address:'];
  
  let addressStart = -1;
  for (const marker of markers) {
    const markerIndex = text.toLowerCase().indexOf(marker, nameIndex);
    if (markerIndex !== -1) {
      addressStart = markerIndex + marker.length;
      break;
    }
  }
  
  if (addressStart === -1) {
    // Fallback: look for text after the name until a clear delimiter
    addressStart = nameIndex + name.length;
  }
  
  const addressSection = text.substring(addressStart, addressStart + 200);
  const lines = addressSection.split('\n')
    .map(line => line.trim())
    .filter(line => {
      const l = line.toLowerCase();
      return line && 
        !l.includes('estate no') && 
        !l.includes('date') &&
        !l.includes('signature') &&
        !l.includes('trustee') &&
        !l.includes('bankrupt');
    });
  
  return lines.slice(0, 3).join(', ');
}

function extractMeetingInfo(text: string): string {
  const meetingPatterns = [
    /Meeting of Creditors[:\s]*([^\n]+)/i,
    /First Meeting[:\s]*([^\n]+)/i,
    /Creditors(?:'|s)? Meeting[:\s]*([^\n]+)/i
  ];

  for (const pattern of meetingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  
  return '';
}

function extractChairInfo(text: string): string {
  const chairPatterns = [
    /Chair(?:person)?[:\s]*([^\n]+)/i,
    /Meeting Chair[:\s]*([^\n]+)/i,
    /Presiding Officer[:\s]*([^\n]+)/i
  ];

  for (const pattern of chairPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  
  return '';
}

function extractSecurityInfo(text: string): string {
  const securityPatterns = [
    /Security[:\s]*([^\n]+)/i,
    /Collateral[:\s]*([^\n]+)/i,
    /Assets Secured[:\s]*([^\n]+)/i
  ];

  for (const pattern of securityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  
  return '';
}

function extractOfficialReceiver(text: string): string {
  const receiverPatterns = [
    /Official\s+Receiver[:\s]*([^\n]+)/i,
    /O\.R\.[:\s]*([^\n]+)/i,
    /Receiver[:\s]*([^\n]+)/i
  ];

  for (const pattern of receiverPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  
  return '';
}

function generateSummary(text: string, documentType: string): string {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  
  // Identify key sentences based on document type
  const keyPhrases = [
    documentType.toLowerCase(),
    'estate',
    'creditor',
    'trustee',
    'bankrupt',
    'proposal',
    'receivership',
    'disbursement',
    'receipt'
  ];
  
  const relevantSentences = sentences.filter(s => {
    const lower = s.toLowerCase();
    return keyPhrases.some(phrase => lower.includes(phrase));
  });
  
  // Take the first 3 most relevant sentences
  return relevantSentences.slice(0, 3).join('. ') + (relevantSentences.length > 0 ? '.' : '');
}
