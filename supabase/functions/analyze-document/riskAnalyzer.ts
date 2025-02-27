
import { Risk } from "./types.ts";

export async function analyzeRisks(text: string, documentType: string): Promise<Risk[]> {
  const risks: Risk[] = [];
  const lowerText = text.toLowerCase();

  // Check for missing required fields
  if (!lowerText.includes('estate no') && !lowerText.includes('estate number')) {
    risks.push({
      type: 'Missing Required Field',
      severity: 'high',
      description: 'Estate number is missing from the document',
      impact: 'Cannot properly identify and track the bankruptcy estate',
      requiredAction: 'Add the estate number to the document',
      solution: 'Contact the trustee to obtain the correct estate number and update the document',
      regulation: 'OSB Rule 37 - Estate Identification Requirements',
      reference: 'https://www.ic.gc.ca/eic/site/bsf-osb.nsf/eng/br03247.html'
    });
  }

  // Check date format consistency
  const datePattern = /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}/g;
  const dates = text.match(datePattern);
  if (!dates) {
    risks.push({
      type: 'Date Format',
      severity: 'medium',
      description: 'Required dates are missing or in incorrect format',
      impact: 'May cause processing delays and compliance issues',
      requiredAction: 'Update all dates to use the standard format (DD/MM/YYYY)',
      solution: 'Review and update all date fields to ensure proper formatting',
      regulation: 'OSB Directive 11R2 - Documentation Standards',
      reference: 'https://www.ic.gc.ca/eic/site/bsf-osb.nsf/eng/br03241.html'
    });
  }

  // Check for trustee information
  if (!lowerText.includes('trustee') || !lowerText.includes('licensed')) {
    risks.push({
      type: 'Incomplete Professional Information',
      severity: 'high',
      description: 'Licensed Insolvency Trustee information is incomplete or missing',
      impact: 'Document may not be legally valid without proper trustee credentials',
      requiredAction: 'Include complete trustee information including license number',
      solution: 'Add full trustee details including name, license number, and firm',
      regulation: 'BIA Section 13.2 - Licensed Trustees',
      reference: 'https://laws-lois.justice.gc.ca/eng/acts/b-3/page-5.html#h-24'
    });
  }

  // Check for creditor meeting details
  if (documentType === 'bankruptcy' && !lowerText.includes('meeting of creditors')) {
    risks.push({
      type: 'Missing Creditor Information',
      severity: 'high',
      description: 'Meeting of creditors details are missing',
      impact: 'Creditors may not be properly notified of proceedings',
      requiredAction: 'Include complete meeting of creditors information',
      solution: 'Add meeting date, time, location, and participation instructions',
      regulation: 'BIA Section 102 - First Meeting of Creditors',
      reference: 'https://laws-lois.justice.gc.ca/eng/acts/b-3/page-24.html#h-25'
    });
  }

  // Check for signature fields
  if (!lowerText.includes('signature') && !lowerText.includes('signed')) {
    risks.push({
      type: 'Missing Signatures',
      severity: 'high',
      description: 'Required signatures are missing from the document',
      impact: 'Document may not be legally binding without proper signatures',
      requiredAction: 'Obtain all required signatures',
      solution: 'Identify missing signatures and arrange for proper execution of the document',
      regulation: 'OSB Directive 31 - Document Execution Requirements',
      reference: 'https://www.ic.gc.ca/eic/site/bsf-osb.nsf/eng/br03248.html'
    });
  }

  // Form specific checks
  if (text.includes('Form 76')) {
    if (!lowerText.includes('statement of receipts')) {
      risks.push({
        type: 'Incomplete Financial Information',
        severity: 'medium',
        description: 'Statement of Receipts and Disbursements is incomplete',
        impact: 'Cannot properly assess financial transactions',
        requiredAction: 'Complete all sections of the financial statement',
        solution: 'Provide detailed breakdown of all receipts and disbursements',
        regulation: 'Directive No. 5R6 - Estate Records',
        reference: 'https://www.ic.gc.ca/eic/site/bsf-osb.nsf/eng/br03246.html'
      });
    }
  }

  return risks;
}
