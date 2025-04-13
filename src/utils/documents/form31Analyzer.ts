
import { AnalysisResult } from './types/analysisTypes';

/**
 * Analyzer for Form 31 - Proof of Claim documents
 * Based on BIA (Bankruptcy and Insolvency Act) requirements
 */
const analyzeForm31 = (title: string): AnalysisResult => {
  // This would be dynamically generated from real document OCR/analysis
  // For now we're using mock data
  return {
    structureValid: true,
    requiredFieldsPresent: true,
    signaturesValid: true,
    extracted_info: {
      clientName: "GreenTech Supplies Inc.",
      formNumber: "31",
      formType: "Proof of Claim",
      trusteeName: "James Wilson",
      dateSigned: "March 15, 2025",
      summary: "This Proof of Claim (Form 31) submitted by GreenTech Supplies Inc. claims $125,450 related to unpaid equipment and supply invoices. The claim includes supporting documents with invoice details and delivery confirmations. The claim has been properly signed by the authorized representative and includes required contact information.",
      submissionDeadline: "April 30, 2025",
      documentStatus: "Pending Review"
    },
    risks: [
      {
        type: "Missing Supporting Documentation",
        description: "No evidence of delivery confirmation attached for invoice #GT-7845.",
        severity: "high",
        regulation: "BIA Section 124(1)(b)",
        impact: "May delay claim processing or result in partial rejection",
        requiredAction: "Attach delivery confirmation for invoice #GT-7845",
        solution: "Upload signed delivery receipt or proof of service for invoice #GT-7845",
        position: { x: 0.35, y: 0.42, width: 0.3, height: 0.05 }
      },
      {
        type: "Incomplete Creditor Information",
        description: "Contact person's telephone number is missing from Section 1.",
        severity: "medium",
        regulation: "BIA General Rules s. 118(1)",
        impact: "May hinder communication regarding claim resolution",
        requiredAction: "Add contact telephone number",
        solution: "Complete Section 1 by adding required contact telephone number",
        position: { x: 0.15, y: 0.22, width: 0.25, height: 0.04 }
      },
      {
        type: "Potential Related Party Transaction",
        description: "No disclosure whether creditor is related to debtor under BIA s.4",
        severity: "high",
        regulation: "BIA Section 4",
        impact: "Could affect claim priority and scrutiny level",
        requiredAction: "Complete related party disclosure",
        solution: "Check appropriate box in Section 6 indicating related/non-related status",
        position: { x: 0.6, y: 0.65, width: 0.2, height: 0.04 }
      },
      {
        type: "Missing Security Documentation",
        description: "Claim indicates secured status but no security documentation attached",
        severity: "high",
        regulation: "BIA Section 128(3)",
        impact: "Claim may be processed as unsecured if security not proven",
        requiredAction: "Attach security agreement documentation",
        solution: "Upload security agreement and proof of registration (PPSA)",
        position: { x: 0.3, y: 0.55, width: 0.35, height: 0.06 }
      }
    ],
    regulatoryCompliance: {
      status: 'non_compliant',
      details: 'This document has compliance issues that must be addressed before submission.',
      references: [
        'BIA Section 124(1)(b) - Supporting documentation requirements',
        'BIA Section 4 - Related party disclosures',
        'BIA Section 128(3) - Security documentation requirements'
      ]
    }
  };
};

export default analyzeForm31;
