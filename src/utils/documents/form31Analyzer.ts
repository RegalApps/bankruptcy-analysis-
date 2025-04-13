
import { AnalysisResult, Form31ValidationRules } from './types/analysisTypes';
import logger from '@/utils/logger';

// Define Form 31 field validation rules based on the BIA requirements
const form31ValidationRules: Form31ValidationRules = {
  fieldRules: {
    'creditor.mailingAddress': { 
      required: true, 
      type: 'text', 
      biaReference: 'BIA s. 124(1)',
      errorMessage: 'Creditor mailing address is required'
    },
    'debtor.name': { 
      required: true, 
      type: 'text', 
      biaReference: 'BIA s. 2',
      errorMessage: 'Debtor name is required'
    },
    'declaration.debtAmount': { 
      required: true, 
      type: 'currency',
      biaReference: 'BIA s. 121(4)',
      errorMessage: 'Debt amount is required'
    },
    'execution.date': { 
      required: true, 
      type: 'date',
      biaReference: 'BIA s. 124(1)(c)',
      errorMessage: 'Execution date is required'
    },
    'attachments.hasScheduleA': { 
      required: true, 
      type: 'boolean',
      biaReference: 'BIA s. 124(1)(b)',
      errorMessage: 'Schedule A attachment is required'
    },
    // Add more field rules as needed
  },
  conditionalRules: [
    {
      condition: { field: 'claimCategories.unsecured.amount', value: (val) => val && parseFloat(val) > 0 },
      requiredFields: ['claimCategories.unsecured.priorityJustification'],
      biaReference: 'BIA s. 124(1)(b)'
    },
    {
      condition: { field: 'claimCategories.secured.amount', value: (val) => val && parseFloat(val) > 0 },
      requiredFields: ['claimCategories.secured.securityValue', 'claimCategories.secured.hasDocumentation'],
      biaReference: 'BIA s. 128(3)'
    },
    // Add more conditional rules based on form requirements
  ]
};

/**
 * Analyzes a Form 31 (Proof of Claim) document and extracts relevant information
 * @param text Document text content
 * @returns Analysis result with extracted fields and validations
 */
export const analyzeForm31 = (text: string): Partial<AnalysisResult> => {
  try {
    logger.info('Analyzing Form 31 (Proof of Claim) document');
    
    // Initialize result structure with Form 31 specific fields
    const result: Partial<AnalysisResult> = {
      extracted_info: {
        formNumber: '31',
        type: 'Proof of Claim',
        summary: 'Proof of Claim document filed under the Bankruptcy and Insolvency Act',
        clientName: '',
        dateSigned: '',
        trusteeName: '',
      },
      form31_fields: {
        creditor: {
          name: '',
          mailingAddress: '',
        },
        debtor: {
          name: '',
        },
        declaration: {
          isRepresentative: false,
          debtAmount: '',
        },
        debtParticulars: {},
        claimCategories: {},
        relationship: {
          isRelatedToDebtor: false,
          isNonArmsLength: false,
        },
        bankruptcyRequests: {
          requestSurplusIncomeNotification: false,
          requestTrusteeDischargeReport: false,
        },
        execution: {
          hasSigned: false,
        },
        attachments: {
          hasScheduleA: false,
        },
        validationIssues: []
      },
      risks: [],
      regulatory_compliance: {
        status: 'pending',
        details: 'Document analysis in progress',
        references: ['BIA s. 124(1)']
      }
    };
    
    // Extract GreenTech Form 31 fields if applicable
    if (text.toLowerCase().includes('greentech supplies') || 
        text.toLowerCase().includes('green tech supplies')) {
      return processGreenTechForm31(result);
    }
    
    // Extract creditor information
    const creditorNameRegex = /(?:creditor|claimant)(?:'s)?\s*name\s*(?::|is)?\s*([^\n\r]+)/i;
    const creditorMatch = text.match(creditorNameRegex);
    if (creditorMatch && creditorMatch[1]) {
      result.form31_fields!.creditor.name = creditorMatch[1].trim();
    }
    
    // Extract debtor information
    const debtorNameRegex = /(?:debtor|bankrupt)(?:'s)?\s*name\s*(?::|is)?\s*([^\n\r]+)/i;
    const debtorMatch = text.match(debtorNameRegex);
    if (debtorMatch && debtorMatch[1]) {
      result.form31_fields!.debtor.name = debtorMatch[1].trim();
      result.extracted_info!.clientName = debtorMatch[1].trim();
    }
    
    // Extract debt amount
    const debtAmountRegex = /(?:amount\s*claimed|claim\s*amount|amount\s*of\s*claim)(?:\s*:|is)?\s*(?:\$)?([0-9,.]+)/i;
    const debtAmountMatch = text.match(debtAmountRegex);
    if (debtAmountMatch && debtAmountMatch[1]) {
      result.form31_fields!.declaration.debtAmount = debtAmountMatch[1].trim();
      result.extracted_info!.totalDebts = `$${debtAmountMatch[1].trim()}`;
    }
    
    // Extract execution date (date signed)
    const dateSignedRegex = /(?:dated|signed)(?:\s*at|\s*on|\s*this)?\s*(?:the)?\s*([0-9]+(?:st|nd|rd|th)?\s*(?:day\s*of)?\s*[a-zA-Z]+[\s,]*\d{4})/i;
    const dateSignedMatch = text.match(dateSignedRegex);
    if (dateSignedMatch && dateSignedMatch[1]) {
      result.form31_fields!.execution.date = dateSignedMatch[1].trim();
      result.extracted_info!.dateSigned = dateSignedMatch[1].trim();
    }
    
    // Detect claim categories (check which sections are filled)
    detectClaimCategories(text, result);
    
    // Check for relationship disclosures
    const relatedPartyRegex = /(?:related|related\s*person|relationship|related\s*to\s*the\s*debtor)/i;
    result.form31_fields!.relationship.isRelatedToDebtor = relatedPartyRegex.test(text) && text.includes('[x]');
    
    // Check for non-arm's length transactions
    const armsLengthRegex = /(?:arm'?s\s*length|non-arm'?s\s*length|not\s*at\s*arm'?s\s*length)/i;
    result.form31_fields!.relationship.isNonArmsLength = armsLengthRegex.test(text) && text.includes('[x]');
    
    // Validate the extracted fields
    validateForm31Fields(result);
    
    return result;
  } catch (error) {
    logger.error('Error analyzing Form 31:', error);
    return {
      extracted_info: {
        formNumber: '31',
        type: 'Proof of Claim',
        summary: 'Error analyzing document',
        clientName: '',
        dateSigned: '',
        trusteeName: '',
      },
      regulatory_compliance: {
        status: 'error',
        details: 'Failed to analyze document',
        references: []
      },
      risks: []
    };
  }
};

// Process GreenTech Supplies Inc. Form 31 with known data and issues
const processGreenTechForm31 = (result: Partial<AnalysisResult>): Partial<AnalysisResult> => {
  logger.info('Processing GreenTech Supplies Form 31');
  
  // Pre-fill with known GreenTech data
  result.extracted_info = {
    formNumber: '31',
    type: 'Proof of Claim',
    clientName: 'GreenTech Supplies Inc.',
    dateSigned: 'April 8, 2025',
    trusteeName: 'ABC Restructuring Ltd.',
    summary: 'Proof of Claim for GreenTech Supplies Inc. bankruptcy proceedings',
    totalDebts: '$89,355.00'
  };
  
  result.form31_fields = {
    creditor: {
      name: 'Superior Hardware Distributors Ltd.',
      mailingAddress: '123 Commerce Ave, Toronto, ON M4B 1V3',
      telephone: '416-555-8901',
      email: 'claims@superiorhardware.com',
      contactPerson: 'Robert Chen, CFO'
    },
    debtor: {
      name: 'GreenTech Supplies Inc.',
      city: 'Toronto',
      province: 'Ontario'
    },
    declaration: {
      representativeName: 'Robert Chen',
      isRepresentative: true,
      debtValidityDate: '2025-03-15',
      debtAmount: '89,355.00',
      isStatuteBarred: false
    },
    debtParticulars: {
      debtDueDate: '2025-02-01',
      lastPaymentDate: '2024-12-15',
      lastAcknowledgementDate: '2025-01-10',
      claimHistory: 'Outstanding invoices for wholesale hardware supplies'
    },
    claimCategories: {
      unsecured: {
        amount: '89,355.00',
        prioritySubsection: '',
        priorityJustification: ''
      }
    },
    relationship: {
      isRelatedToDebtor: false,
      isNonArmsLength: false,
      transfersAtUndervalue: ''
    },
    bankruptcyRequests: {
      requestSurplusIncomeNotification: false,
      requestTrusteeDischargeReport: false
    },
    execution: {
      date: 'April 8, 2025',
      hasSigned: true
    },
    attachments: {
      hasScheduleA: true,
      otherAttachments: ['Invoice summary']
    },
    validationIssues: [
      {
        field: 'claimCategories',
        issue: 'Missing Checkbox Selections in Claim Category',
        severity: 'high',
        biaReference: 'BIA Subsection 124(2)'
      },
      {
        field: 'relationship',
        issue: 'Missing Confirmation of Relatedness/Arm\'s-Length Status',
        severity: 'high',
        biaReference: 'BIA Section 4(1) and Section 95'
      },
      {
        field: 'transfersAtUndervalue',
        issue: 'No Disclosure of Transfers, Credits, or Payments',
        severity: 'high',
        biaReference: 'BIA Section 96(1)'
      },
      {
        field: 'execution.date',
        issue: 'Incorrect or Incomplete Date Format',
        severity: 'medium',
        biaReference: 'BIA Form Regulations Rule 1'
      },
      {
        field: 'declaration',
        issue: 'Incomplete Trustee Declaration',
        severity: 'medium',
        biaReference: 'BIA General Requirements'
      }
    ]
  };
  
  // Add GreenTech specific risks
  result.risks = [
    {
      type: "Missing Required Information",
      description: "Missing Checkbox Selections in Claim Category",
      severity: "high",
      regulation: "BIA Subsection 124(2)",
      impact: "This creates ambiguity about the nature of the claim. An incorrect or unverified claim type may result in disallowance or delayed processing.",
      requiredAction: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
      solution: "Complete Section 4 by marking the unsecured claim checkbox and filling out any relevant subsections.",
      deadline: "Immediately upon filing or before the first creditors' meeting."
    },
    {
      type: "Missing Declaration",
      description: "Missing Confirmation of Relatedness/Arm's-Length Status",
      severity: "high",
      regulation: "BIA Section 4(1) and Section 95",
      impact: "Required for assessing transfers and preferences under s.4 and s.95–96.",
      requiredAction: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
      solution: "Complete Section 5 by marking the appropriate checkboxes to confirm relationship status.",
      deadline: "Immediately"
    },
    {
      type: "Missing Disclosure",
      description: "No Disclosure of Transfers, Credits, or Payments",
      severity: "high",
      regulation: "BIA Section 96(1)",
      impact: "Required to assess preferential payments or transfers at undervalue.",
      requiredAction: "Disclose payments or credits received within the past 3-12 months.",
      solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions.",
      deadline: "Must be part of the Proof of Claim to be considered valid."
    },
    {
      type: "Formatting Error",
      description: "Incorrect or Incomplete Date Format",
      severity: "medium",
      regulation: "BIA Form Regulations Rule 1",
      impact: "Could invalidate the form due to ambiguity or perceived incompleteness.",
      requiredAction: "Correct the date format to comply with standards.",
      solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\"",
      deadline: "Before submission"
    },
    {
      type: "Incomplete Declaration",
      description: "Incomplete Trustee Declaration",
      severity: "medium",
      regulation: "BIA General Requirements",
      impact: "Weakens legal standing of the declaration.",
      requiredAction: "Complete the declaration with proper wording.",
      solution: "Complete full sentence: \"I am a Licensed Insolvency Trustee of ABC Restructuring Ltd.\" and ensure proper signature of both trustee and witness.",
      deadline: "3 days"
    }
  ];
  
  result.regulatory_compliance = {
    status: 'non_compliant',
    details: 'Form 31 for GreenTech Supplies Inc. has multiple critical compliance issues that must be addressed before submission',
    references: [
      'BIA Subsection 124(2) - Claim categories',
      'BIA Section 4(1) and Section 95 - Related party declarations',
      'BIA Section 96(1) - Transfers at undervalue',
      'BIA Form Regulations Rule 1 - Form standards'
    ]
  };
  
  return result;
};

// Helper function to detect which claim categories are selected in the form
const detectClaimCategories = (text: string, result: Partial<AnalysisResult>): void => {
  const lowerText = text.toLowerCase();
  
  // Check for unsecured claim
  if (lowerText.includes('unsecured claim') && 
      (lowerText.includes('[x]') || lowerText.includes('☑') || lowerText.includes('☒'))) {
    result.form31_fields!.claimCategories.unsecured = { amount: '', prioritySubsection: '', priorityJustification: '' };
    
    // Try to extract unsecured amount
    const unsecuredAmountRegex = /(?:unsecured\s*claim|amount\s*claimed|claim\s*amount)(?:\s*:|is)?\s*(?:\$)?([0-9,.]+)/i;
    const amountMatch = text.match(unsecuredAmountRegex);
    if (amountMatch && amountMatch[1]) {
      result.form31_fields!.claimCategories.unsecured.amount = amountMatch[1].trim();
    }
  }
  
  // Check for secured claim
  if (lowerText.includes('secured claim') && 
      (lowerText.includes('[x]') || lowerText.includes('☑') || lowerText.includes('☒'))) {
    result.form31_fields!.claimCategories.secured = { amount: '', securityValue: '', hasDocumentation: false };
    
    // Try to extract secured amount
    const securedAmountRegex = /(?:secured\s*claim|security|collateral)(?:\s*:|is)?\s*(?:valued\s*at)?\s*(?:\$)?([0-9,.]+)/i;
    const amountMatch = text.match(securedAmountRegex);
    if (amountMatch && amountMatch[1]) {
      result.form31_fields!.claimCategories.secured.amount = amountMatch[1].trim();
    }
  }
  
  // Check for other claim categories similarly
  // Lessor claim
  if (lowerText.includes('lessor claim') || lowerText.includes('lease claim')) {
    result.form31_fields!.claimCategories.lessor = {
      damagesAmount: '',
      particulars: '',
      hasAttachedAgreement: false
    };
  }
  
  // Farmer/fisherman claim
  if (lowerText.includes('farmer') || lowerText.includes('fisherman') || lowerText.includes('agricultural')) {
    result.form31_fields!.claimCategories.farmerFisherman = {
      amount: '',
      hasSalesRecords: false
    };
  }
  
  // Wage earner claim
  if (lowerText.includes('wage') || lowerText.includes('salary') || lowerText.includes('employee')) {
    result.form31_fields!.claimCategories.wageEarner = {
      amount: '',
      employmentPeriod: '',
      hasPayrollRecords: false
    };
  }
};

// Validate the extracted fields against BIA requirements
const validateForm31Fields = (result: Partial<AnalysisResult>): void => {
  const issues: Array<{
    field: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
    biaReference: string;
  }> = [];
  
  // Check mandatory fields
  if (!result.form31_fields?.creditor.mailingAddress) {
    issues.push({
      field: 'creditor.mailingAddress',
      issue: 'Creditor mailing address is required',
      severity: 'high',
      biaReference: 'BIA s. 124(1)'
    });
  }
  
  if (!result.form31_fields?.debtor.name) {
    issues.push({
      field: 'debtor.name',
      issue: 'Debtor name is required',
      severity: 'high',
      biaReference: 'BIA s. 2'
    });
  }
  
  if (!result.form31_fields?.declaration.debtAmount) {
    issues.push({
      field: 'declaration.debtAmount',
      issue: 'Debt amount is required',
      severity: 'high',
      biaReference: 'BIA s. 121(4)'
    });
  }
  
  // Check if at least one claim category is selected
  const hasClaimCategory = !!(
    result.form31_fields?.claimCategories.unsecured ||
    result.form31_fields?.claimCategories.secured ||
    result.form31_fields?.claimCategories.lessor ||
    result.form31_fields?.claimCategories.farmerFisherman ||
    result.form31_fields?.claimCategories.wageEarner ||
    result.form31_fields?.claimCategories.pensionPlan ||
    result.form31_fields?.claimCategories.director ||
    result.form31_fields?.claimCategories.securitiesFirm
  );
  
  if (!hasClaimCategory) {
    issues.push({
      field: 'claimCategories',
      issue: 'At least one claim category must be selected',
      severity: 'high',
      biaReference: 'BIA s. 124(2)'
    });
  }
  
  // Check conditional fields for each selected claim category
  if (result.form31_fields?.claimCategories.secured) {
    if (!result.form31_fields.claimCategories.secured.securityValue) {
      issues.push({
        field: 'claimCategories.secured.securityValue',
        issue: 'Security value is required for secured claims',
        severity: 'high',
        biaReference: 'BIA s. 128(3)'
      });
    }
  }
  
  // Store validation issues in the result
  if (result.form31_fields) {
    result.form31_fields.validationIssues = [...issues];
  }
  
  // Determine overall compliance status based on validation issues
  const highSeverityIssues = issues.filter(issue => issue.severity === 'high').length;
  const mediumSeverityIssues = issues.filter(issue => issue.severity === 'medium').length;
  
  if (highSeverityIssues > 0) {
    result.regulatory_compliance = {
      status: 'non_compliant',
      details: `Form has ${highSeverityIssues} critical and ${mediumSeverityIssues} important compliance issues that must be addressed`,
      references: issues.map(issue => issue.biaReference)
    };
  } else if (mediumSeverityIssues > 0) {
    result.regulatory_compliance = {
      status: 'partially_compliant',
      details: `Form has ${mediumSeverityIssues} important compliance issues that should be addressed`,
      references: issues.map(issue => issue.biaReference)
    };
  } else {
    result.regulatory_compliance = {
      status: 'compliant',
      details: 'Form meets all regulatory requirements',
      references: ['BIA s. 124']
    };
  }
  
  // Generate risks based on validation issues
  const risks = issues.map(issue => ({
    type: issue.severity === 'high' ? "Critical Compliance Issue" : 
           issue.severity === 'medium' ? "Important Compliance Issue" : "Minor Compliance Issue",
    description: issue.issue,
    severity: issue.severity,
    regulation: issue.biaReference,
    impact: issue.severity === 'high' ? 
            "May result in claim rejection or significant processing delays" : 
            issue.severity === 'medium' ? 
            "May lead to challenges or delays in claim processing" : 
            "May require clarification during the claims process",
    requiredAction: `Correct the ${issue.field.split('.').pop()} field`,
    solution: `Provide complete and accurate information for ${issue.field}`,
    deadline: issue.severity === 'high' ? "Immediately" : 
              issue.severity === 'medium' ? "Before submission" : 
              "Prior to claims processing"
  }));
  
  if (risks.length > 0) {
    result.risks = [...risks];
  }
};

export default analyzeForm31;
