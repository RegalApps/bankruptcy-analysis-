
import { useState, useEffect } from 'react';
import { Risk } from '../types';

export const useGreenTechForm31Risks = () => {
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    // Create the GreenTech specific risks based on the prompt information
    const greenTechRisks: Risk[] = [
      // HIGH RISK
      {
        type: "Missing Checkbox Selections",
        title: "Missing Checkbox Selections",
        description: "Missing Checkbox Selections in Claim Category",
        severity: "high",
        regulation: "BIA Subsection 124(2)",
        impact: "This creates ambiguity about the nature of the claim. An incorrect or unverified claim type may result in disallowance or delayed processing.",
        solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
        requiredAction: "Review and complete claim category selection",
        deadline: "Immediately upon filing or before the first creditors' meeting.",
        position: { 
          page: 1,
          x: 0.15, 
          y: 0.35, 
          width: 0.7, 
          height: 0.08 
        }
      },
      {
        type: "Missing Relatedness Declaration",
        title: "Missing Relatedness Declaration",
        description: "Missing Confirmation of Relatedness/Arm's-Length Status",
        severity: "high",
        regulation: "BIA Section 4(1) and Section 95",
        impact: "Required for assessing transfers and preferences under s.4 and s.95–96.",
        solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
        requiredAction: "Complete relatedness declaration section",
        deadline: "Immediately",
        position: { 
          page: 1,
          x: 0.15, 
          y: 0.45, 
          width: 0.7, 
          height: 0.08 
        }
      },
      {
        type: "Missing Transfer Disclosure",
        title: "Missing Transfer Disclosure",
        description: "No Disclosure of Transfers, Credits, or Payments",
        severity: "high",
        regulation: "BIA Section 96(1)",
        impact: "Required to assess preferential payments or transfers at undervalue.",
        solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions within the past 3–12 months.",
        requiredAction: "Complete transfer disclosure section",
        deadline: "Must be part of the Proof of Claim to be considered valid.",
        position: { 
          page: 1,
          x: 0.15, 
          y: 0.55, 
          width: 0.7, 
          height: 0.08 
        }
      },

      // MEDIUM RISK
      {
        type: "Date Format Error",
        title: "Date Format Error",
        description: "Incorrect or Incomplete Date Format",
        severity: "medium",
        regulation: "BIA Form Regulations Rule 1",
        impact: "Could invalidate the form due to ambiguity or perceived incompleteness.",
        solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\"",
        requiredAction: "Fix date format",
        deadline: "Before submission",
        position: { 
          page: 1,
          x: 0.2, 
          y: 0.7, 
          width: 0.5, 
          height: 0.05 
        }
      },
      {
        type: "Incomplete Trustee Declaration",
        title: "Incomplete Trustee Declaration",
        description: "Incomplete Trustee Declaration",
        severity: "medium",
        regulation: "BIA General Requirements",
        impact: "Weakens legal standing of the declaration.",
        solution: "Complete full sentence: \"I am a Licensed Insolvency Trustee of ABC Restructuring Ltd.\" and ensure proper signature of both trustee and witness.",
        requiredAction: "Complete trustee declaration",
        deadline: "3 days",
        position: { 
          page: 1,
          x: 0.1, 
          y: 0.78, 
          width: 0.8, 
          height: 0.07 
        }
      },

      // LOW RISK
      {
        type: "Missing Schedule A",
        title: "Missing Schedule A",
        description: "No Attached Schedule \"A\"",
        severity: "low",
        regulation: "BIA Subsection 124(2)",
        impact: "May delay claim acceptance if not provided to support the stated debt.",
        solution: "Attach a detailed account statement or affidavit showing calculation of amount owing, including any applicable interest or late fees.",
        requiredAction: "Attach Schedule A",
        deadline: "5 days"
      },
      {
        type: "Missing Trustee Report Checkbox",
        title: "Missing Trustee Report Checkbox",
        description: "Missing Checkbox for Trustee Discharge Report Request",
        severity: "low",
        regulation: "BIA Optional Requirements",
        impact: "Might miss delivery of discharge-related updates.",
        solution: "Tick if desired, but not mandatory for non-individual bankruptcies.",
        requiredAction: "Review checkbox options",
        deadline: "Optional"
      }
    ];

    setRisks(greenTechRisks);
  }, []);

  return risks;
};
