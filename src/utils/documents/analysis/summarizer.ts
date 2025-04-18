
import { ClassificationResult } from './documentClassifier';
import { DocumentMetadata } from '../types';

export interface SummarizationResult {
  summary: string;
  keyDetails: {
    documentType: string;
    parties: string[];
    dates: Record<string, string>;
    financialSnapshot?: {
      totalAmount?: string;
      currency?: string;
      breakdown?: Record<string, string>;
    };
    legalImplications?: string[];
    nextSteps?: string[];
  };
}

export function generateDocumentSummary(
  text: string,
  classification: ClassificationResult,
  metadata: DocumentMetadata
): SummarizationResult {
  console.log(`Generating summary for ${classification.documentType}`);
  
  // Initialize result with default structure
  const result: SummarizationResult = {
    summary: '',
    keyDetails: {
      documentType: classification.documentType,
      parties: [],
      dates: {},
      legalImplications: [],
      nextSteps: []
    }
  };
  
  // Extract key information based on document type
  if (classification.documentType.startsWith('OSB_Form_')) {
    generateOSBFormSummary(text, classification, metadata, result);
  } else if (classification.documentType === 'Bank_Statement') {
    generateBankStatementSummary(text, classification, metadata, result);
  } else if (classification.documentType === 'Proof_Of_Claim') {
    generateProofOfClaimSummary(text, classification, metadata, result);
  } else {
    generateGenericDocumentSummary(text, classification, metadata, result);
  }
  
  return result;
}

// Generate summary for OSB forms
function generateOSBFormSummary(
  text: string,
  classification: ClassificationResult,
  metadata: DocumentMetadata,
  result: SummarizationResult
): void {
  const formNumber = classification.formNumber || '';
  const formTitle = classification.formTitle || `Form ${formNumber}`;
  const normalizedText = text.toLowerCase();
  
  // Extract debtor name from metadata or text
  const debtorName = metadata.client_name || extractEntityName(text, 'debtor') || 'Unnamed Debtor';
  result.keyDetails.parties.push(debtorName);
  
  // Extract trustee/administrator name
  const trusteeName = extractEntityName(text, 'trustee') || extractEntityName(text, 'administrator') || 'Unnamed Trustee';
  result.keyDetails.parties.push(trusteeName);
  
  // Extract signing date
  const signingDate = extractDate(text, 'signed') || extractDate(text, 'dated') || 'unknown date';
  result.keyDetails.dates['signedDate'] = signingDate;
  
  // Handle specific form types
  switch (formNumber) {
    case '31':
      // Form 31: Assignment for General Benefit of Creditors
      result.summary = `Assignment for General Benefit of Creditors (OSB Form 31${classification.formVersion ? ', version ' + classification.formVersion : ''}) signed by ${debtorName} on ${signingDate}. This document transfers all non-exempt property from the debtor to ${trusteeName} for distribution to creditors. This initiates formal bankruptcy proceedings under BIA section 49(1). Document must be filed with OSB within 5 days of signing and notice sent to creditors within 10 days.`;
      
      result.keyDetails.legalImplications = [
        'Initiates bankruptcy proceedings',
        'Transfers non-exempt property to trustee',
        'Automatic stay of proceedings against debtor'
      ];
      
      result.keyDetails.nextSteps = [
        'File with OSB within 5 days',
        'Send notice to creditors within 10 days',
        'First meeting of creditors within 21 days'
      ];
      
      break;
      
    case '47':
      // Form 47: Consumer Proposal
      result.summary = `Consumer Proposal (OSB Form 47${classification.formVersion ? ', version ' + classification.formVersion : ''}) signed by ${debtorName} on ${signingDate}. This document outlines the debtor's proposal to pay creditors a portion of their debts through ${trusteeName}. The document establishes a payment plan alternative to bankruptcy under BIA Division II. Creditors will vote on acceptance of the proposal at a meeting to be scheduled within 45 days.`;
      
      result.keyDetails.legalImplications = [
        'Alternative to bankruptcy proceedings',
        'Partial debt repayment over specified period',
        'Stay of proceedings against debtor while in effect'
      ];
      
      result.keyDetails.nextSteps = [
        'File with OSB immediately',
        'Administrator to call meeting of creditors',
        'Creditors to vote on proposal within 45 days'
      ];
      
      break;
      
    case '65':
      // Form 65: Monthly Income and Expense Statement
      // Extract financial information
      const income = extractMonetaryValue(text, 'income') || extractMonetaryValue(text, 'earnings') || 'unknown';
      const expenses = extractMonetaryValue(text, 'expense') || extractMonetaryValue(text, 'expenditure') || 'unknown';
      
      result.summary = `Monthly Income and Expense Statement (OSB Form 65${classification.formVersion ? ', version ' + classification.formVersion : ''}) for ${debtorName} dated ${signingDate}. The document reports total monthly income of ${income} and total expenses of ${expenses}. This statement supports income disclosure requirements for bankruptcy or proposal proceedings and is used to determine surplus income payments if applicable.`;
      
      result.keyDetails.financialSnapshot = {
        totalAmount: income,
        breakdown: {
          'Total Income': income,
          'Total Expenses': expenses
        }
      };
      
      result.keyDetails.legalImplications = [
        'Determines potential surplus income payments',
        'Required for ongoing bankruptcy administration'
      ];
      
      break;
      
    case '76':
      // Form 76: Statement of Affairs for Individuals
      // Extract financial information
      const assets = extractMonetaryValue(text, 'assets') || extractMonetaryValue(text, 'property') || 'unknown';
      const liabilities = extractMonetaryValue(text, 'liabilities') || extractMonetaryValue(text, 'debts') || 'unknown';
      
      result.summary = `Statement of Affairs for Individuals (OSB Form 76${classification.formVersion ? ', version ' + classification.formVersion : ''}) signed by ${debtorName} on ${signingDate}. The document details all assets valued at approximately ${assets} and liabilities of approximately ${liabilities}. This sworn statement is required for bankruptcy filing and provides a comprehensive financial snapshot of the debtor's situation at the time of filing.`;
      
      result.keyDetails.financialSnapshot = {
        breakdown: {
          'Total Assets': assets,
          'Total Liabilities': liabilities
        }
      };
      
      result.keyDetails.legalImplications = [
        'Required for bankruptcy filing',
        'Sworn statement subject to penalties for false information',
        'Establishes baseline for exempt and non-exempt assets'
      ];
      
      break;
      
    default:
      // Generic OSB form summary
      result.summary = `${formTitle} (OSB Form ${formNumber}${classification.formVersion ? ', version ' + classification.formVersion : ''}) ${signingDate !== 'unknown date' ? 'dated ' + signingDate : ''}. This document is part of the formal ${classification.documentCategory.toLowerCase().replace('_', ' ')} process for ${debtorName}. ${trusteeName !== 'Unnamed Trustee' ? 'The document involves ' + trusteeName + '.' : ''}`;
      
      result.keyDetails.legalImplications = [
        'Official OSB document for insolvency proceedings'
      ];
  }
}

// Generate summary for bank statements
function generateBankStatementSummary(
  text: string,
  classification: ClassificationResult,
  metadata: DocumentMetadata,
  result: SummarizationResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Extract account holder name
  const accountHolder = metadata.client_name || extractEntityName(text, 'account holder') || 'Account Holder';
  result.keyDetails.parties.push(accountHolder);
  
  // Extract bank/institution name
  const bankName = extractBankName(text) || 'Financial Institution';
  result.keyDetails.parties.push(bankName);
  
  // Extract account number (last 4 digits for privacy)
  const accountNumber = extractAccountNumber(text);
  
  // Extract statement period
  const periodStart = extractDate(text, 'from') || extractDate(text, 'period') || 'unknown start date';
  const periodEnd = extractDate(text, 'to') || extractDate(text, 'ending') || 'unknown end date';
  result.keyDetails.dates['periodStart'] = periodStart;
  result.keyDetails.dates['periodEnd'] = periodEnd;
  
  // Extract financial information
  const openingBalance = extractMonetaryValue(text, 'opening balance') || extractMonetaryValue(text, 'beginning balance') || 'unknown';
  const closingBalance = extractMonetaryValue(text, 'closing balance') || extractMonetaryValue(text, 'ending balance') || 'unknown';
  const deposits = extractMonetaryValue(text, 'total deposit') || extractMonetaryValue(text, 'deposits') || 'unknown';
  const withdrawals = extractMonetaryValue(text, 'total withdrawal') || extractMonetaryValue(text, 'withdrawals') || 'unknown';
  
  // Build summary
  result.summary = `${bankName} ${classification.formTitle ? classification.formTitle.toLowerCase() : 'bank statement'} for ${accountHolder}${accountNumber ? ' (account ending ' + accountNumber + ')' : ''} covering the period ${periodStart !== 'unknown start date' ? periodStart : ''} to ${periodEnd !== 'unknown end date' ? periodEnd : ''}.${openingBalance !== 'unknown' ? ' Shows opening balance of ' + openingBalance + ',' : ''}${deposits !== 'unknown' ? ' total deposits of ' + deposits + ',' : ''}${withdrawals !== 'unknown' ? ' total withdrawals of ' + withdrawals + ',' : ''}${closingBalance !== 'unknown' ? ' and ending balance of ' + closingBalance + '.' : ''} This document provides financial activity details for the bankruptcy proceedings.`;
  
  // Add financial snapshot
  result.keyDetails.financialSnapshot = {
    breakdown: {}
  };
  
  if (openingBalance !== 'unknown') {
    result.keyDetails.financialSnapshot.breakdown['Opening Balance'] = openingBalance;
  }
  if (deposits !== 'unknown') {
    result.keyDetails.financialSnapshot.breakdown['Total Deposits'] = deposits;
  }
  if (withdrawals !== 'unknown') {
    result.keyDetails.financialSnapshot.breakdown['Total Withdrawals'] = withdrawals;
  }
  if (closingBalance !== 'unknown') {
    result.keyDetails.financialSnapshot.breakdown['Closing Balance'] = closingBalance;
  }
  
  // Add implications
  result.keyDetails.legalImplications = [
    'Verifies financial activity during relevant period',
    'Supports income and expense declarations',
    'May reveal undisclosed assets or transactions'
  ];
}

// Generate summary for proof of claim documents
function generateProofOfClaimSummary(
  text: string,
  classification: ClassificationResult,
  metadata: DocumentMetadata,
  result: SummarizationResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Extract creditor name
  const creditorName = extractEntityName(text, 'creditor') || 'Unnamed Creditor';
  result.keyDetails.parties.push(creditorName);
  
  // Extract debtor name
  const debtorName = metadata.client_name || extractEntityName(text, 'debtor') || 'Unnamed Debtor';
  result.keyDetails.parties.push(debtorName);
  
  // Extract filing date
  const filingDate = extractDate(text, 'dated') || extractDate(text, 'filed') || 'unknown date';
  result.keyDetails.dates['filingDate'] = filingDate;
  
  // Extract claim amount
  const claimAmount = extractMonetaryValue(text, 'claim') || extractMonetaryValue(text, 'amount') || 'unknown amount';
  
  // Build summary
  result.summary = `Proof of Claim filed by ${creditorName} against ${debtorName} on ${filingDate}. The document asserts a claim of ${claimAmount} in the bankruptcy or proposal proceedings. This formal claim must be verified by the trustee/administrator before any distribution can be made to this creditor.`;
  
  // Add financial snapshot
  result.keyDetails.financialSnapshot = {
    totalAmount: claimAmount,
    breakdown: {
      'Claim Amount': claimAmount
    }
  };
  
  // Add implications and next steps
  result.keyDetails.legalImplications = [
    'Establishes creditor claim in proceedings',
    'Required for creditor to receive distribution',
    'Subject to review by trustee/administrator'
  ];
  
  result.keyDetails.nextSteps = [
    'Trustee to review claim for validity',
    'Claim may require supporting documentation',
    'May be subject to dispute by debtor'
  ];
}

// Generate generic summary for other document types
function generateGenericDocumentSummary(
  text: string,
  classification: ClassificationResult,
  metadata: DocumentMetadata,
  result: SummarizationResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Extract basic information
  const clientName = metadata.client_name || extractEntityName(text, 'client') || extractEntityName(text, 'debtor') || 'Unnamed Client';
  result.keyDetails.parties.push(clientName);
  
  // Extract document date
  const documentDate = extractDate(text, 'dated') || extractDate(text, 'date') || 'unknown date';
  result.keyDetails.dates['documentDate'] = documentDate;
  
  // Try to find any monetary values
  const monetaryValue = extractMonetaryValue(text, 'amount') || extractMonetaryValue(text, 'total') || extractMonetaryValue(text, '$');
  
  // Build generic summary based on document category
  let categoryDescription = '';
  let implications: string[] = [];
  
  switch (classification.documentCategory) {
    case 'FINANCIAL':
      categoryDescription = 'financial record';
      implications = ['Provides financial information relevant to proceedings'];
      break;
    case 'CREDITOR':
      categoryDescription = 'creditor document';
      implications = ['Relates to creditor claim or communication'];
      break;
    case 'IDENTITY':
      categoryDescription = 'identification document';
      implications = ['Verifies identity of the debtor/client'];
      break;
    case 'LEGAL':
      categoryDescription = 'legal document';
      implications = ['Has legal implications for the proceedings'];
      break;
    case 'CORRESPONDENCE':
      categoryDescription = 'correspondence';
      implications = ['Contains communication related to the proceedings'];
      break;
    default:
      categoryDescription = 'document';
      implications = ['May contain relevant information for the proceedings'];
  }
  
  // Build summary
  result.summary = `${classification.documentType} ${categoryDescription} ${documentDate !== 'unknown date' ? 'dated ' + documentDate : ''} related to ${clientName}.${monetaryValue ? ' The document references an amount of ' + monetaryValue + '.' : ''} This document has been categorized as ${classification.documentCategory.toLowerCase().replace('_', ' ')} with ${Math.round(classification.confidence * 100)}% confidence.`;
  
  // Add extracted monetary value if present
  if (monetaryValue) {
    result.keyDetails.financialSnapshot = {
      totalAmount: monetaryValue
    };
  }
  
  // Add implications
  result.keyDetails.legalImplications = implications;
}

// Helper function to extract entity names
function extractEntityName(text: string, entityType: string): string | null {
  const normalizedText = text.toLowerCase();
  
  // Define patterns based on entity type
  let patterns: RegExp[] = [];
  
  switch (entityType.toLowerCase()) {
    case 'debtor':
    case 'bankrupt':
      patterns = [
        new RegExp(`(?:debtor|bankrupt|client)[\\s:]*([\\w\\s&.',-]{5,50})`, 'i'),
        new RegExp(`name\\s+of\\s+(?:debtor|bankrupt)[\\s:]*([\\w\\s&.',-]{5,50})`, 'i')
      ];
      break;
      
    case 'trustee':
    case 'administrator':
      patterns = [
        new RegExp(`(?:trustee|administrator|lit)[\\s:]*([\\w\\s&.',-]{5,50})`, 'i'),
        new RegExp(`licensed\\s+insolvency\\s+trustee[\\s:]*([\\w\\s&.',-]{5,50})`, 'i')
      ];
      break;
      
    case 'creditor':
      patterns = [
        new RegExp(`creditor[\\s:]*([\\w\\s&.',-]{5,50})`, 'i'),
        new RegExp(`name\\s+of\\s+creditor[\\s:]*([\\w\\s&.',-]{5,50})`, 'i')
      ];
      break;
      
    case 'account holder':
      patterns = [
        new RegExp(`(?:account\\s+holder|customer)[\\s:]*([\\w\\s&.',-]{5,50})`, 'i'),
        new RegExp(`(?:statement\\s+for|prepared\\s+for)[\\s:]*([\\w\\s&.',-]{5,50})`, 'i')
      ];
      break;
      
    default:
      patterns = [
        new RegExp(`${entityType}[\\s:]*([\\w\\s&.',-]{5,50})`, 'i')
      ];
  }
  
  // Try each pattern
  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Helper function to extract dates
function extractDate(text: string, contextHint: string): string | null {
  const normalizedText = text.toLowerCase();
  
  // Define date patterns with context hints
  const patterns: Record<string, RegExp[]> = {
    'dated': [
      new RegExp(`dated[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`date[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`dated[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'signed': [
      new RegExp(`signed[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`signature[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`signed[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'from': [
      new RegExp(`from[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`start[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`from[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'to': [
      new RegExp(`to[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`end[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`to[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'period': [
      new RegExp(`period[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`statement[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`period[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'filed': [
      new RegExp(`filed[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`filing[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`filed[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ],
    'ending': [
      new RegExp(`ending[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`as of[\\s:]*([\\w\\s,]{2,30}\\d{4})`, 'i'),
      new RegExp(`ending[\\s:]*([\\d]{1,2}[/\\-\\.][\\d]{1,2}[/\\-\\.][\\d]{4})`, 'i')
    ]
  };
  
  // Generic date patterns for any context
  const genericPatterns = [
    // MM/DD/YYYY or DD/MM/YYYY
    /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})\b/,
    // Month DD, YYYY
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i,
    // DD Month YYYY
    /\b(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i,
    // YYYY-MM-DD
    /\b(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/
  ];
  
  // Try context-specific patterns first
  if (patterns[contextHint]) {
    for (const pattern of patterns[contextHint]) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  // Try nearby context
  const contextIndex = normalizedText.indexOf(contextHint);
  if (contextIndex !== -1) {
    // Look within 50 characters of the context hint
    const searchArea = normalizedText.substring(
      Math.max(0, contextIndex - 20),
      Math.min(normalizedText.length, contextIndex + 50)
    );
    
    // Try generic date patterns in this area
    for (const pattern of genericPatterns) {
      const match = searchArea.match(pattern);
      if (match && match[0]) {
        return match[0].trim();
      }
    }
  }
  
  // If no matches with context, try generic patterns on whole text
  for (const pattern of genericPatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }
  
  return null;
}

// Helper function to extract monetary values
function extractMonetaryValue(text: string, contextHint: string): string | null {
  const normalizedText = text.toLowerCase();
  
  // Define money patterns with context hints
  const patterns: Record<string, RegExp[]> = {
    'income': [
      new RegExp(`income[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`income[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'expense': [
      new RegExp(`expense[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`expense[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'earnings': [
      new RegExp(`earnings[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`earnings[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'expenditure': [
      new RegExp(`expenditure[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`expenditure[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'assets': [
      new RegExp(`assets[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`assets[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'property': [
      new RegExp(`property[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`property[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'liabilities': [
      new RegExp(`liabilities[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`liabilities[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'debts': [
      new RegExp(`debts[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`debts[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'opening balance': [
      new RegExp(`opening balance[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`opening balance[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'beginning balance': [
      new RegExp(`beginning balance[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`beginning balance[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'closing balance': [
      new RegExp(`closing balance[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`closing balance[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'ending balance': [
      new RegExp(`ending balance[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`ending balance[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'total deposit': [
      new RegExp(`total deposits?[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`total deposits?[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'deposits': [
      new RegExp(`deposits[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`deposits[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'total withdrawal': [
      new RegExp(`total withdrawals?[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`total withdrawals?[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'withdrawals': [
      new RegExp(`withdrawals[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`withdrawals[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'claim': [
      new RegExp(`claim[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`claim[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'amount': [
      new RegExp(`amount[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`amount[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    'total': [
      new RegExp(`total[\\s:]*\\$?\\s*([\\d,]+\\.?\\d*)`, 'i'),
      new RegExp(`total[\\s:]*([\\d,]+\\.?\\d*)\\s*\\$`, 'i')
    ],
    '$': [
      new RegExp(`\\$\\s*([\\d,]+\\.?\\d*)`, 'i')
    ]
  };
  
  // Try context-specific patterns first
  if (patterns[contextHint]) {
    for (const pattern of patterns[contextHint]) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        return `$${match[1].replace(/,/g, '')}`;
      }
    }
  }
  
  // Try nearby context
  const contextIndex = normalizedText.indexOf(contextHint);
  if (contextIndex !== -1) {
    // Look within 50 characters of the context hint
    const searchArea = normalizedText.substring(
      Math.max(0, contextIndex - 10),
      Math.min(normalizedText.length, contextIndex + 50)
    );
    
    // Generic money pattern
    const moneyPattern = /\$\s*([\d,]+\.?\d*)/;
    const match = searchArea.match(moneyPattern);
    if (match && match[1]) {
      return `$${match[1].replace(/,/g, '')}`;
    }
  }
  
  return null;
}

// Helper to extract bank names
function extractBankName(text: string): string | null {
  const normalizedText = text.toLowerCase();
  
  // List of common Canadian banks and financial institutions
  const banks = [
    'royal bank', 'rbc', 
    'td', 'toronto dominion', 'td canada trust',
    'scotiabank', 'bank of nova scotia',
    'bmo', 'bank of montreal',
    'cibc', 'canadian imperial bank',
    'national bank', 'banque nationale',
    'hsbc',
    'tangerine',
    'simplii', 'simplii financial',
    'desjardins',
    'atb financial',
    'laurentian bank', 'banque laurentienne',
    'canadian western bank',
    'ing direct', 'ing',
    'pc financial'
  ];
  
  // Check for each bank name in the text
  for (const bank of banks) {
    if (normalizedText.includes(bank)) {
      // Format bank name (capitalize first letter of each word)
      return bank.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
  
  return null;
}

// Helper to extract account numbers (showing only last 4 digits)
function extractAccountNumber(text: string): string | null {
  const normalizedText = text.toLowerCase();
  
  // Look for account number patterns
  const accountPatterns = [
    /account\s*(?:number|#|no\.?)?\s*[:\-]?\s*[*x]+(\d{4})/i,
    /account\s*(?:number|#|no\.?)?\s*[:\-]?\s*(\d{4,})/i,
    /account\s*(?:ending in|ends in)?\s*[:\-]?\s*(\d{4})/i
  ];
  
  for (const pattern of accountPatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[1]) {
      // Return only last 4 digits for privacy
      return match[1].slice(-4);
    }
  }
  
  return null;
}
