
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
  },
  "47": {
    formNumber: "47",
    title: "Consumer Proposal",
    category: "proposal",
    subcategory: "consumer_proposal",
    purpose: "Formal proposal submitted by a consumer debtor to creditors",
    legislation: "Paragraph 66.13(2)(c) of the Bankruptcy and Insolvency Act",
    relatedForms: ["47.1", "48", "49"],
    clientInfoFields: [
      "consumerDebtorName",
      "administratorName",
      "administratorAddress"
    ],
    keyDates: [
      "filingDate",
      "submissionDeadline",
      "firstPaymentDate"
    ],
    monetaryFields: [
      "securedCreditorsPayment",
      "preferredClaimsPayment",
      "administratorFees",
      "unsecuredCreditorsPayment"
    ],
    requiredFields: [
      {
        name: "consumerDebtorName",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)",
        formNumbers: ["47"],
        description: "Consumer debtor's full legal name"
      },
      {
        name: "administratorName",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)",
        formNumbers: ["47"],
        description: "Administrator's full name"
      },
      {
        name: "securedCreditorsPayment",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)(c)",
        formNumbers: ["47"],
        description: "Terms for secured creditors payment"
      },
      {
        name: "preferredClaimsPayment",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)(c)",
        formNumbers: ["47"],
        description: "Terms for preferred claims payment"
      },
      {
        name: "administratorFees",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)(c)",
        formNumbers: ["47"],
        description: "Administrator fees and expenses"
      },
      {
        name: "unsecuredCreditorsPayment",
        type: "text",
        required: true,
        osbReference: "BIA.66.14",
        formNumbers: ["47"],
        description: "Payment schedule for unsecured creditors"
      },
      {
        name: "dividendDistribution",
        type: "text",
        required: true,
        osbReference: "BIA.66.15",
        formNumbers: ["47"],
        description: "Dividend distribution schedule"
      },
      {
        name: "submissionDeadline",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)",
        formNumbers: ["47"],
        description: "Deadline for proposal submission"
      },
      {
        name: "clientName",
        type: "text",
        required: true,
        osbReference: "BIA.66.13(2)",
        formNumbers: ["47"],
        description: "Consumer debtor name for client folder creation"
      }
    ],
    riskIndicators: [
      {
        field: "securedCreditorsPayment",
        riskType: "compliance",
        severity: "high",
        description: "Missing secured creditors payment terms",
        deadline: "Immediately",
        regulation: "BIA Sec. 66.13(2)(c)",
        impact: "Non-compliance with BIA requirements",
        requiredAction: "Specify how secured debts will be paid",
        solution: "Add detailed payment terms for all secured creditors"
      },
      {
        field: "unsecuredCreditorsPayment",
        riskType: "compliance",
        severity: "high",
        description: "Missing unsecured creditors payment plan",
        deadline: "Immediately",
        regulation: "BIA Sec. 66.14",
        impact: "Proposal will be invalid under BIA",
        requiredAction: "Add a structured payment plan for unsecured creditors",
        solution: "Create a detailed payment schedule"
      },
      {
        field: "dividendDistribution",
        riskType: "compliance",
        severity: "high",
        description: "Missing dividend distribution schedule",
        deadline: "Before submission",
        regulation: "BIA Sec. 66.15",
        impact: "Fails to meet regulatory distribution rules",
        requiredAction: "Define how funds will be distributed",
        solution: "Create a dividend distribution schedule"
      },
      {
        field: "administratorFees",
        riskType: "compliance",
        severity: "medium",
        description: "Administrator fees not specified",
        deadline: "7 days",
        regulation: "BIA Director's Directive 6R3",
        impact: "Can delay approval from OSB",
        requiredAction: "Detail administrator fees",
        solution: "Specify fees in accordance with regulatory guidelines"
      },
      {
        field: "witness",
        riskType: "legal",
        severity: "medium",
        description: "Proposal not signed by witness",
        deadline: "Before final submission",
        regulation: "BIA Sec. 66.13(2)(d)",
        impact: "May cause legal delays",
        requiredAction: "Ensure a witness signs the document",
        solution: "Get witness signature before final submission"
      },
      {
        field: "additionalTerms",
        riskType: "compliance",
        severity: "low",
        description: "No additional terms specified",
        deadline: "Before submission",
        regulation: "BIA Sec. 66.13(2)(c)",
        impact: "Could affect unique creditor agreements",
        requiredAction: "Consider adding custom clauses",
        solution: "Add relevant terms if applicable to this case"
      },
      {
        field: "submissionDeadline",
        riskType: "deadline",
        severity: "high",
        description: "Approaching submission deadline",
        deadline: "As specified",
        regulation: "BIA Sec. 66.13",
        impact: "Missing the deadline will invalidate the proposal",
        requiredAction: "Complete all required fields",
        solution: "Finalize document before the deadline"
      }
    ],
    deadlineManagement: {
      submissionDeadline: {
        daysBeforeWarning: 7,
        criticalWarningDays: 3,
        notificationType: "high_priority"
      }
    },
    signatureRequirements: {
      required: true,
      parties: ["debtor", "administrator", "witness"],
      workflow: "sequential"
    }
  }
};
