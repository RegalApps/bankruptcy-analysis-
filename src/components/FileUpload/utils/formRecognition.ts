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
  [key: string]: string | undefined;
}

export const identifyFormType = (text: string): string => {
  const formPatterns = {
    'bankruptcy': /bankruptcy|form\s*66|assignment/i,
    'proposal': /proposal|form\s*47/i,
    'meeting': /meeting of creditors|form\s*29/i,
    'court': /court order|form\s*35/i
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
  
  // Add robust form type, number, and section detection for Form 47 & Form 31
  const patterns = {
    formNumber: /form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i,
    clientName: /(?:debtor|client)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    trusteeName: /(?:trustee|lit)[\s:]*([\w\s.-]+)/i,
    claimantName: /(?:claimant|creditor)\s*name[\s:]*([\w\s.-]+)/i,
    dateSigned: /(?:date|signed)(?:[\s:]*)([\d\/.-]+)/i,
    proposalType: /(consumer proposal|division[i1] proposal)/i
  };

  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields[field] = match[1].trim();
    }
  }

  // New: detect Form 31 (Proof of Claim)
  if (/form[\s-]*31\b/i.test(text) || /\bproof of claim\b/i.test(text)) {
    fields.formNumber = "31";
    fields.formType = "proof-of-claim";
  }

  // Enhance detection for Form 47 Consumer Proposal
  if (/form[\s-]*47\b/i.test(text) || /\bconsumer proposal\b/i.test(text)) {
    fields.formNumber = "47";
    fields.formType = "consumer-proposal";
  }

  // Add more heuristics or fields as needed
  return fields;
};

export const validateFormFields = (fields: FormFields): { valid: boolean; missing: string[] } => {
  const requiredFields = ['formNumber', 'clientName', 'dateSigned'];
  const missing = requiredFields.filter(field => !fields[field]);
  
  return {
    valid: missing.length === 0,
    missing
  };
};
