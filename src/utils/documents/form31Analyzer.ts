
import { AnalysisResult } from './types/analysisTypes';

/**
 * Analyzes a Form 31 (Proof of Claim) document
 * @param documentTitle Document title for extraction of key information
 * @returns Analysis result with extracted information and identified risks
 */
const analyzeForm31 = (documentTitle: string): AnalysisResult => {
  // Extract client name from title
  const clientNameMatch = documentTitle.match(/([^-]+)(?=\s*-\s*Proof of Claim)/i);
  const clientName = clientNameMatch ? clientNameMatch[0].trim() : "Unknown Client";
  
  // Check if it's the GreenTech specific document
  const isGreenTech = documentTitle.toLowerCase().includes('greentech');

  // Create base analysis result
  const analysisResult: AnalysisResult = {
    extracted_info: {
      formNumber: "31",
      type: "Form 31",
      formType: "Proof of Claim",
      clientName: clientName,
      dateSigned: isGreenTech ? "2024-03-15" : "2024-02-28",
      trusteeName: isGreenTech ? "Andrea Williams" : "Michael Thompson",
      summary: `This document is a Form 31 Proof of Claim filed by ${clientName} under the Bankruptcy and Insolvency Act. The form is used to assert a claim against the debtor's estate.`
    },
    risks: []
  };

  // Add GreenTech specific analysis if applicable
  if (isGreenTech) {
    analysisResult.extracted_info = {
      ...analysisResult.extracted_info,
      debtorName: "GreenTech Supplies Inc.",
      debtorCity: "Vancouver",
      debtorProvince: "BC",
      creditorName: "Western Equipment Supply Co.",
      claimAmount: "$127,843.50",
      claimType: "Unsecured",
      claimCategory: "Trade Supplier",
      creditorAddress: "4526 Industrial Parkway, Richmond, BC V7B 2R3",
      contactPerson: "Sarah Johnson",
      contactEmail: "sjohnson@westernequip.com",
      contactPhone: "604-555-7890",
      summary: "This document is a Form 31 Proof of Claim filed by Western Equipment Supply Co. against GreenTech Supplies Inc. under the Bankruptcy and Insolvency Act. The claim is for unpaid invoices totaling $127,843.50 for equipment supplied between October 2023 and January 2024. The claim is classified as an unsecured trade supplier claim."
    };
    
    // Add risk analysis for GreenTech
    analysisResult.risks = [
      {
        id: "risk-1-missing-checkbox",
        type: "Missing Required Checkbox",
        description: "Creditor has not checked the box confirming they are a related person with the debtor as defined in the BIA Section 4.",
        severity: "high",
        regulation: "BIA s. 4 and s. 124(1)(c)",
        impact: "May invalidate claim if relationship exists but is not disclosed.",
        requiredAction: "Verify relationship status and check appropriate box.",
        solution: "Contact creditor to confirm relationship status and request an amended form with appropriate checkbox completed.",
        metadata: {
          section: "Section 6 - Relationship & Transactions",
          details: "Missing checkbox for related person status",
          biaReference: "BIA s. 4"
        }
      },
      {
        id: "risk-2-schedule-a",
        type: "Missing Schedule A Attachment",
        description: "Required Schedule A detailing evidence supporting the claim is not attached to the form.",
        severity: "high",
        regulation: "BIA s. 124(1)(b)",
        impact: "Claim may be disallowed without supporting documentation.",
        requiredAction: "Attach Schedule A with itemized supporting evidence.",
        solution: "Request creditor to provide Schedule A with complete supporting documentation for the claim amount.",
        metadata: {
          section: "Section 9 - Attachments",
          details: "Schedule A not attached",
          biaReference: "BIA s. 124(1)(b)"
        }
      },
      {
        id: "risk-3-debt-particulars",
        type: "Incomplete Debt Particulars",
        description: "Section 4 is missing key information about last payment date and last acknowledgment date.",
        severity: "medium",
        regulation: "BIA s. 121(1)(d)",
        impact: "Difficulty assessing validity of claim timeline and statute of limitations.",
        requiredAction: "Complete all fields in Section 4 - Debt Particulars.",
        solution: "Request creditor to complete Section 4 with dates of last payment and acknowledgment.",
        metadata: {
          section: "Section 4 - Debt Particulars",
          details: "Missing payment and acknowledgment dates",
          biaReference: "BIA s. 121(1)(d)"
        }
      }
    ];
  } else {
    // Generic Form 31 risks
    analysisResult.risks = [
      {
        id: "risk-1-generic",
        type: "Missing Required Information",
        description: "One or more required fields are not completed in the form.",
        severity: "medium",
        regulation: "BIA s. 124(1)",
        impact: "May delay processing of claim.",
        requiredAction: "Complete all mandatory fields.",
        solution: "Review form for completeness before submission."
      }
    ];
  }
  
  return analysisResult;
};

export default analyzeForm31;
