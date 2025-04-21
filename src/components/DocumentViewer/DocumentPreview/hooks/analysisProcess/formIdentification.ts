
import { DocumentRecord } from "../types";

/**
 * Enhanced detection of Form 76 documents with multiple fallback methods
 * Uses multiple methods to increase detection reliability
 */
export const isForm76 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  console.log("Checking if document is Form 76...");
  
  // Create a clean version of the text for better matching
  const cleanText = documentText.toLowerCase().replace(/\s+/g, ' ');
  
  // Method 1: Check the document title
  const titleIndicatesForm76 = Boolean(
    documentRecord.title?.toLowerCase().includes('form 76') ||
    documentRecord.title?.toLowerCase().includes('f76') ||
    documentRecord.title?.toLowerCase().includes('form76') ||
    documentRecord.title?.toLowerCase().includes('statement of affairs')
  );
  
  // Method 2: Check document type if available
  const metadataIndicatesForm76 = Boolean(
    documentRecord.metadata?.formType === 'form-76' ||
    documentRecord.metadata?.formType === 'form76' ||
    documentRecord.metadata?.formNumber === '76'
  );
  
  // Method 3: Check text content with multiple patterns
  const textPatterns = [
    /\bf(?:orm)?\s*76\b/i,
    /\bstatement\s+of\s+affairs\b/i,
    /\bassets\s+and\s+liabilities\b/i,
    /\baffidavit\s+of\s+the\s+bankrupt\b/i,
    /\bpersonal\s+information\s+of\s+bankrupt\b/i,
    /\bbankruptcy\s+and\s+insolvency\s+act\b/i
  ];
  
  const textIndicatesForm76 = textPatterns.some(pattern => pattern.test(cleanText));
  
  // Method 4: Check for typical Form 76 sections
  const sectionIndicators = [
    'PART A – ASSETS',
    'PART B – LIABILITIES',
    'PART C – INCOME',
    'PART D – MONTHLY EXPENSES',
    'ASSETS AND LIABILITIES',
    'STATEMENT OF AFFAIRS'
  ];
  
  const hasForm76Sections = sectionIndicators.some(section => 
    cleanText.includes(section.toLowerCase())
  );
  
  // Method 5: Check for Form 76 structural indicators
  const structuralIndicators = [
    'secured creditors',
    'unsecured creditors', 
    'preferred creditors',
    'real property',
    'personal property',
    'monthly income',
    'monthly expenses'
  ];
  
  const hasStructuralIndicators = structuralIndicators.some(indicator => 
    cleanText.includes(indicator.toLowerCase())
  );
  
  // Log all detection results for debugging
  console.log({
    titleIndicatesForm76,
    metadataIndicatesForm76,
    textIndicatesForm76,
    hasForm76Sections,
    hasStructuralIndicators
  });
  
  // Document is Form 76 if any method indicates it is
  const result = titleIndicatesForm76 || 
                metadataIndicatesForm76 || 
                textIndicatesForm76 || 
                hasForm76Sections ||
                hasStructuralIndicators;
  
  console.log(`Form 76 detection result: ${result}`);
  return result;
};

/**
 * Enhanced detection of Form 47 Consumer Proposal documents
 * Uses multiple methods to increase detection reliability
 */
export const isForm47 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  console.log("Checking if document is Form 47...");
  
  // Create a clean version of the text for better matching
  const cleanText = documentText.toLowerCase().replace(/\s+/g, ' ');
  
  // Method 1: Check the document title
  const titleIndicatesForm47 = Boolean(
    documentRecord.title?.toLowerCase().includes('form 47') ||
    documentRecord.title?.toLowerCase().includes('f47') ||
    documentRecord.title?.toLowerCase().includes('form47') ||
    documentRecord.title?.toLowerCase().includes('consumer proposal')
  );
  
  // Method 2: Check document type if available
  const metadataIndicatesForm47 = Boolean(
    documentRecord.metadata?.formType === 'form-47' ||
    documentRecord.metadata?.formType === 'form47' ||
    documentRecord.metadata?.formNumber === '47'
  );
  
  // Method 3: Check text content with multiple patterns
  const textPatterns = [
    /\bf(?:orm)?\s*47\b/i,
    /\bconsumer\s+proposal\b/i,
    /\bparagraph\s+66\.13\b/i,
    /\bsection\s+66\.13\b/i,
    /\bconsumer\s+debtor\b/i,
    /\badministrator\s+of\s+consumer\s+proposal\b/i
  ];
  
  const textIndicatesForm47 = textPatterns.some(pattern => pattern.test(cleanText));
  
  // Method 4: Check for typical Form 47 sections
  const sectionIndicators = [
    'consumer proposal',
    'payment to secured creditors',
    'payment of preferred claims',
    'payment to unsecured creditors',
    'administrator fees',
    'distribution of payments'
  ];
  
  const hasForm47Sections = sectionIndicators.some(section => 
    cleanText.includes(section.toLowerCase())
  );
  
  // Method 5: Check for Form 47 specific legal references
  const legalReferences = [
    'paragraph 66.13(2)(c)',
    'section 66.14',
    'section 66.15',
    'division ii of part iii',
    'bia s. 66',
    'directive 6r3'
  ];
  
  const hasLegalReferences = legalReferences.some(reference => 
    cleanText.includes(reference.toLowerCase())
  );
  
  // Method 6: Check for Form 47 structural indicators
  const structuralIndicators = [
    'statement of affairs',
    'income and expense',
    'surplus income',
    'osb threshold',
    'administrator fees',
    'proposal payment',
    'sworn declaration'
  ];
  
  const hasStructuralIndicators = structuralIndicators.some(indicator => 
    cleanText.includes(indicator.toLowerCase())
  );
  
  // Log all detection results for debugging
  console.log({
    titleIndicatesForm47,
    metadataIndicatesForm47,
    textIndicatesForm47,
    hasForm47Sections,
    hasLegalReferences,
    hasStructuralIndicators
  });
  
  // Document is Form 47 if any method indicates it is
  const result = titleIndicatesForm47 || 
                metadataIndicatesForm47 || 
                textIndicatesForm47 || 
                hasForm47Sections ||
                hasLegalReferences ||
                hasStructuralIndicators;
  
  console.log(`Form 47 detection result: ${result}`);
  return result;
};

/**
 * Enhanced detection of Form 31 Proof of Claim documents
 * Uses multiple methods to increase detection reliability based on comprehensive guide
 */
export const isForm31 = (documentRecord: DocumentRecord, documentText: string): boolean => {
  console.log("Checking if document is Form 31...");
  
  // Create a clean version of the text for better matching
  const cleanText = documentText.toLowerCase().replace(/\s+/g, ' ');
  
  // Method 1: Check the document title
  const titleIndicatesForm31 = Boolean(
    documentRecord.title?.toLowerCase().includes('form 31') ||
    documentRecord.title?.toLowerCase().includes('f31') ||
    documentRecord.title?.toLowerCase().includes('form31') ||
    documentRecord.title?.toLowerCase().includes('proof of claim')
  );
  
  // Method 2: Check document type if available
  const metadataIndicatesForm31 = Boolean(
    documentRecord.metadata?.formType === 'form-31' ||
    documentRecord.metadata?.formType === 'form31' ||
    documentRecord.metadata?.formNumber === '31'
  );
  
  // Method 3: Check text content with multiple patterns
  const textPatterns = [
    /\bf(?:orm)?\s*31\b/i,
    /\bproof\s+of\s+claim\b/i,
    /\bbia\s+(?:form|s|sec|section)\s*121\b/i,
    /\bclaim\s+against\s+bankrupt\b/i,
    /\bcreditor['']s\s+claim\b/i,
    /\bsecured\s+creditor\b/i
  ];
  
  const textIndicatesForm31 = textPatterns.some(pattern => pattern.test(cleanText));
  
  // Method 4: Check for typical Form 31 sections based on comprehensive guide
  const sectionIndicators = [
    'proof of claim',
    'total claim amount',
    'interest calculation',
    'claim type classification',
    'statement of account',
    'security details',
    'secured claim',
    'unsecured claim',
    'wage earner',
    'director liability',
    'securities customer'
  ];
  
  const hasForm31Sections = sectionIndicators.some(section => 
    cleanText.includes(section.toLowerCase())
  );
  
  // Method 5: Check for Form 31 specific legal references from comprehensive guide
  const legalReferences = [
    'bia s. 121',
    'bia s. 124',
    'bia s. 50(13)',
    'bia s. 128(1)',
    'bia s. 81.2(1)',
    'bia s. 136(1)',
    'rule 31(1)',
    'rule 73',
    'bankruptcy and insolvency rules',
    'directive no. 18r'
  ];
  
  const hasLegalReferences = legalReferences.some(reference => 
    cleanText.includes(reference.toLowerCase())
  );
  
  // Method 6: Check for Form 31 claim types
  const claimTypes = [
    'type a', 'unsecured claim',
    'type b', 'lease disclaimer',
    'type c', 'secured claim',
    'type d', 'farmer or fisherman',
    'type e', 'wage earner',
    'type f', 'director liability',
    'type g', 'securities customer',
    'type h', 'employee priority',
    'type i', 'compensation priority'
  ];
  
  const hasClaimTypes = claimTypes.some(type => 
    cleanText.includes(type.toLowerCase())
  );
  
  // Log all detection results for debugging
  console.log({
    titleIndicatesForm31,
    metadataIndicatesForm31,
    textIndicatesForm31,
    hasForm31Sections,
    hasLegalReferences,
    hasClaimTypes
  });
  
  // Document is Form 31 if any method indicates it is
  const result = titleIndicatesForm31 || 
                metadataIndicatesForm31 || 
                textIndicatesForm31 || 
                hasForm31Sections ||
                hasLegalReferences ||
                hasClaimTypes;
  
  console.log(`Form 31 detection result: ${result}`);
  return result;
};
