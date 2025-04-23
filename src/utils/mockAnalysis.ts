/**
 * Mock Analysis System
 * 
 * Provides predefined analysis results for specific PDF files based on their titles.
 * This allows for consistent demonstration of analysis capabilities without requiring
 * actual API calls to the analyzer.
 */

import logger from './logger';

// Collection of predefined mock analyses
const mockAnalysisDatabase: Record<string, any> = {
  // Sample analyses will be added here
};

/**
 * Registers a mock analysis result for a specific PDF title
 * 
 * @param pdfTitle The title of the PDF file
 * @param analysisData The mock analysis data to return
 */
export function registerMockAnalysis(pdfTitle: string, analysisData: any): void {
  // Convert to lowercase and normalize for consistent matching
  const normalizedTitle = pdfTitle.toLowerCase().trim();
  mockAnalysisDatabase[normalizedTitle] = analysisData;
  logger.info(`Registered mock analysis for PDF: "${pdfTitle}"`);
}

/**
 * Gets mock analysis result for a PDF if it exists in the database
 * 
 * @param pdfTitle The title of the PDF file
 * @returns Mock analysis data if available, null otherwise
 */
export function getMockAnalysisForPdf(pdfTitle: string): any | null {
  // Convert to lowercase and normalize for consistent matching
  const normalizedTitle = pdfTitle.toLowerCase().trim();
  
  // Check if we have a direct match
  if (mockAnalysisDatabase[normalizedTitle]) {
    logger.info(`Using exact mock analysis for PDF: "${pdfTitle}"`);
    return mockAnalysisDatabase[normalizedTitle];
  }
  
  // Check if the title contains any of our registered keywords
  for (const key in mockAnalysisDatabase) {
    if (normalizedTitle.includes(key)) {
      logger.info(`Using partial match mock analysis for PDF: "${pdfTitle}" (matched "${key}")`);
      return mockAnalysisDatabase[key];
    }
  }
  
  // Check for specific form types based on filename patterns
  if (normalizedTitle.includes('bankruptcy') || normalizedTitle.includes('bk')) {
    logger.info(`Using bankruptcy form analysis for PDF: "${pdfTitle}"`);
    return mockAnalysisDatabase['bankruptcy'];
  }
  
  if (normalizedTitle.includes('consumer')) {
    logger.info(`Using consumer proposal analysis for PDF: "${pdfTitle}"`);
    return mockAnalysisDatabase['form 47'];
  }
  
  if (normalizedTitle.includes('proof') || normalizedTitle.includes('claim')) {
    logger.info(`Using proof of claim analysis for PDF: "${pdfTitle}"`);
    return mockAnalysisDatabase['form 31'];
  }
  
  // Fallback to a generic analysis
  logger.info(`No specific mock analysis found for PDF: "${pdfTitle}", using generic analysis`);
  return {
    extracted_info: {
      clientName: 'Unknown Client',
      formNumber: 'Unknown',
      formType: 'bankruptcy document',
      documentStatus: 'pending',
      summary: `Analysis of document: "${pdfTitle}". This document requires further review.`
    },
    risks: [
      {
        type: 'Unknown Document Type',
        description: 'Document type could not be automatically identified',
        severity: 'medium',
        regulation: 'Bankruptcy and Insolvency Act',
        impact: 'May delay processing',
        requiredAction: 'Manual review required',
        solution: 'Submit with proper form identification',
        deadline: '14 days'
      }
    ]
  };
}

// Register default mock analyses for common document types
registerMockAnalysis('form 31', {
  extracted_info: {
    clientName: 'ABC Corporation',
    formNumber: '31',
    formType: 'proof of claim',
    documentStatus: 'incomplete',
    summary: 'Form 31 - Proof of Claim with missing required fields and potential validation issues.'
  },
  risks: [
    {
      type: 'Missing Information',
      description: 'Required creditor contact information is incomplete.',
      severity: 'high',
      regulation: 'Bankruptcy and Insolvency Act, Section 124',
      impact: 'Claim may be rejected by the trustee',
      requiredAction: 'Complete all creditor details in Section 1',
      solution: 'Provide full address and contact information',
      deadline: '7 days'
    },
    {
      type: 'Validation Issue',
      description: 'Supporting documentation not attached',
      severity: 'medium',
      regulation: 'Bankruptcy and Insolvency Act, Section 126',
      impact: 'Claim may require verification and delay processing',
      requiredAction: 'Attach all relevant documentation',
      solution: 'Include invoices, contracts, and correspondence',
      deadline: '14 days'
    },
    {
      type: 'Inconsistency',
      description: 'Claim amount in words does not match amount in figures',
      severity: 'medium',
      regulation: 'Bankruptcy and Insolvency General Rules, Section 65',
      impact: 'Claim amount may be disputed or rejected',
      requiredAction: 'Correct claim amount discrepancy',
      solution: 'Ensure consistent claim amount in all sections',
      deadline: '5 days'
    }
  ]
});

registerMockAnalysis('form 47', {
  extracted_info: {
    clientName: 'John Doe',
    formNumber: '47',
    formType: 'consumer proposal',
    documentStatus: 'pending',
    summary: 'Form 47 - Consumer Proposal appears complete but has potential deadline issues.'
  },
  risks: [
    {
      type: 'Deadline Approaching',
      description: 'Filing deadline is approaching within 10 days',
      severity: 'high',
      regulation: 'Bankruptcy and Insolvency Act, Section 66.13',
      impact: 'Proposal may be deemed rejected if not filed in time',
      requiredAction: 'File with Official Receiver immediately',
      solution: 'Submit all documentation to the licensed insolvency trustee',
      deadline: '10 days'
    },
    {
      type: 'Documentation',
      description: 'Income verification documents may be insufficient',
      severity: 'medium',
      regulation: 'Bankruptcy and Insolvency Act, Section 66.12',
      impact: 'Proposal assessment may be delayed',
      requiredAction: 'Provide additional income documentation',
      solution: 'Include recent pay stubs, tax returns from the past 2 years',
      deadline: '14 days'
    }
  ]
});

// Register analysis for bankruptcy forms
registerMockAnalysis('bankruptcy', {
  extracted_info: {
    clientName: 'Robert Johnson',
    formNumber: '1',
    formType: 'voluntary petition',
    documentStatus: 'incomplete',
    summary: 'Bankruptcy petition with several missing assets and potential undisclosed transfers.'
  },
  risks: [
    {
      type: 'Incomplete Schedules',
      description: 'Schedule A/B appears to be missing some assets based on income level',
      severity: 'high',
      regulation: 'Bankruptcy Code §521, §727(a)(4)',
      impact: 'Potential denial of discharge if assets are deliberately omitted',
      requiredAction: 'Complete asset disclosure',
      solution: 'Review and amend Schedule A/B to include all assets',
      deadline: '14 days'
    },
    {
      type: 'Means Test Issues',
      description: 'Income calculation on Form 122A-1 may be incorrect',
      severity: 'high',
      regulation: 'Bankruptcy Code §707(b)',
      impact: 'Case may be dismissed or converted to Chapter 13',
      requiredAction: 'Recalculate current monthly income',
      solution: 'Include all income sources for the 6-month period',
      deadline: '7 days'
    },
    {
      type: 'Potential Preference Payments',
      description: 'Payments to creditors within 90 days of filing',
      severity: 'medium',
      regulation: 'Bankruptcy Code §547',
      impact: 'Trustee may seek to recover preferential payments',
      requiredAction: 'Disclose all payments',
      solution: 'Complete SOFA questions 3 and 4 thoroughly',
      deadline: 'Immediate'
    }
  ]
});

// Register specialized analysis for credit report PDF
registerMockAnalysis('credit report', {
  extracted_info: {
    clientName: 'Sarah Williams',
    formNumber: 'N/A',
    formType: 'credit report',
    documentStatus: 'complete',
    summary: 'Credit report analysis shows multiple reporting errors and potential identity theft indicators.'
  },
  risks: [
    {
      type: 'Credit Reporting Error',
      description: 'Several accounts show incorrect payment status',
      severity: 'high',
      regulation: 'Fair Credit Reporting Act, 15 U.S.C. §1681',
      impact: 'Negative impact on credit score and lending decisions',
      requiredAction: 'File dispute with credit bureaus',
      solution: 'Submit documentation proving correct payment status',
      deadline: '30 days'
    },
    {
      type: 'Identity Theft Risk',
      description: 'Unrecognized hard inquiries and new accounts',
      severity: 'high',
      regulation: 'FTC Identity Theft Rules, 16 C.F.R. §681.2',
      impact: 'Potential unauthorized use of identity',
      requiredAction: 'Place fraud alert and security freeze',
      solution: 'Contact credit bureaus and file FTC identity theft report',
      deadline: 'Immediate'
    },
    {
      type: 'Debt-to-Income Ratio',
      description: 'Current ratio exceeds 45%, which will impact bankruptcy filing',
      severity: 'medium',
      regulation: 'Bankruptcy Means Test Guidelines',
      impact: 'May affect Chapter 7 eligibility',
      requiredAction: 'Review expense allocations',
      solution: 'Prepare detailed expense justification for Schedule J',
      deadline: 'Prior to filing'
    }
  ]
});

// Register specialized analysis for tax returns
registerMockAnalysis('tax return', {
  extracted_info: {
    clientName: 'Michael Chen',
    formNumber: '1040',
    formType: 'personal tax return',
    documentStatus: 'incomplete',
    summary: 'Tax return analysis shows potential audit flags and missing documentation for claimed deductions.'
  },
  risks: [
    {
      type: 'Audit Risk',
      description: 'Home office deduction appears excessive for stated business use',
      severity: 'high',
      regulation: 'Internal Revenue Code §280A',
      impact: 'Increased likelihood of IRS audit',
      requiredAction: 'Recalculate home office percentage',
      solution: 'Ensure square footage calculation is accurate and documented',
      deadline: 'Before filing'
    },
    {
      type: 'Missing Documentation',
      description: 'Charitable contributions exceed $250 without required acknowledgments',
      severity: 'medium',
      regulation: 'Internal Revenue Code §170(f)(8)',
      impact: 'Deductions may be disallowed upon examination',
      requiredAction: 'Obtain written acknowledgments',
      solution: 'Request documentation from charitable organizations',
      deadline: '30 days'
    },
    {
      type: 'Inconsistency',
      description: 'Self-employment income doesn\'t match 1099 forms provided',
      severity: 'high',
      regulation: 'Internal Revenue Code §6662',
      impact: 'Potential accuracy-related penalties',
      requiredAction: 'Reconcile income discrepancies',
      solution: 'Review all 1099s and income sources',
      deadline: 'Immediate'
    }
  ]
});

export default {
  registerMockAnalysis,
  getMockAnalysisForPdf
};
