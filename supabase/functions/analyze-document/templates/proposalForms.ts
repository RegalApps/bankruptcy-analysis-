import { OSBFormTemplate } from '../types';

export const proposalForms: Record<string, OSBFormTemplate> = {
  "31": {
    title: "Consumer Proposal",
    description: "Consumer proposal document under the BIA",
    requiredFields: [
      { name: "debtorName", type: "string", required: true },
      { name: "proposalDate", type: "date", required: true },
      { name: "monthlyPayment", type: "number", required: true }
    ],
    keyDates: ["proposalDate", "firstPaymentDate"],
    monetaryFields: ["monthlyPayment", "totalProposalAmount"],
    riskIndicators: [
      {
        field: "monthlyPayment",
        riskType: "financial",
        threshold: 1000,
        severity: "medium"
      }
    ]
  },
  "32": {
    formNumber: "32",
    title: "Division I Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Formal business proposal to creditors",
    relatedForms: ["33", "34", "35"],
    clientInfoFields: [
      "debtorName",
      "businessType",
      "trusteeInfo"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "votingDate"
    ],
    monetaryFields: [
      "proposedPayment",
      "totalClaims",
      "expectedDividend"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.62(1)",
        formNumbers: ["33"],
        description: "Detailed proposal terms"
      }
    ],
    riskIndicators: [
      {
        field: "expectedDividend",
        riskType: "financial",
        severity: "high",
        description: "Dividend feasibility analysis"
      }
    ]
  },
  "33": {
    formNumber: "33",
    title: "Division I Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Formal business proposal to creditors",
    relatedForms: ["32", "34", "35"],
    clientInfoFields: [
      "debtorName",
      "businessType",
      "trusteeInfo"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "votingDate"
    ],
    monetaryFields: [
      "proposedPayment",
      "totalClaims",
      "expectedDividend"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.62(1)",
        formNumbers: ["33"],
        description: "Detailed proposal terms"
      }
    ],
    riskIndicators: [
      {
        field: "expectedDividend",
        riskType: "financial",
        severity: "high",
        description: "Dividend feasibility analysis"
      }
    ]
  },
  "34": {
    formNumber: "34",
    title: "Notice of Division I Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Notification of proposal to creditors",
    relatedForms: ["33", "35"],
    clientInfoFields: [
      "debtorName",
      "trusteeContact"
    ],
    keyDates: [
      "meetingDate",
      "votingDeadline"
    ],
    monetaryFields: [
      "estimatedDividend"
    ],
    requiredFields: [
      {
        name: "meetingDetails",
        type: "text",
        required: true,
        osbReference: "BIA.51(1)",
        formNumbers: ["34"],
        description: "Creditors' meeting information"
      }
    ],
    riskIndicators: [
      {
        field: "votingDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Voting deadline compliance"
      }
    ]
  },
  "35": {
    formNumber: "35",
    title: "Division I Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Formal business proposal to creditors",
    relatedForms: ["32", "33", "34"],
    clientInfoFields: [
      "debtorName",
      "businessType",
      "trusteeInfo"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "votingDate"
    ],
    monetaryFields: [
      "proposedPayment",
      "totalClaims",
      "expectedDividend"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.62(1)",
        formNumbers: ["33"],
        description: "Detailed proposal terms"
      }
    ],
    riskIndicators: [
      {
        field: "expectedDividend",
        riskType: "financial",
        severity: "high",
        description: "Dividend feasibility analysis"
      }
    ]
  }
};
