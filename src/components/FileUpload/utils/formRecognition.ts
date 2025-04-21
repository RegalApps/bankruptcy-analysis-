
import { FINANCIAL_TERMS } from './constants';

interface FormField {
  label: string;
  value: string;
  confidence: number;
}

export interface FormFields {
  formNumber?: string;
  formType?: string;
  clientName?: string;
  trusteeName?: string;
  claimantName?: string;
  dateSigned?: string;
  proposalType?: string;
  courtFileNumber?: string;
  estateNumber?: string;
  claimAmount?: string;
  claimType?: string;
  securityDescription?: string;
  [key: string]: string | undefined;
}

export const identifyFormType = (text: string): string => {
  // Enhanced patterns for better form detection
  const formPatterns = {
    'bankruptcy': /bankruptcy|form\s*66|assignment|statement of affairs|form\s*76/i,
    'proposal': /proposal|form\s*47|consumer proposal|division [i1]|paragraph 66\.13/i,
    'meeting': /meeting of creditors|form\s*29/i,
    'court': /court order|form\s*35/i,
    'proof-of-claim': /proof\s+of\s+claim|form\s*31\b|creditor.{0,20}claim|claim.{0,20}creditor/i
  };

  for (const [type, pattern] of Object.entries(formPatterns)) {
    if (pattern.test(text)) {
      return type;
    }
  }

  return 'unknown';
};

export const extractFormFields = (text: string): FormFields => {
  const fields: FormFields = {};
  
  // Enhanced form type, number, and section detection for various forms
  const patterns = {
    formNumber: /form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i,
    clientName: /(?:debtor|client|consumer)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    trusteeName: /(?:trustee|lit|administrator)[\s:]*([\w\s.-]+)/i,
    claimantName: /(?:claimant|creditor)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    dateSigned: /(?:date|signed|dated)(?:[\s:]*)([\d\/.\-]+|january|february|march|april|may|june|july|august|september|october|november|december\s+\d{1,2},?\s+\d{4})/i,
    proposalType: /(consumer proposal|division[i1] proposal)/i,
    courtFileNumber: /court\s+file\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i,
    estateNumber: /(?:estate|bankruptcy)\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i,
    claimAmount: /(?:claim|amount|sum of)[\s:]*\$?\s*([\d,.]+)/i,
    claimType: /claim(?:s|ed)?\s+as\s+(?:an?\s+)?(unsecured|secured|preferred|priority|wage earner|farmer|fisherman|director)/i,
    securityDescription: /security\s+(?:held|described|valued)[\s:]*([^.]+)/i,
    
    // Form 47 specific fields - adding specialized extractions
    surplus_income: /surplus\s+income[\s:]*\$?\s*([\d,.]+)/i,
    OSB_threshold: /(?:OSB|threshold)[\s:]*\$?\s*([\d,.]+)/i,
    monthly_payment: /(?:monthly payment|contribution)[\s:]*\$?\s*([\d,.]+)/i,
    marital_status: /marital\s+status[\s:]*(single|married|divorced|separated|common-law|widowed)/i,
    occupation: /occupation[\s:]*([\w\s.-]+)/i,
    employer: /employer(?:\'s)?[\s:]*name[\s:]*([\w\s.-]+)/i,
    total_assets: /total\s+assets[\s:]*\$?\s*([\d,.]+)/i,
    total_liabilities: /total\s+liabilities[\s:]*\$?\s*([\d,.]+)/i,
    monthly_income: /(?:monthly|net)\s+income[\s:]*\$?\s*([\d,.]+)/i,
    monthly_expenses: /(?:monthly|total)\s+expenses[\s:]*\$?\s*([\d,.]+)/i,
    filing_date: /(?:filing|proposal)\s+date[\s:]*([\d\/.-]+)/i,
    family_size: /(?:family|household)\s+size[\s:]*(\d+)/i,
  };

  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields[field] = match[1].trim();
    }
  }

  // Enhanced Form 31 (Proof of Claim) detection
  if (/form[\s-]*31\b/i.test(text) || /\bproof of claim\b/i.test(text)) {
    fields.formNumber = "31";
    fields.formType = "proof-of-claim";
    
    // Extract claim section checkboxes - look for section markers
    if (/section [a-g]/i.test(text) || /\b[☑✓✗]\s*[a-g]\b/i.test(text)) {
      // Extract which checkbox was selected
      const checkboxPattern = /\b[☑✓✗]?\s*([a-g])(?:\s*\.|\s+[a-z]+)/i;
      const checkboxMatch = text.match(checkboxPattern);
      if (checkboxMatch && checkboxMatch[1]) {
        fields.claimCheckbox = checkboxMatch[1].toUpperCase();
        
        // Determine claim type based on checkbox
        const checkboxMap: Record<string, string> = {
          'A': 'unsecured',
          'B': 'lease',
          'C': 'secured',
          'D': 'farmer-fisherman',
          'E': 'wage-earner',
          'F': 'director',
          'G': 'securities-customer'
        };
        
        fields.claimType = checkboxMap[fields.claimCheckbox] || fields.claimType;
      }
    }
  } else if (/form[\s-]*47\b/i.test(text) || /\bconsumer proposal\b/i.test(text) || 
      /\bparagraph 66\.13\b/i.test(text) || /\bsection 66\.13\b/i.test(text)) {
    fields.formNumber = "47";
    fields.formType = "consumer-proposal";
    
    // Look for proposal-specific sections
    if (/payment to (secured|unsecured) creditors/i.test(text)) {
      fields.hasCreditorPaymentSection = "yes";
    }
    
    if (/administrator fees/i.test(text)) {
      fields.hasAdminFeesSection = "yes";
    }
    
    // Extract proposal duration if present 
    const durationMatch = text.match(/(?:proposal|payment)\s+(?:period|duration|term)[\s:]*(\d+)\s*(?:months|years)/i);
    if (durationMatch && durationMatch[1]) {
      fields.proposalDuration = durationMatch[1];
      fields.durationUnit = text.match(/months/i) ? 'months' : 'years';
    }
    
    // Check for sworn declaration
    if (/solemnly declare/i.test(text) || /sworn before me/i.test(text)) {
      fields.hasDeclaration = "yes";
    }
  }

  return fields;
};

export const validateFormFields = (fields: FormFields): { valid: boolean; missing: string[] } => {
  let requiredFields: string[] = ['formNumber']; // Basic requirement for all forms
  
  // Add form-specific required fields based on form number
  if (fields.formNumber === "31") {
    requiredFields = [
      'formNumber',
      'clientName', // debtor name
      'claimantName', // creditor name
      'claimAmount'
    ];
  } else if (fields.formNumber === "47") {
    requiredFields = [
      'formNumber',
      'clientName',
      'trusteeName',
      'dateSigned',
      // Additional fields based on consumer proposal requirements
      'proposalType'
    ];
  } else {
    // Default case - just check for basic fields
    requiredFields = ['formNumber', 'clientName'];
  }
  
  const missing = requiredFields.filter(field => !fields[field]);
  
  return {
    valid: missing.length === 0,
    missing
  };
};
