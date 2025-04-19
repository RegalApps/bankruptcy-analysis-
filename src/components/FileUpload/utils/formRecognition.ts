
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
  
  // Common field patterns
  const patterns = {
    formNumber: /form\s*(?:no\.?|number)?[\s:]*([\w-]+)/i,
    clientName: /(?:debtor|client)(?:'s)?\s*name[\s:]*([\w\s.-]+)/i,
    trusteeName: /(?:trustee|lit)[\s:]*([\w\s.-]+)/i,
    dateSigned: /(?:date|signed)(?:[\s:]*)([\d\/.-]+)/i,
  };

  // Extract fields using patterns
  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields[field] = match[1].trim();
    }
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
