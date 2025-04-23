/**
 * Hardcoded Document Details
 * 
 * This file contains predefined document details for specific form types.
 * These are used to override dynamic document details in development/testing.
 */

import { DocumentDetailsProps } from "@/components/DocumentViewer/DocumentDetails/types";

/**
 * Form 47 (Consumer Proposal) Document Details
 */
export const form47DocumentDetails: Partial<DocumentDetailsProps> = {
  clientName: "Tom Francis",
  formNumber: "47",
  formType: "form-47",
  trusteeName: "Jane Smith",
  administratorName: "Jane Smith",
  dateSigned: "February 2nd, 2025",
  filingDate: "February 5th, 2025",
  documentStatus: "Pending Review",
  metadata: {
    formType: "Form 47 – Consumer Proposal",
    debtorLocation: "Toronto, Ontario",
    proposalType: "Consumer Proposal",
    totalDebt: "$45,000",
    proposedPayment: "$27,000 (60% of total debt)",
    paymentSchedule: "Monthly payments of $450 for 60 months",
    securedCreditors: "None",
    unsecuredCreditors: "5 creditors listed",
    administratorFees: "$1,500 + HST",
    counselingFees: "$85 per session (2 sessions required)",
    witnessInfo: "Tom Francis, Licensed Insolvency Trustee",
    contactInfo: "Phone: 416-555-1234 | Email: tom.francis@trusteeservices.ca"
  }
};

/**
 * Form 31 (Proof of Claim) Document Details
 */
export const form31DocumentDetails: Partial<DocumentDetailsProps> = {
  formNumber: "31",
  formType: "form-31",
  clientName: "ABC Restructuring Ltd.",
  claimantName: "Neil Armstrong",
  creditorName: "ABC Restructuring Ltd.",
  creditorAddress: "Trenton, Ontario",
  debtorName: "GreenTech Supplies Inc.",
  debtorAddress: "Trenton, Ontario",
  claimAmount: "$89,355",
  claimType: "Unsecured Claim (no security held)",
  dateSigned: "April 8, 2025",
  bankruptcyDate: "March 15, 2025",
  metadata: {
    formType: "Form 31 – Proof of Claim",
    debtorName: "GreenTech Supplies Inc.",
    debtorLocation: "Trenton, Ontario",
    creditorName: "ABC Restructuring Ltd.",
    creditorRepresentative: "Neil Armstrong",
    creditorLocation: "Trenton, Ontario",
    amountOwed: "$89,355",
    claimType: "Unsecured Claim (no security held)",
    priorityClaimed: "None indicated",
    attachments: "Schedule \"A\" referenced but not included",
    dateOfBankruptcy: "March 15, 2025",
    formSigned: "April 8, 2025",
    relatedPartyDeclaration: "Not clearly completed",
    dischargeCopyRequest: "Not checked",
    contactInfo: "Phone: 416-988-2442 | Email: neil.armstrong@fallouttrusteelimited.com"
  }
};

/**
 * Get hardcoded document details by form type
 * @param formType The form type (e.g., "form47", "form31")
 * @returns The hardcoded document details for the form type, or undefined if not found
 */
export const getHardcodedDocumentDetails = (formType: string): Partial<DocumentDetailsProps> | undefined => {
  // Normalize form type by removing spaces and converting to lowercase
  const normalizedFormType = formType?.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedFormType) {
    case "form47":
    case "form-47":
      return form47DocumentDetails;
    case "form31":
    case "form-31":
      return form31DocumentDetails;
    default:
      return undefined;
  }
};
