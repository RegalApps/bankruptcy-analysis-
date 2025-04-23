/**
 * Risk Assessments
 * 
 * This file contains predefined risk assessments for different document types.
 * These are used by the RiskAssessment component to display risks in the sidebar.
 */

import { Risk } from "@/components/DocumentViewer/types";

/**
 * Form 47 (Consumer Proposal) Risk Assessments
 */
export const form47RiskAssessments: Risk[] = [
  // High Risk
  {
    type: "compliance",
    description: "Missing Debtor's Full Information",
    severity: "high",
    regulation: "Section 66.13(2)(c) requires full debtor details",
    impact: "Cannot properly identify the debtor or send required notices",
    requiredAction: "Ensure full debtor identity and contact info is disclosed",
    solution: "Ensure full debtor identity and contact info is disclosed in the final proposal form"
  },
  
  // Medium-High Risks
  {
    type: "compliance",
    description: "Terms of payments to secured creditors are omitted",
    severity: "medium",
    regulation: "Required under BIA for creditor treatment",
    impact: "Secured creditors may reject the proposal due to unclear terms",
    requiredAction: "Specify payment terms for secured creditors",
    solution: "Explicitly state how secured creditors will be paid, with timelines and amounts"
  },
  {
    type: "compliance",
    description: "No proposed payment schedule to administrator for unsecured creditors",
    severity: "medium",
    regulation: "Section 66.13(2)(c)",
    impact: "Unsecured creditors cannot evaluate proposal viability",
    requiredAction: "Include payment schedule details",
    solution: "Include total amount, frequency, and duration of payments to be made"
  },
  {
    type: "compliance",
    description: "Omission of priority claim payment details",
    severity: "medium",
    regulation: "Section 136 & 66.13(2)(c)",
    impact: "Priority creditors may challenge the proposal",
    requiredAction: "Define payment structure for priority claims",
    solution: "List all claims with statutory priority and define payment structure"
  },
  
  // Medium-Low Risks
  {
    type: "compliance",
    description: "Administrator and counseling fees not outlined",
    severity: "medium",
    regulation: "Section 66.13(2)(c), Section 66.15",
    impact: "Fee transparency issues may arise during administration",
    requiredAction: "Outline all fees and schedules",
    solution: "Clearly outline proposed fees, schedules, and service descriptions"
  },
  {
    type: "compliance",
    description: "Lack of dividend distribution description",
    severity: "medium",
    regulation: "Section 66.13(2)(c)",
    impact: "Creditors cannot evaluate payment timing and method",
    requiredAction: "Provide dividend distribution details",
    solution: "Provide specifics on how and when dividends will be issued to unsecured creditors"
  },
  {
    type: "compliance",
    description: "Missing administrator contact details",
    severity: "medium",
    regulation: "Form 1.1 compliance",
    impact: "Creditors may have difficulty contacting administrator",
    requiredAction: "Include administrator contact information",
    solution: "Ensure sender's name and contact info are appended to any emailed version"
  },
  
  // Low Risk
  {
    type: "compliance",
    description: "Additional terms section left blank",
    severity: "low",
    regulation: "Not a violation per se, but missed opportunity",
    impact: "Potential terms beneficial to debtor may be omitted",
    requiredAction: "Consider adding relevant terms",
    solution: "If applicable, include contingencies, settlement clauses, or interest terms"
  }
];

/**
 * Form 31 (Proof of Claim) Risk Assessments
 */
export const form31RiskAssessments: Risk[] = [
  // --- HIGH RISK ISSUES ---
  {
    type: "compliance",
    description: "Missing Supporting Documentation (Schedule \"A\")",
    severity: "high",
    regulation: "s. 124(2) – All claims must be substantiated by a statement of account, vouchers, or affidavit.",
    impact: "Claim amount of $89,355 is unsubstantiated due to missing affidavit or statement of account.",
    requiredAction: "Attach a full breakdown showing how the $89,355 was calculated, including invoices, contracts, or payment history.",
    solution: "Provide Schedule \"A\" with detailed supporting documents."
  },
  {
    type: "compliance",
    description: "Undeclared Relationship to Debtor",
    severity: "high",
    regulation: "s. 4 – Related‑party disclosures are mandatory, especially if dealing at non‑arm’s length.",
    impact: "Failure to disclose relationship may invalidate claim or change claim priority.",
    requiredAction: "Explicitly state relationship status in Section relating to related parties.",
    solution: "State 'I am not related to the debtor' or fully disclose the nature of the relationship."
  },
  {
    type: "compliance",
    description: "No Declaration of Payments / Credits / Transfers",
    severity: "high",
    regulation: "s. 2(1), 95–101 – Requires disclosure of preferential payments or undervalued transfers.",
    impact: "Potential concealment of preferential payments may lead to claim disallowance or claw‑backs.",
    requiredAction: "Declare 'No payments or transfers' if none, otherwise provide full details of transactions within 3–12 months before bankruptcy.",
    solution: "Complete Section 6 with accurate information about payments, credits, or transfers."
  },
  {
    type: "compliance",
    description: "Missing Witness Signature",
    severity: "high",
    regulation: "Witnessing is required for proof of claim authenticity and legal formality.",
    impact: "Without a witness signature, the form may be invalidated or challenged.",
    requiredAction: "Have an appropriate witness sign and date the form.",
    solution: "Obtain witness signature and date to validate the document."
  },

  // --- MEDIUM RISK ISSUES ---
  {
    type: "compliance",
    description: "Incomplete Priority Claim Declaration",
    severity: "medium",
    regulation: "s. 124(2) – Priority claims must be documented and supported with calculations.",
    impact: "Ambiguity may cause disputes over priority status and delay claim processing.",
    requiredAction: "If no priority intended, strike out the section; if claiming, provide dollar value and backup documentation.",
    solution: "Complete Section 4A with amount and supporting sheet or cross it out if not applicable."
  },
  {
    type: "compliance",
    description: "Invalid Date Format",
    severity: "medium",
    regulation: "Administrative non‑compliance can render form invalid.",
    impact: "Improper date (e.g., '8 day of 0') may invalidate the form on technical grounds.",
    requiredAction: "Correct the date format.",
    solution: "Update date to 'April 8, 2025' or correct signing date."
  },
  {
    type: "compliance",
    description: "Ambiguous Declaration of Unsecured Claim",
    severity: "medium",
    regulation: "s. 128 – Ambiguity in security claims can create legal confusion or misinterpretation.",
    impact: "Unclear security status may lead to challenges from other creditors or trustee.",
    requiredAction: "Clearly mark 'no security held' and cross out irrelevant sections.",
    solution: "Cross out secured/lessor/farmer/wage sections and affirm no security held."
  }
];

/**
 * Get risk assessments for a specific form type
 * @param formType The type of form (e.g., "form-47", "form-31")
 * @returns Array of Risk objects for the specified form type
 */
export const getRiskAssessments = (formType: string): Risk[] => {
  switch (formType) {
    case "form-47":
      return form47RiskAssessments;
    case "form-31":
      return form31RiskAssessments;
    default:
      return [];
  }
};
