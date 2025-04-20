
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
  const formPatterns = {
    'bankruptcy': /bankruptcy|form\s*66|assignment/i,
    'proposal': /proposal|form\s*47/i,
    'meeting': /meeting of creditors|form\s*29/i,
    'court': /court order|form\s*35/i,
    'proof-of-claim': /proof\s+of\s+claim|form\s*31\b/i
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
    clientName: /(?:debtor|client)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    trusteeName: /(?:trustee|lit)[\s:]*([\w\s.-]+)/i,
    claimantName: /(?:claimant|creditor)\s*name[\s:]*([\w\s.-]+)/i,
    dateSigned: /(?:date|signed)(?:[\s:]*)([\d\/.-]+)/i,
    proposalType: /(consumer proposal|division[i1] proposal)/i,
    courtFileNumber: /court\s+file\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i,
    estateNumber: /(?:estate|bankruptcy)\s+(?:no|number)[\s:.]*([a-z0-9-]+)/i,
    claimAmount: /(?:claim|amount)[\s:]*\$?\s*([\d,.]+)/i,
    claimType: /claim(?:s|ed)?\s+as\s+(?:an?\s+)?(unsecured|secured|preferred|priority|wage earner|farmer|fisherman|director)/i,
    securityDescription: /security\s+(?:held|described|valued)[\s:]*([^.]+)/i
  };

  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields[field] = match[1].trim();
    }
  }

  // Detect Form 31 (Proof of Claim) with enhanced recognition
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
  }

  // Enhance detection for Form 47 Consumer Proposal
  if (/form[\s-]*47\b/i.test(text) || /\bconsumer proposal\b/i.test(text)) {
    fields.formNumber = "47";
    fields.formType = "consumer-proposal";
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
      'dateSigned'
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
