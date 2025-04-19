
/**
 * Hook to provide specific risk information for GreenTech Form 31 documents
 */

import { useState, useEffect } from 'react';
import { Risk } from '../RiskAssessment/types';

export function useGreenTechForm31Risks(): Risk[] {
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    // These are the specific risks for the GreenTech Supplies Form 31 document
    setRisks([
      {
        type: "Missing Checkbox Selections",
        description: "None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.",
        severity: "high",
        regulation: "BIA Subsection 124(2)",
        solution: "Select the appropriate claim type checkbox (likely 'A. Unsecured Claim') and complete priority claim subfields if applicable.",
      },
      {
        type: "Missing Relatedness Declaration",
        description: "The declaration of whether the creditor is related to the debtor or dealt at arm's length is incomplete.",
        severity: "high",
        regulation: "BIA Section 4(1) and Section 95",
        solution: "Clearly indicate 'I am not related' and 'have not dealt at non-arm's length' (if true).",
      },
      {
        type: "No Disclosure of Transfers",
        description: "The response field is empty for transfers, credits, or payments within the past 3-12 months.",
        severity: "high",
        regulation: "BIA Section 96(1)",
        solution: "State 'None' if applicable or list any payments, credits, or undervalued transactions.",
      },
      {
        type: "Incorrect Date Format",
        description: "\"Dated at 2025, this 8 day of 0.\" is invalid.",
        severity: "medium",
        regulation: "BIA Form Regulations Rule 1",
        solution: "Correct to \"Dated at Toronto, this 8th day of April, 2025.\"",
      },
      {
        type: "Incomplete Trustee Declaration",
        description: "\"I am a creditor (or I am a Licensed Insolvency Trustee)\" is not finalized with a completed sentence or signature line.",
        severity: "medium",
        regulation: "BIA General Requirements",
        solution: "Complete full sentence: \"I am a Licensed Insolvency Trustee of ABC Restructuring Ltd.\" and ensure proper signature.",
      }
    ]);
  }, []);

  return risks;
}
