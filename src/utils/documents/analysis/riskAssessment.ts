
import { DocumentMetadata, DocumentRisk } from '../types';

export interface RiskAssessmentResult {
  overallRiskLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  complianceScore: number;
  issuesSummary: {
    critical: number;
    moderate: number;
    minor: number;
  };
  issues: DocumentRisk[];
  timelineRequirements?: Array<{
    requirementID: string;
    description: string;
    deadline: string;
    daysRemaining: number;
    status: 'PENDING' | 'COMPLETE' | 'OVERDUE';
  }>;
}

export async function assessDocumentRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata
): Promise<RiskAssessmentResult> {
  console.log(`Performing risk assessment for ${documentType}`);
  
  // Initialize risk assessment result
  const result: RiskAssessmentResult = {
    overallRiskLevel: 'GREEN',
    complianceScore: 1.0,
    issuesSummary: {
      critical: 0,
      moderate: 0,
      minor: 0
    },
    issues: []
  };
  
  // Identify document-specific risks
  if (documentType.startsWith('OSB_Form_')) {
    await assessOSBFormRisks(text, documentType, metadata, result);
  } else if (documentType.includes('Financial') || documentType === 'Bank_Statement') {
    assessFinancialDocumentRisks(text, documentType, metadata, result);
  } else if (documentType.includes('Creditor')) {
    assessCreditorDocumentRisks(text, documentType, metadata, result);
  } else if (documentType.includes('Identity')) {
    assessIdentityDocumentRisks(text, documentType, metadata, result);
  }
  
  // Check for common risks across all document types
  assessCommonDocumentRisks(text, documentType, metadata, result);
  
  // Calculate overall compliance score based on issues
  calculateComplianceScore(result);
  
  // Determine overall risk level based on issues and compliance score
  determineOverallRiskLevel(result);
  
  // Generate timeline requirements if needed
  if (needsTimelineRequirements(documentType, metadata)) {
    result.timelineRequirements = generateTimelineRequirements(documentType, metadata);
  }
  
  return result;
}

// Risk assessment for OSB forms
async function assessOSBFormRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): Promise<void> {
  const formNumber = metadata.form_number || documentType.replace('OSB_Form_', '');
  
  // Apply form-specific risk assessment
  switch (formNumber) {
    case '31':
      assessForm31Risks(text, metadata, result);
      break;
    case '47':
      assessForm47Risks(text, metadata, result);
      break;
    case '65':
      assessForm65Risks(text, metadata, result);
      break;
    case '76':
      assessForm76Risks(text, metadata, result);
      break;
    case '79':
      assessForm79Risks(text, metadata, result);
      break;
    default:
      // Generic OSB form assessment
      assessGenericOSBFormRisks(text, formNumber, metadata, result);
  }
}

// Risk assessment for Form 31 - Assignment
function assessForm31Risks(
  text: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing debtor signature
  if (!normalizedText.includes('signed by') && !normalizedText.includes('signature') && 
      !normalizedText.includes('executed')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Debtor signature missing on assignment',
      severity: 'critical',
      regulation: 'BIA Section 49(2)',
      impact: 'Assignment may be deemed invalid',
      solution: 'Obtain debtor signature on original document',
      deadline: 'BEFORE_FILING',
      status: 'open'
    });
  }
  
  // Check for missing date of assignment
  if (!normalizedText.includes('date of assignment') && !normalizedText.includes('dated')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Date of assignment is missing',
      severity: 'high',
      regulation: 'BIA Section 49(2)',
      impact: 'Filing deadline cannot be determined',
      solution: 'Add date of assignment to document',
      status: 'open'
    });
  }
  
  // Check for missing trustee information
  if (!normalizedText.includes('trustee') && !normalizedText.includes('licensed insolvency')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Trustee information is missing',
      severity: 'critical',
      regulation: 'BIA Section 49(1)',
      impact: 'Assignment must be to a licensed trustee',
      solution: 'Ensure trustee information is included with license number',
      status: 'open'
    });
  }
  
  // Check for insolvency declaration
  if (!normalizedText.includes('insolvent') && !normalizedText.includes('unable to pay')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_DECLARATION',
      description: 'Debtor insolvency declaration is missing',
      severity: 'high',
      regulation: 'BIA Section 49(1)',
      impact: 'Assignment may be challenged',
      solution: 'Ensure debtor declares insolvency in the document',
      status: 'open'
    });
  }
}

// Risk assessment for Form 47 - Consumer Proposal
function assessForm47Risks(
  text: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing debtor signature
  if (!normalizedText.includes('signed by') && !normalizedText.includes('signature') && 
      !normalizedText.includes('executed')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Debtor signature missing on proposal',
      severity: 'critical',
      regulation: 'BIA Section 66.13',
      impact: 'Proposal may be deemed invalid',
      solution: 'Obtain debtor signature on original document',
      status: 'open'
    });
  }
  
  // Check for missing administrator information
  if (!normalizedText.includes('administrator') && !normalizedText.includes('trustee')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Administrator information is missing',
      severity: 'high',
      regulation: 'BIA Section 66.13',
      impact: 'Proposal must be filed with a licensed administrator',
      solution: 'Ensure administrator information is included with license number',
      status: 'open'
    });
  }
  
  // Check for meeting of creditors information
  if (!normalizedText.includes('meeting of creditors')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_INFORMATION',
      description: 'Meeting of creditors details are missing',
      severity: 'high',
      regulation: 'BIA Section 66.15',
      impact: 'Creditors must be properly notified of meeting',
      solution: 'Include meeting of creditors information',
      status: 'open'
    });
  }
  
  // Check for payment terms
  if (!normalizedText.includes('payment') && !normalizedText.includes('amount') && 
      !normalizedText.includes('$')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_INFORMATION',
      description: 'Proposal payment terms are missing',
      severity: 'critical',
      regulation: 'BIA Section 66.12',
      impact: 'Proposal must specify payment terms to creditors',
      solution: 'Include detailed payment terms in the proposal',
      status: 'open'
    });
  }
}

// Risk assessment for Form 65 - Monthly Income and Expense Statement
function assessForm65Risks(
  text: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing income information
  if (!normalizedText.includes('income') || !normalizedText.includes('$')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_INFORMATION',
      description: 'Income details are missing or incomplete',
      severity: 'high',
      impact: 'Cannot assess surplus income or ability to pay',
      solution: 'Provide complete income information',
      status: 'open'
    });
  }
  
  // Check for missing expense information
  if (!normalizedText.includes('expense') || !normalizedText.includes('expenditure')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_INFORMATION',
      description: 'Expense details are missing or incomplete',
      severity: 'high',
      impact: 'Cannot assess reasonable living expenses',
      solution: 'Provide complete expense information',
      status: 'open'
    });
  }
  
  // Check for calculations
  if (normalizedText.includes('total') && normalizedText.includes('income') && 
      normalizedText.includes('expense')) {
    // Simple check for mathematical errors - could be enhanced with actual calculation
    if (!normalizedText.includes('surplus') && !normalizedText.includes('deficit')) {
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'CALCULATION_ERROR',
        description: 'Missing surplus/deficit calculation',
        severity: 'medium',
        impact: 'Cannot determine available funds for creditors',
        solution: 'Complete the surplus/deficit calculation',
        status: 'open'
      });
    }
  }
}

// Risk assessment for Form 76 - Statement of Affairs for Individuals
function assessForm76Risks(
  text: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing assets section
  if (!normalizedText.includes('asset') || !normalizedText.includes('property')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_SECTION',
      description: 'Assets section is missing or incomplete',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Cannot assess available assets for distribution',
      solution: 'Complete the assets section of the form',
      status: 'open'
    });
  }
  
  // Check for missing liabilities section
  if (!normalizedText.includes('liabilit') || !normalizedText.includes('debt')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_SECTION',
      description: 'Liabilities section is missing or incomplete',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Cannot assess total debt obligations',
      solution: 'Complete the liabilities section of the form',
      status: 'open'
    });
  }
  
  // Check for missing debtor signature
  if (!normalizedText.includes('signed by') && !normalizedText.includes('signature') && 
      !normalizedText.includes('executed')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Debtor signature is missing',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Statement of Affairs must be signed by the debtor',
      solution: 'Obtain debtor signature on the document',
      status: 'open'
    });
  }
  
  // Check for sworn statement
  if (!normalizedText.includes('sworn') && !normalizedText.includes('affirm') && 
      !normalizedText.includes('oath')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_DECLARATION',
      description: 'Sworn statement or affirmation is missing',
      severity: 'high',
      regulation: 'BIA Section 158(d)',
      impact: 'Statement of Affairs must be sworn or affirmed',
      solution: 'Ensure statement includes sworn declaration',
      status: 'open'
    });
  }
}

// Risk assessment for Form 79 - Statement of Affairs for Companies
function assessForm79Risks(
  text: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing assets section
  if (!normalizedText.includes('asset') || !normalizedText.includes('property')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_SECTION',
      description: 'Assets section is missing or incomplete',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Cannot assess available assets for distribution',
      solution: 'Complete the assets section of the form',
      status: 'open'
    });
  }
  
  // Check for missing liabilities section
  if (!normalizedText.includes('liabilit') || !normalizedText.includes('debt')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_SECTION',
      description: 'Liabilities section is missing or incomplete',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Cannot assess total debt obligations',
      solution: 'Complete the liabilities section of the form',
      status: 'open'
    });
  }
  
  // Check for officer signature
  if (!normalizedText.includes('signed by') && !normalizedText.includes('signature') && 
      !normalizedText.includes('executed')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_FIELD',
      description: 'Corporate officer signature is missing',
      severity: 'critical',
      regulation: 'BIA Section 158(d)',
      impact: 'Statement of Affairs must be signed by an officer of the company',
      solution: 'Obtain corporate officer signature on the document',
      status: 'open'
    });
  }
  
  // Check for corporate resolution
  if (!normalizedText.includes('resolution') && !normalizedText.includes('board')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_REQUIRED_DOCUMENT',
      description: 'Corporate resolution is missing or not referenced',
      severity: 'high',
      impact: 'Filing must be authorized by corporate resolution',
      solution: 'Attach corporate resolution authorizing filing',
      status: 'open'
    });
  }
}

// Generic risk assessment for other OSB forms
function assessGenericOSBFormRisks(
  text: string, 
  formNumber: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for basic requirements common to most forms
  
  // Check for signatures
  if (!normalizedText.includes('signed') && !normalizedText.includes('signature')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'POSSIBLE_MISSING_SIGNATURE',
      description: `No signature detected on Form ${formNumber}`,
      severity: 'high',
      impact: 'Document may not be properly executed',
      solution: 'Review form for signature requirements',
      status: 'open'
    });
  }
  
  // Check for dates
  if (!normalizedText.includes('dated') && !normalizedText.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}/)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_DATE',
      description: `No date detected on Form ${formNumber}`,
      severity: 'medium',
      impact: 'Timing requirements cannot be verified',
      solution: 'Add appropriate date to the form',
      status: 'open'
    });
  }
  
  // Check for placeholders or incomplete sections
  if (normalizedText.includes('_____') || normalizedText.includes('[') || 
      normalizedText.includes('xxx') || normalizedText.includes('tbd')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'INCOMPLETE_FORM',
      description: `Form ${formNumber} contains placeholders or incomplete sections`,
      severity: 'medium',
      impact: 'Form is not fully completed',
      solution: 'Complete all sections of the form',
      status: 'open'
    });
  }
}

// Risk assessment for financial documents
function assessFinancialDocumentRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for missing account information
  if (documentType === 'Bank_Statement' && !normalizedText.match(/account.*\d{4}/i)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'INCOMPLETE_INFORMATION',
      description: 'Account number is missing or incomplete',
      severity: 'medium',
      impact: 'Cannot verify account ownership',
      solution: 'Ensure account number is visible (at least last 4 digits)',
      status: 'open'
    });
  }
  
  // Check for date range
  if (!normalizedText.match(/period|from.*to|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_DATE_RANGE',
      description: 'Statement period or date range is unclear',
      severity: 'medium',
      impact: 'Cannot determine statement period',
      solution: 'Verify statement shows clear date range',
      status: 'open'
    });
  }
  
  // Check for large transactions that might need investigation
  if (normalizedText.match(/\$\s*\d{1,3},\d{3}|\$\d{4,}/)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'LARGE_TRANSACTION_DETECTED',
      description: 'Large transaction(s) detected in financial document',
      severity: 'medium',
      impact: 'Large transactions require verification of source/purpose',
      solution: 'Review large transactions and document explanation',
      status: 'open'
    });
  }
  
  // Check for complete transaction history
  if (documentType === 'Bank_Statement' && 
      !(normalizedText.includes('opening balance') && normalizedText.includes('closing balance'))) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'INCOMPLETE_STATEMENT',
      description: 'Statement may be incomplete (missing opening or closing balance)',
      severity: 'medium',
      impact: 'Cannot verify complete financial activity',
      solution: 'Obtain complete statement with opening and closing balances',
      status: 'open'
    });
  }
}

// Risk assessment for creditor documents
function assessCreditorDocumentRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  if (documentType === 'Proof_Of_Claim') {
    // Check for missing signature
    if (!normalizedText.includes('signed') && !normalizedText.includes('signature')) {
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'MISSING_SIGNATURE',
        description: 'Creditor signature is missing on Proof of Claim',
        severity: 'high',
        regulation: 'BIA Section 124',
        impact: 'Claim may be invalid without proper signature',
        solution: 'Obtain creditor signature on the claim form',
        status: 'open'
      });
    }
    
    // Check for claim amount
    if (!normalizedText.match(/amount|claim.*\$\s*[\d,.]+/i)) {
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'MISSING_CLAIM_AMOUNT',
        description: 'Claim amount is missing or unclear',
        severity: 'high',
        impact: 'Cannot determine amount of claim',
        solution: 'Ensure claim amount is clearly stated',
        status: 'open'
      });
    }
    
    // Check for supporting documentation
    if (!normalizedText.includes('attach') && !normalizedText.includes('support') && 
        !normalizedText.includes('document')) {
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'MISSING_SUPPORTING_DOCUMENTS',
        description: 'No reference to supporting documentation',
        severity: 'medium',
        impact: 'Claim should be supported by documentation',
        solution: 'Request supporting documentation for the claim',
        status: 'open'
      });
    }
  }
}

// Risk assessment for identity documents
function assessIdentityDocumentRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for expiration dates
  const expiryMatch = normalizedText.match(/(?:expir|expiry|valid until)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i);
  
  if (expiryMatch) {
    const expiryDate = new Date(expiryMatch[1].replace(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/, '$3-$2-$1'));
    const now = new Date();
    
    if (expiryDate < now) {
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'EXPIRED_DOCUMENT',
        description: `${documentType} appears to be expired`,
        severity: 'high',
        impact: 'Expired identification document is not valid',
        solution: 'Obtain current valid identification document',
        status: 'open'
      });
    } else if ((expiryDate.getTime() - now.getTime()) < 90 * 24 * 60 * 60 * 1000) { // 90 days
      addRiskIssue(result, {
        id: crypto.randomUUID(),
        type: 'NEARLY_EXPIRED_DOCUMENT',
        description: `${documentType} will expire within 90 days`,
        severity: 'medium',
        impact: 'Identification document will expire soon',
        solution: 'Notify client to renew identification document',
        status: 'open'
      });
    }
  } else if (documentType !== 'SIN_Card') { // SIN cards don't typically have expiration dates
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'MISSING_EXPIRY_DATE',
      description: 'Expiration date not detected on identity document',
      severity: 'medium',
      impact: 'Cannot verify if document is current',
      solution: 'Verify document expiration date',
      status: 'open'
    });
  }
  
  // Check for personal information
  if (!normalizedText.match(/name|born|birth|address/i)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'INCOMPLETE_IDENTITY_DOCUMENT',
      description: 'Personal information may be missing or unclear',
      severity: 'medium',
      impact: 'Cannot verify identity details',
      solution: 'Ensure document shows clear personal information',
      status: 'open'
    });
  }
  
  // Check for image quality
  if (documentType !== 'SIN_Card' && !normalizedText.includes('photo') && !normalizedText.includes('picture')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'POSSIBLE_MISSING_PHOTO',
      description: 'Photo identification may be missing or unclear',
      severity: 'medium',
      impact: 'Cannot verify identity through photo',
      solution: 'Ensure photo is clearly visible on ID document',
      status: 'open'
    });
  }
}

// Common risks that apply to all document types
function assessCommonDocumentRisks(
  text: string, 
  documentType: string, 
  metadata: DocumentMetadata, 
  result: RiskAssessmentResult
): void {
  const normalizedText = text.toLowerCase();
  
  // Check for personally identifiable information (PII) that should be protected
  const sinPattern = /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/;
  if (sinPattern.test(normalizedText)) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'PRIVACY_RISK',
      description: 'Social Insurance Number (SIN) detected in unsecured document',
      severity: 'high',
      regulation: 'Personal Information Protection and Electronic Documents Act (PIPEDA)',
      impact: 'Privacy breach risk for sensitive personal identifier',
      solution: 'Redact SIN from copies and secure original document',
      status: 'open'
    });
  }
  
  // Check for document completeness
  if (normalizedText.includes('_____') || normalizedText.includes('xxxx') ||
      normalizedText.includes('[insert') || normalizedText.includes('tbd')) {
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'INCOMPLETE_DOCUMENT',
      description: 'Document contains placeholders or incomplete sections',
      severity: 'medium',
      impact: 'Document is not fully completed',
      solution: 'Complete all fields and remove all placeholders',
      status: 'open'
    });
  }
  
  // Check for document quality
  if (text.length < 100) { // Very short text suggests poor OCR or image quality
    addRiskIssue(result, {
      id: crypto.randomUUID(),
      type: 'LOW_QUALITY_DOCUMENT',
      description: 'Document may have poor image quality or content extraction issues',
      severity: 'medium',
      impact: 'Cannot properly analyze document content',
      solution: 'Obtain better quality scan or original document',
      status: 'open'
    });
  }
  
  // Add standard document retention notice
  addRiskIssue(result, {
    id: crypto.randomUUID(),
    type: 'DOCUMENT_RETENTION_REQUIREMENT',
    description: 'This document must be retained according to regulatory requirements',
    severity: 'low',
    regulation: 'Office of the Superintendent of Bankruptcy Canada (OSB) Directive 11R2',
    impact: 'Non-compliance with record-keeping requirements could lead to penalties',
    solution: 'Store physical and electronic copies securely for the required retention period',
    status: 'open'
  });
}

// Helper function to add risk issues to the result
function addRiskIssue(result: RiskAssessmentResult, issue: DocumentRisk): void {
  result.issues.push(issue);
  
  // Update summary counters
  if (issue.severity === 'critical') {
    result.issuesSummary.critical++;
  } else if (issue.severity === 'high') {
    result.issuesSummary.moderate++;
  } else {
    result.issuesSummary.minor++;
  }
}

// Calculate compliance score based on issues
function calculateComplianceScore(result: RiskAssessmentResult): void {
  if (result.issues.length === 0) {
    result.complianceScore = 1.0;
    return;
  }
  
  // Calculate weighted score based on issue severity
  const criticalIssues = result.issuesSummary.critical;
  const moderateIssues = result.issuesSummary.moderate;
  const minorIssues = result.issuesSummary.minor;
  
  // Each critical issue reduces score by 20%, moderate by 10%, minor by 5%
  const deduction = 
    (criticalIssues * 0.2) +
    (moderateIssues * 0.1) +
    (minorIssues * 0.05);
  
  // Ensure score is between 0 and 1
  result.complianceScore = Math.max(0, Math.min(1, 1 - deduction));
}

// Determine overall risk level based on issues
function determineOverallRiskLevel(result: RiskAssessmentResult): void {
  if (result.issuesSummary.critical > 0) {
    result.overallRiskLevel = 'RED';
  } else if (result.issuesSummary.moderate > 0) {
    result.overallRiskLevel = 'ORANGE';
  } else if (result.issuesSummary.minor > 0) {
    result.overallRiskLevel = 'YELLOW';
  } else {
    result.overallRiskLevel = 'GREEN';
  }
  
  // Additional compliance score check
  if (result.complianceScore < 0.5 && result.overallRiskLevel !== 'RED') {
    result.overallRiskLevel = 'RED';
  }
}

// Check if timeline requirements should be generated
function needsTimelineRequirements(documentType: string, metadata: DocumentMetadata): boolean {
  // OSB forms typically have timeline requirements
  return documentType.startsWith('OSB_Form_');
}

// Generate timeline requirements based on document type
function generateTimelineRequirements(documentType: string, metadata: DocumentMetadata): any[] {
  const requirements = [];
  const now = new Date();
  
  if (documentType === 'OSB_Form_31') {
    // For Form 31 (Assignment), add filing deadline
    const filingDate = new Date();
    filingDate.setDate(now.getDate() + 5); // 5 days to file with OSB
    
    requirements.push({
      requirementID: `TR-${crypto.randomUUID().substring(0, 8)}`,
      description: 'File assignment with OSB',
      deadline: filingDate.toISOString().split('T')[0],
      daysRemaining: Math.ceil((filingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      status: 'PENDING'
    });
    
    const noticeDate = new Date();
    noticeDate.setDate(now.getDate() + 10); // 10 days to send notice to creditors
    
    requirements.push({
      requirementID: `TR-${crypto.randomUUID().substring(0, 8)}`,
      description: 'Send notice to creditors',
      deadline: noticeDate.toISOString().split('T')[0],
      daysRemaining: Math.ceil((noticeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      status: 'PENDING'
    });
  } else if (documentType === 'OSB_Form_47') {
    // For Form 47 (Consumer Proposal), add filing deadline and meeting timing
    const filingDate = new Date();
    filingDate.setDate(now.getDate() + 5); // 5 days to file with OSB
    
    requirements.push({
      requirementID: `TR-${crypto.randomUUID().substring(0, 8)}`,
      description: 'File proposal with OSB',
      deadline: filingDate.toISOString().split('T')[0],
      daysRemaining: Math.ceil((filingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      status: 'PENDING'
    });
    
    const meetingDate = new Date();
    meetingDate.setDate(now.getDate() + 45); // Approx 45 days for meeting of creditors
    
    requirements.push({
      requirementID: `TR-${crypto.randomUUID().substring(0, 8)}`,
      description: 'Hold meeting of creditors',
      deadline: meetingDate.toISOString().split('T')[0],
      daysRemaining: Math.ceil((meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      status: 'PENDING'
    });
  }
  
  return requirements;
}
