
import { DocumentMetadata } from '@/utils/documents/types';

export interface ClassificationResult {
  documentType: string;
  documentCategory: string;
  formNumber?: string;
  formVersion?: string;
  formTitle?: string;
  language?: 'EN' | 'FR' | 'Bilingual';
  confidence: number;
}

// Main document classifier function
export async function classifyDocument(text: string, fileName: string): Promise<ClassificationResult> {
  console.log('Classifying document:', fileName);
  
  // Default low-confidence result
  const defaultResult: ClassificationResult = {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.3
  };
  
  // Early return if no text content
  if (!text || text.trim().length === 0) {
    console.log('No text content to classify');
    return defaultResult;
  }
  
  // Normalize text for analysis
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Check for OSB forms first (highest priority)
  const osbFormResult = identifyOSBForm(normalizedText, fileName);
  if (osbFormResult.confidence > 0.7) {
    return osbFormResult;
  }
  
  // Check for financial documents
  const financialResult = identifyFinancialDocument(normalizedText, fileName);
  if (financialResult.confidence > 0.7) {
    return financialResult;
  }
  
  // Check for creditor documents
  const creditorResult = identifyCreditorDocument(normalizedText, fileName);
  if (creditorResult.confidence > 0.7) {
    return creditorResult;
  }
  
  // Check for identity documents
  const identityResult = identifyIdentityDocument(normalizedText, fileName);
  if (identityResult.confidence > 0.7) {
    return identityResult;
  }
  
  // Check for legal documents
  const legalResult = identifyLegalDocument(normalizedText, fileName);
  if (legalResult.confidence > 0.7) {
    return legalResult;
  }
  
  // Check for correspondence
  const correspondenceResult = identifyCorrespondence(normalizedText, fileName);
  if (correspondenceResult.confidence > 0.7) {
    return correspondenceResult;
  }
  
  // Use filename as fallback classification method
  const filenameResult = classifyByFileName(fileName);
  if (filenameResult.confidence > defaultResult.confidence) {
    return filenameResult;
  }
  
  return defaultResult;
}

// OSB Form identification
function identifyOSBForm(text: string, fileName: string): ClassificationResult {
  // Regex patterns for OSB form detection
  const formNumberPattern = /(?:form|annexe|formulaire)\s*(?:no\.?|#|number|numéro)?\s*(\d+[a-z]?)/i;
  const formMatch = text.match(formNumberPattern) || fileName.match(formNumberPattern);
  
  if (formMatch) {
    const formNumber = formMatch[1];
    const result: ClassificationResult = {
      documentType: `OSB_Form_${formNumber}`,
      documentCategory: 'OSB_FORM',
      formNumber,
      confidence: 0.8
    };
    
    // Enhance with additional form details if available
    result.formTitle = getFormTitle(formNumber);
    result.formVersion = extractFormVersion(text);
    result.language = determineLanguage(text);
    
    // Further improve confidence based on content matches
    if (text.includes(`form ${formNumber}`) || text.includes(`form${formNumber}`)) {
      result.confidence = Math.min(result.confidence + 0.15, 0.95);
    }
    
    // Map specific form types with detailed information
    if (formNumber === '31') {
      result.formTitle = 'Assignment for General Benefit of Creditors';
      result.confidence = 0.9;
    } else if (formNumber === '47') {
      result.formTitle = 'Consumer Proposal';
      result.confidence = 0.9;
    } else if (formNumber === '65') {
      result.formTitle = 'Monthly Income and Expense Statement of the Bankrupt/Debtor';
      result.confidence = 0.9;
    } else if (formNumber === '76') {
      result.formTitle = 'Statement of Affairs for Individuals';
      result.confidence = 0.9;
    } else if (formNumber === '79') {
      result.formTitle = 'Statement of Affairs for Companies';
      result.confidence = 0.9;
    }
    
    return result;
  }
  
  // Look for form-specific patterns if no form number was found
  if (text.includes('assignment') && (text.includes('general benefit') || text.includes('creditors'))) {
    return {
      documentType: 'OSB_Form_31',
      documentCategory: 'OSB_FORM',
      formNumber: '31',
      formTitle: 'Assignment for General Benefit of Creditors',
      confidence: 0.85
    };
  }
  
  if (text.includes('consumer proposal') || text.includes('division ii proposal')) {
    return {
      documentType: 'OSB_Form_47',
      documentCategory: 'OSB_FORM',
      formNumber: '47',
      formTitle: 'Consumer Proposal',
      confidence: 0.85
    };
  }
  
  if (text.includes('income and expense') || text.includes('monthly income')) {
    return {
      documentType: 'OSB_Form_65',
      documentCategory: 'OSB_FORM',
      formNumber: '65',
      formTitle: 'Monthly Income and Expense Statement',
      confidence: 0.85
    };
  }
  
  if (text.includes('statement of affairs') || text.includes('assets and liabilities')) {
    if (text.includes('companies') || text.includes('corporation') || text.includes('corporate')) {
      return {
        documentType: 'OSB_Form_79',
        documentCategory: 'OSB_FORM',
        formNumber: '79',
        formTitle: 'Statement of Affairs for Companies',
        confidence: 0.85
      };
    } else {
      return {
        documentType: 'OSB_Form_76',
        documentCategory: 'OSB_FORM',
        formNumber: '76',
        formTitle: 'Statement of Affairs for Individuals',
        confidence: 0.85
      };
    }
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Financial document identification
function identifyFinancialDocument(text: string, fileName: string): ClassificationResult {
  // Check for bank statements
  if ((text.includes('account statement') || text.includes('bank statement') || 
       text.includes('statement of account') || text.includes('transaction history')) &&
      (text.includes('balance') || text.includes('deposit') || text.includes('withdrawal'))) {
    
    let bankName = 'Unknown';
    // Try to identify bank name
    const commonBanks = ['rbc', 'royal bank', 'td', 'toronto dominion', 'bmo', 'bank of montreal', 
                         'cibc', 'scotiabank', 'tangerine', 'simplii', 'national bank'];
    
    for (const bank of commonBanks) {
      if (text.includes(bank) || fileName.toLowerCase().includes(bank)) {
        bankName = bank.charAt(0).toUpperCase() + bank.slice(1);
        break;
      }
    }
    
    return {
      documentType: 'Bank_Statement',
      documentCategory: 'FINANCIAL',
      confidence: 0.85,
      formTitle: `${bankName} Bank Statement`
    };
  }
  
  // Check for tax documents
  if (text.includes('notice of assessment') || text.includes('t1 general') || 
      text.includes('income tax') || text.includes('tax return') || 
      fileName.toLowerCase().includes('tax')) {
    
    let taxType = 'Tax Document';
    if (text.includes('t1') || text.includes('personal tax')) {
      taxType = 'T1 Personal Tax Return';
    } else if (text.includes('t2') || text.includes('corporate tax')) {
      taxType = 'T2 Corporate Tax Return';
    } else if (text.includes('notice of assessment')) {
      taxType = 'Notice of Assessment';
    }
    
    return {
      documentType: taxType,
      documentCategory: 'FINANCIAL',
      confidence: 0.85
    };
  }
  
  // Check for pay stubs
  if (text.includes('pay stub') || text.includes('paystub') || 
      text.includes('payroll') || text.includes('earnings statement')) {
    return {
      documentType: 'Pay_Stub',
      documentCategory: 'FINANCIAL',
      confidence: 0.85
    };
  }
  
  // Check for credit card statements
  if (text.includes('credit card') && (text.includes('statement') || text.includes('bill'))) {
    return {
      documentType: 'Credit_Card_Statement',
      documentCategory: 'FINANCIAL',
      confidence: 0.85
    };
  }
  
  // Check for generic financial statements by filename
  const fnLower = fileName.toLowerCase();
  if (fnLower.includes('statement') || fnLower.includes('financial') || 
      fnLower.includes('balance') || fnLower.includes('bank')) {
    return {
      documentType: 'Financial_Statement',
      documentCategory: 'FINANCIAL',
      confidence: 0.7
    };
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Creditor document identification
function identifyCreditorDocument(text: string, fileName: string): ClassificationResult {
  // Check for proof of claim
  if (text.includes('proof of claim') || text.includes('claim form') || text.includes('claim against')) {
    return {
      documentType: 'Proof_Of_Claim',
      documentCategory: 'CREDITOR',
      confidence: 0.85
    };
  }
  
  // Check for collection letters
  if ((text.includes('collection') || text.includes('past due') || text.includes('overdue')) && 
      (text.includes('payment') || text.includes('amount owing') || text.includes('debt'))) {
    return {
      documentType: 'Collection_Letter',
      documentCategory: 'CREDITOR',
      confidence: 0.85
    };
  }
  
  // Check for credit reports
  if (text.includes('credit report') || text.includes('credit bureau') || 
      text.includes('equifax') || text.includes('transunion')) {
    return {
      documentType: 'Credit_Report',
      documentCategory: 'CREDITOR',
      confidence: 0.9
    };
  }
  
  // Check for creditor listing from filename
  const fnLower = fileName.toLowerCase();
  if (fnLower.includes('creditor') || fnLower.includes('claim') || fnLower.includes('debt')) {
    return {
      documentType: 'Creditor_Document',
      documentCategory: 'CREDITOR',
      confidence: 0.7
    };
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Identity document identification
function identifyIdentityDocument(text: string, fileName: string): ClassificationResult {
  // Check for driver's license
  if (text.includes('driver') && (text.includes('license') || text.includes('licence'))) {
    return {
      documentType: 'Drivers_License',
      documentCategory: 'IDENTITY',
      confidence: 0.85
    };
  }
  
  // Check for passport
  if (text.includes('passport')) {
    return {
      documentType: 'Passport',
      documentCategory: 'IDENTITY',
      confidence: 0.9
    };
  }
  
  // Check for SIN card or number
  if (text.includes('social insurance') || text.includes('sin card') || 
      text.includes('sin number') || text.match(/\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/)) {
    return {
      documentType: 'SIN_Card',
      documentCategory: 'IDENTITY',
      confidence: 0.9
    };
  }
  
  // Check for identity documents from filename
  const fnLower = fileName.toLowerCase();
  if (fnLower.includes('id') || fnLower.includes('passport') || 
      fnLower.includes('license') || fnLower.includes('identification')) {
    return {
      documentType: 'Identity_Document',
      documentCategory: 'IDENTITY',
      confidence: 0.7
    };
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Legal document identification
function identifyLegalDocument(text: string, fileName: string): ClassificationResult {
  // Check for court orders
  if (text.includes('court order') || text.includes('order of the court')) {
    return {
      documentType: 'Court_Order',
      documentCategory: 'LEGAL',
      confidence: 0.9
    };
  }
  
  // Check for affidavits
  if (text.includes('affidavit') || text.includes('sworn statement')) {
    return {
      documentType: 'Affidavit',
      documentCategory: 'LEGAL',
      confidence: 0.9
    };
  }
  
  // Check for notices
  if (text.includes('notice of') && text.includes('bankruptcy')) {
    return {
      documentType: 'Bankruptcy_Notice',
      documentCategory: 'LEGAL',
      confidence: 0.85
    };
  }
  
  // Check for legal documents from filename
  const fnLower = fileName.toLowerCase();
  if (fnLower.includes('court') || fnLower.includes('legal') || 
      fnLower.includes('affidavit') || fnLower.includes('notice')) {
    return {
      documentType: 'Legal_Document',
      documentCategory: 'LEGAL',
      confidence: 0.7
    };
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Correspondence identification
function identifyCorrespondence(text: string, fileName: string): ClassificationResult {
  // Check for letters
  const hasLetterFormat = text.includes('dear') && (text.includes('sincerely') || text.includes('regards'));
  if (hasLetterFormat) {
    return {
      documentType: 'Letter',
      documentCategory: 'CORRESPONDENCE',
      confidence: 0.8
    };
  }
  
  // Check for emails
  if (text.includes('from:') && text.includes('to:') && text.includes('subject:')) {
    return {
      documentType: 'Email',
      documentCategory: 'CORRESPONDENCE',
      confidence: 0.85
    };
  }
  
  // Check for correspondence from filename
  const fnLower = fileName.toLowerCase();
  if (fnLower.includes('letter') || fnLower.includes('email') || 
      fnLower.includes('correspondence') || fnLower.includes('message')) {
    return {
      documentType: 'Correspondence',
      documentCategory: 'CORRESPONDENCE',
      confidence: 0.7
    };
  }
  
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.1
  };
}

// Classify based on filename patterns
function classifyByFileName(fileName: string): ClassificationResult {
  const fileNameLower = fileName.toLowerCase();
  
  // Check for common document type indicators in filename
  if (fileNameLower.match(/form\s*(\d+)/i)) {
    const formNumber = fileNameLower.match(/form\s*(\d+)/i)?.[1] || '';
    return {
      documentType: `OSB_Form_${formNumber}`,
      documentCategory: 'OSB_FORM',
      formNumber,
      confidence: 0.7
    };
  }
  
  if (fileNameLower.includes('bank') || fileNameLower.includes('statement')) {
    return {
      documentType: 'Financial_Statement',
      documentCategory: 'FINANCIAL',
      confidence: 0.6
    };
  }
  
  if (fileNameLower.includes('id') || fileNameLower.includes('license')) {
    return {
      documentType: 'Identity_Document',
      documentCategory: 'IDENTITY',
      confidence: 0.6
    };
  }
  
  // Default low confidence result
  return {
    documentType: 'unknown',
    documentCategory: 'unknown',
    confidence: 0.4
  };
}

// Helper functions
function getFormTitle(formNumber: string): string {
  // Map of common OSB form numbers to their titles
  const formTitleMap: Record<string, string> = {
    '31': 'Assignment for General Benefit of Creditors',
    '33': 'Certificate of Assignment',
    '40': 'Notice of Bankruptcy and First Meeting of Creditors',
    '47': 'Consumer Proposal',
    '65': 'Monthly Income and Expense Statement',
    '66': 'Notice of Intention to Make a Proposal',
    '76': 'Statement of Affairs for Individuals',
    '79': 'Statement of Affairs for Companies',
    '82': 'Certificate of Discharge of Bankrupt',
    '84': 'Certificate of Full Performance of Proposal'
  };
  
  return formTitleMap[formNumber] || `Form ${formNumber}`;
}

function extractFormVersion(text: string): string {
  // Look for version indicators in the text
  const versionRegex = /(?:version|v\.?)?\s*(20\d{2}[-\/]?\d{2})/i;
  const match = text.match(versionRegex);
  return match ? match[1] : '';
}

function determineLanguage(text: string): 'EN' | 'FR' | 'Bilingual' {
  const englishIndicators = ['form', 'bankruptcy', 'creditor', 'debtor', 'trustee'];
  const frenchIndicators = ['formulaire', 'faillite', 'créancier', 'débiteur', 'syndic'];
  
  let englishCount = 0;
  let frenchCount = 0;
  
  // Count language indicators
  englishIndicators.forEach(word => {
    if (text.includes(word)) englishCount++;
  });
  
  frenchIndicators.forEach(word => {
    if (text.includes(word)) frenchCount++;
  });
  
  // Determine language based on indicators
  if (englishCount > 0 && frenchCount > 0) return 'Bilingual';
  if (frenchCount > englishCount) return 'FR';
  return 'EN';
}

// Function to extract metadata from the document
export function extractDocumentMetadata(text: string, classification: ClassificationResult): DocumentMetadata {
  const metadata: DocumentMetadata = {
    document_type: classification.documentType,
    form_type: classification.documentCategory,
    form_number: classification.formNumber,
    confidence_score: classification.confidence,
    processing_status: 'pending',
    upload_timestamp: new Date().toISOString()
  };
  
  // Add form-specific extracted fields based on document type
  if (classification.formNumber === '31') {
    extractForm31Fields(text, metadata);
  } else if (classification.formNumber === '47') {
    extractForm47Fields(text, metadata);
  }
  
  return metadata;
}

// Extract fields from Form 31
function extractForm31Fields(text: string, metadata: DocumentMetadata): void {
  const extractedFields: Record<string, any> = {};
  
  // Extract debtor name
  const debtorMatch = text.match(/(?:name\s+of\s+bankrupt|debtor):\s*([^\n]+)/i);
  if (debtorMatch) {
    extractedFields.debtor_name = debtorMatch[1].trim();
    metadata.client_name = extractedFields.debtor_name;
  }
  
  // Extract trustee name
  const trusteeMatch = text.match(/(?:trustee|licensed\s+insolvency\s+trustee|lit):\s*([^\n]+)/i);
  if (trusteeMatch) {
    extractedFields.trustee_name = trusteeMatch[1].trim();
  }
  
  // Extract assignment date
  const dateMatch = text.match(/(?:date\s+of\s+assignment|dated):\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
  if (dateMatch) {
    extractedFields.date_of_assignment = dateMatch[1].trim();
  }
  
  // Extract estate number if present
  const estateMatch = text.match(/(?:estate\s+(?:no|number)):\s*([^\n]+)/i);
  if (estateMatch) {
    extractedFields.estate_number = estateMatch[1].trim();
  }
  
  metadata.extracted_fields = extractedFields;
}

// Extract fields from Form 47
function extractForm47Fields(text: string, metadata: DocumentMetadata): void {
  const extractedFields: Record<string, any> = {};
  
  // Extract debtor name
  const debtorMatch = text.match(/(?:name\s+of\s+debtor|consumer\s+debtor):\s*([^\n]+)/i);
  if (debtorMatch) {
    extractedFields.debtor_name = debtorMatch[1].trim();
    metadata.client_name = extractedFields.debtor_name;
  }
  
  // Extract administrator name
  const adminMatch = text.match(/(?:administrator|proposal\s+administrator):\s*([^\n]+)/i);
  if (adminMatch) {
    extractedFields.administrator_name = adminMatch[1].trim();
  }
  
  // Extract proposal date
  const dateMatch = text.match(/(?:date\s+of\s+proposal|dated):\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
  if (dateMatch) {
    extractedFields.date_of_proposal = dateMatch[1].trim();
  }
  
  metadata.extracted_fields = extractedFields;
}
