
/**
 * Utility functions for document type detection and path handling
 */

// Function to detect if a document is a Form 31
export const isDocumentForm31 = (
  document: any | null,
  documentId: string | null | undefined,
  storagePath: string | null | undefined,
  documentTitle: string | null | undefined
): boolean => {
  // Check various indicators that might suggest this is a Form 31
  const titleIndicator = documentTitle?.toLowerCase().includes('form 31') || 
                        documentTitle?.toLowerCase().includes('proof of claim');
                        
  const pathIndicator = storagePath?.toLowerCase().includes('form31') || 
                        storagePath?.toLowerCase().includes('proof-of-claim');
                        
  const idIndicator = documentId?.toLowerCase().includes('form31') || 
                     documentId?.toLowerCase().includes('greentech');

  const metadataIndicator = document?.metadata?.formNumber === '31' ||
                           document?.metadata?.formType === 'form-31' ||
                           (document?.metadata?.documentType === 'proof-of-claim');

  return !!(titleIndicator || pathIndicator || idIndicator || metadataIndicator);
};

// Function to determine the effective storage path for a document
export const getEffectiveStoragePath = (
  storagePath: string | null | undefined,
  isForm31: boolean,
  documentId?: string | null
): string => {
  // For Form 31, use the local path
  if (isForm31) {
    return "/documents/sample-form31-greentech.pdf";
  }
  
  // For regular documents, ensure path is valid
  if (!storagePath) {
    console.warn(`Missing storage path for document ID: ${documentId}`);
    return '';
  }
  
  return storagePath;
};

// Function to get appropriate form analysis demo data
export const getForm31DemoAnalysisData = () => {
  return {
    extracted_info: {
      formType: 'form-31',
      formNumber: '31',
      documentType: 'proof-of-claim',
      status: 'requires_review',
      clientName: "GreenTech Supplies Inc.",
      creditorName: "GreenTech Supplies Inc.",
      dateSigned: "2025-03-15", 
      trusteeName: "Sarah Johnson",
      summary: "This Form 31 Proof of Claim document requires attention to several compliance issues before submission."
    },
    regulatory_compliance: {
      status: 'non_compliant' as 'non_compliant' | 'compliant' | 'needs_review',
      details: 'This document has compliance issues that must be addressed before submission.',
      references: [
        'BIA Section 124(1)(b) - Supporting documentation requirements',
        'BIA Section 4 - Related party disclosures',
        'BIA Section 128(3) - Security documentation requirements'
      ]
    },
    risks: [
      {
        type: "Missing Section Completions",
        description: "Several required sections are incomplete",
        severity: "high",
        regulation: "BIA Section 124(2)",
      },
      {
        type: "Supporting Documentation",
        description: "No supporting documents attached",
        severity: "medium",
        regulation: "BIA Rules 66(2)",
      },
      {
        type: "Potential Related Party Transaction",
        description: "No disclosure whether creditor is related to debtor under BIA s.4",
        severity: "high",
        regulation: "BIA Section 4",
      }
    ]
  };
};

// Function to diagnose document loading issues
export const diagnoseDocumentLoadIssue = (
  storagePath: string | null | undefined,
  error: any
): string => {
  if (!storagePath) {
    return 'Missing document storage path';
  }
  
  if (error?.message?.includes('permission denied')) {
    return 'Permission denied - Check storage bucket RLS policies';
  }
  
  if (error?.message?.includes('not found')) {
    return 'Document not found in storage';
  }
  
  return 'Unknown document loading error';
};
