
import { useState, useEffect } from 'react';
import { Risk, GreenTechRisk } from '../RiskAssessment/types';

export const useGreenTechForm31Risks = () => {
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    // Create the GreenTech specific risks based on the prompt information
    const greenTechRisks: Risk[] = [
      // HIGH RISK
      {
        type: "Missing Checkbox Selections",
        description: "Missing Checkbox Selections in Claim Category",
        severity: "high",
        regulation: "BIA Subsection 124(2)",
        impact: "This creates ambiguity about the nature of the claim. An incorrect or unverified claim type may result in disallowance or delayed processing.",
        solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
        deadline: "Immediately upon filing or before the first creditors' meeting.",
        metadata: {
          section: "Section 4",
          details: "None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.",
          biaReference: "Subsection 124(2)",
          clientName: "GreenTech Supplies Inc.",
          position: { x: 0.15, y: 0.35, width: 0.7, height: 0.08 }
        }
      },
      {
        type: "Missing Relatedness Declaration",
        description: "Missing Confirmation of Relatedness/Arm's-Length Status",
        severity: "high",
        regulation: "BIA Section 4(1) and Section 95",
        impact: "Required for assessing transfers and preferences under s.4 and s.95–96.",
        solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
        deadline: "Immediately",
        metadata: {
          section: "Section 5",
          details: "The declaration of whether the creditor is related to the debtor or dealt at arm's length is incomplete.",
          biaReference: "Section 4(1) and Section 95",
          clientName: "GreenTech Supplies Inc.",
          position: { x: 0.15, y: 0.45, width: 0.7, height: 0.08 }
        }
      },
      {
        type: "Missing Transfer Disclosure",
        description: "No Disclosure of Transfers, Credits, or Payments",
        severity: "high",
        regulation: "BIA Section 96(1)",
        impact: "Required to assess preferential payments or transfers at undervalue.",
        solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions within the past 3–12 months.",
        deadline: "Must be part of the Proof of Claim to be considered valid.",
        metadata: {
          section: "Section 6",
          details: "The response field is empty.",
          biaReference: "Section 96(1)",
          clientName: "GreenTech Supplies Inc.",
          position: { x: 0.15, y: 0.55, width: 0.7, height: 0.08 }
        }
      },

      // MEDIUM RISK
      {
        type: "Date Format Error",
        description: "Incorrect or Incomplete Date Format",
        severity: "medium",
        regulation: "BIA Form Regulations Rule 1",
        impact: "Could invalidate the form due to ambiguity or perceived incompleteness.",
        solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\"",
        deadline: "Before submission",
        metadata: {
          section: "Declaration",
          details: "\"Dated at 2025, this 8 day of 0.\" is invalid.",
          biaReference: "BIA Form Regulations Rule 1",
          clientName: "GreenTech Supplies Inc.",
          position: { x: 0.2, y: 0.7, width: 0.5, height: 0.05 }
        }
      },
      {
        type: "Incomplete Trustee Declaration",
        description: "Incomplete Trustee Declaration",
        severity: "medium",
        regulation: "BIA General Requirements",
        impact: "Weakens legal standing of the declaration.",
        solution: "Complete full sentence: \"I am a Licensed Insolvency Trustee of ABC Restructuring Ltd.\" and ensure proper signature of both trustee and witness.",
        deadline: "3 days",
        metadata: {
          section: "Declaration",
          details: "\"I am a creditor (or I am a Licensed Insolvency Trustee)\" is not finalized with a completed sentence or signature line.",
          biaReference: "BIA General Requirements",
          clientName: "GreenTech Supplies Inc.",
          position: { x: 0.1, y: 0.78, width: 0.8, height: 0.07 }
        }
      },

      // LOW RISK
      {
        type: "Missing Schedule A",
        description: "No Attached Schedule \"A\"",
        severity: "low",
        regulation: "BIA Subsection 124(2)",
        impact: "May delay claim acceptance if not provided to support the stated debt.",
        solution: "Attach a detailed account statement or affidavit showing calculation of amount owing, including any applicable interest or late fees.",
        deadline: "5 days",
        metadata: {
          section: "Supporting Documents",
          details: "While referenced, Schedule \"A\" showing the breakdown of the $89,355 is not attached or included in this file.",
          biaReference: "BIA Subsection 124(2)",
          clientName: "GreenTech Supplies Inc."
        }
      },
      {
        type: "Missing Trustee Report Checkbox",
        description: "Missing Checkbox for Trustee Discharge Report Request",
        severity: "low",
        regulation: "BIA Optional Requirements",
        impact: "Might miss delivery of discharge-related updates.",
        solution: "Tick if desired, but not mandatory for non-individual bankruptcies.",
        deadline: "Optional",
        metadata: {
          section: "Optional",
          details: "Unchecked, even though the form is being filed on behalf of a trustee.",
          biaReference: "BIA Optional Requirements",
          clientName: "GreenTech Supplies Inc."
        }
      }
    ];

    setRisks(greenTechRisks);
  }, []);

  return risks;
};
