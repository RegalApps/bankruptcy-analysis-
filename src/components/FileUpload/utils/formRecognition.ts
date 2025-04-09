
import { FINANCIAL_TERMS } from './constants';

interface FormField {
  label: string;
  value: string;
  confidence: number;
}

export interface FormFields {
  formNumber?: string;
  clientName?: string;
  trusteeName?: string;
  dateSigned?: string;
  [key: string]: string | undefined;
}

export const identifyFormType = (text: string): string => {
  const formPatterns = {
    'bankruptcy': /bankruptcy|form\s*66|assignment/i,
    'proposal': /proposal|form\s*47/i,
    'meeting': /meeting of creditors|form\s*29/i,
    'court': /court order|form\s*35/i,
    'proof_of_claim': /proof\s*of\s*claim|form\s*31/i
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
  
  // Common field patterns
  const patterns = {
    formNumber: /form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i,
    clientName: /(?:debtor|client|bankrupt)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    trusteeName: /(?:trustee|lit|administrator)[\s:]*([\w\s.-]+)/i,
    dateSigned: /(?:date|signed)(?:[\s:]*)([\d\/.-]+)/i,
  };

  // Extract fields using patterns
  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields[field] = match[1].trim();
    }
  }
  
  // Special case for Form 31: look for creditor information
  const creditorNameMatch = text.match(/(?:creditor['s]?\s*name|name\s*of\s*creditor)[\s:]*([\w\s.-]+)/i);
  if (creditorNameMatch && creditorNameMatch[1]) {
    fields.creditorName = creditorNameMatch[1].trim();
  }
  
  const amountClaimedMatch = text.match(/(?:amount\s*claimed|claim\s*amount)[\s:]*(?:\$)?([0-9,.]+)/i);
  if (amountClaimedMatch && amountClaimedMatch[1]) {
    fields.amountClaimed = amountClaimedMatch[1].trim();
  }

  // Additional processing for financial terms
  const foundTerms = FINANCIAL_TERMS.filter(term => 
    new RegExp(`\\b${term}\\b`, 'i').test(text)
  );

  if (foundTerms.length > 0) {
    console.log('Found financial terms:', foundTerms);
  }

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

// New function to detect Form 31 specifically
export const isForm31 = (text: string): boolean => {
  const form31Indicators = [
    /form\s*31/i,
    /proof\s*of\s*claim/i,
    /bankruptcy\s*and\s*insolvency\s*act/i,
    /notice\s*of\s*claim/i,
    /creditor['s]?\s*name/i
  ];
  
  return form31Indicators.some(pattern => pattern.test(text));
};

// Extract Form 31 specific fields
export const extractForm31Fields = (text: string): Record<string, any> => {
  const fields: Record<string, any> = {};
  
  // Try to extract company name
  const companyMatch = text.match(/(?:bankrupt|debtor|company)\s*name[\s:]*([\w\s.-]+?)(?:ltd\.?|inc\.?|limited|corporation|corp\.?|$)/i);
  if (companyMatch && companyMatch[1]) {
    fields.companyName = companyMatch[1].trim();
    
    // If we have a company name, this is likely a corporate bankruptcy
    fields.isCompany = true;
  }
  
  // Extract claim amount
  const claimMatch = text.match(/(?:amount\s*claimed|claim\s*amount|total\s*claim)[\s:]*(?:\$)?([0-9,.]+)/i);
  if (claimMatch && claimMatch[1]) {
    fields.claimAmount = claimMatch[1].replace(/[,$]/g, '').trim();
  }
  
  // Extract whether claim boxes are checked
  fields.claimTypeSelected = /\[x\]|\[X\]|☑|☒/.test(text);
  
  return fields;
};

