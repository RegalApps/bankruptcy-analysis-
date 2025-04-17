
/**
 * Centralized utility for document type detection and path handling
 */

import logger from "@/utils/logger";

/**
 * Determines if a document is a Form 31 (Proof of Claim) based on various indicators
 * 
 * @param metadata Document metadata object
 * @param documentId Document ID
 * @param storagePath Storage path
 * @param title Document title
 * @returns Boolean indicating if document is a Form 31
 */
export const isDocumentForm31 = (
  metadata: any | null,
  documentId: string | null,
  storagePath: string | null,
  title: string | null
): boolean => {
  // Check metadata first (most reliable)
  if (metadata) {
    const formType = metadata.formType || '';
    const formNumber = metadata.formNumber || '';
    
    if (formType.toLowerCase().includes('form-31') || 
        formType.toLowerCase().includes('proof of claim') ||
        formNumber === '31') {
      logger.debug('Form 31 detected via metadata');
      return true;
    }
  }
  
  // Check document ID
  if (documentId) {
    if (documentId.toLowerCase().includes('form31') ||
        documentId.toLowerCase().includes('form-31') ||
        documentId.toLowerCase().includes('greentech')) {
      logger.debug('Form 31 detected via document ID');
      return true;
    }
  }
  
  // Check storage path
  if (storagePath) {
    if (storagePath.toLowerCase().includes('form31') ||
        storagePath.toLowerCase().includes('form-31') ||
        storagePath.toLowerCase().includes('greentech')) {
      logger.debug('Form 31 detected via storage path');
      return true;
    }
  }
  
  // Check title
  if (title) {
    if (title.toLowerCase().includes('form 31') ||
        title.toLowerCase().includes('form31') ||
        title.toLowerCase().includes('proof of claim') ||
        title.toLowerCase().includes('greentech')) {
      logger.debug('Form 31 detected via document title');
      return true;
    }
  }
  
  return false;
};

/**
 * Gets the effective storage path for a document, handling special cases for Form 31
 * 
 * @param storagePath Original storage path
 * @param isForm31GreenTech Flag indicating if document is Form 31
 * @param documentId Document ID for fallback logic
 * @returns The effective storage path to use
 */
export const getEffectiveStoragePath = (
  storagePath: string | null,
  isForm31GreenTech: boolean,
  documentId?: string
): string => {
  if (isForm31GreenTech) {
    // For Form 31 documents, use a reliable local path
    return "/documents/sample-form31-greentech.pdf";
  }
  
  return storagePath || '';
};

/**
 * Get Form 31 specific document analysis data
 * Used to provide consistent analysis data for GreenTech Form 31 demo documents
 */
export const getForm31DemoAnalysisData = (): any => {
  return {
    extracted_info: {
      clientName: "GreenTech Supplies Inc.",
      clientAddress: "100 Technology Drive, Toronto, Ontario, M5G 1A1",
      clientPhone: "(416) 555-1234",
      clientId: "GT-20250408",
      clientEmail: "accounting@greentech.example",
      
      formNumber: "31",
      formType: "Proof of Claim",
      dateSigned: "April 8, 2025",
      
      estateNumber: "35-2874291",
      district: "Ontario",
      divisionNumber: "09",
      
      totalDebts: "$89,355.00",
      creditorName: "ABC Restructuring Ltd.",
      
      summary: "GreenTech Supplies Inc. has filed a Form 31 (Proof of Claim) for $89,355.00. This document contains several compliance issues that need to be addressed including missing checkbox selections in claim categories and incomplete declaration of relatedness status."
    },
    risks: [
      {
        type: "Missing Checkbox Selections",
        description: "None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.",
        regulation: "BIA Subsection 124(2)",
        impact: "This creates ambiguity about the nature of the claim. An incorrect or unverified claim type may result in disallowance or delayed processing.",
        solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
        severity: "high",
        deadline: "Immediately upon filing or before the first creditors' meeting."
      },
      {
        type: "Missing Confirmation of Relatedness",
        description: "The declaration of whether the creditor is related to the debtor or dealt at arm's length is incomplete.",
        regulation: "BIA Section 4(1) and Section 95",
        impact: "Required for assessing transfers and preferences under s.4 and s.95–96.",
        solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
        severity: "high",
        deadline: "Immediately"
      },
      {
        type: "No Disclosure of Transfers",
        description: "The response field for transfers, credits, or payments is empty.",
        regulation: "BIA Section 96(1)",
        impact: "Required to assess preferential payments or transfers at undervalue.",
        solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions within the past 3–12 months.",
        severity: "high",
        deadline: "Must be part of the Proof of Claim to be considered valid."
      }
    ],
    regulatory_compliance: {
      status: "non_compliant",
      details: "Form 31 contains several critical compliance issues requiring immediate attention.",
      references: [
        "BIA Subsection 124(2) - Proof of Claims",
        "BIA Section 4(1) - Related Persons",
        "BIA Section 95 - Arm's Length Transactions",
        "BIA Section 96(1) - Transfer at Undervalue"
      ]
    }
  };
};
