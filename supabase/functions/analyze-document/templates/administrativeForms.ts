
import { OSBFormTemplate } from "../types.ts";

export const administrativeForms: Record<string, OSBFormTemplate> = {
  "53": {
    formNumber: "53",
    title: "Notice of Appeal to Court of Appeal",
    category: "administrative",
    subcategory: "appeals",
    purpose: "Filing appeal notice",
    relatedForms: ["54", "55"],
    clientInfoFields: [
      "appellantName",
      "respondentName",
      "courtFileNumber"
    ],
    keyDates: [
      "decisionDate",
      "appealDeadline",
      "filingDate"
    ],
    monetaryFields: [
      "appealBondAmount",
      "estimatedCosts"
    ],
    requiredFields: [
      {
        name: "groundsForAppeal",
        type: "text",
        required: true,
        osbReference: "BIA.193",
        formNumbers: ["53"],
        description: "Detailed grounds for appeal"
      }
    ],
    riskIndicators: [
      {
        field: "appealDeadline",
        riskType: "legal",
        severity: "high",
        description: "Appeal filing deadline compliance",
        threshold: {
          type: "days",
          value: 10,
          comparison: "minimum",
          baseline: "decisionDate"
        }
      }
    ]
  },
  "54": {
    formNumber: "54",
    title: "Application for Consolidation Order",
    category: "administrative",
    subcategory: "consolidation",
    purpose: "Debt consolidation request",
    relatedForms: ["55", "56"],
    clientInfoFields: [
      "debtorName",
      "employmentInfo",
      "familyInfo"
    ],
    keyDates: [
      "applicationDate",
      "firstPaymentDate"
    ],
    monetaryFields: [
      "totalDebt",
      "monthlyPayment",
      "monthlyIncome",
      "monthlyExpenses"
    ],
    requiredFields: [
      {
        name: "financialStatement",
        type: "text",
        required: true,
        osbReference: "BIA.218",
        formNumbers: ["54"],
        description: "Current financial statement"
      }
    ],
    riskIndicators: [
      {
        field: "monthlyPayment",
        riskType: "financial",
        severity: "high",
        description: "Payment affordability analysis",
        threshold: {
          type: "percentage",
          value: 40,
          comparison: "maximum",
          baseline: "monthlyIncome"
        }
      }
    ]
  },
  "55": {
    formNumber: "55",
    title: "Notice of Taxation of Receiver's Accounts",
    category: "administrative",
    subcategory: "taxation",
    purpose: "Account taxation notice",
    relatedForms: ["42", "56"],
    clientInfoFields: [
      "receiverName",
      "estateInfo"
    ],
    keyDates: [
      "taxationDate",
      "objectionDeadline"
    ],
    monetaryFields: [
      "feesAmount",
      "disbursements",
      "totalCharges"
    ],
    requiredFields: [
      {
        name: "accountDetails",
        type: "text",
        required: true,
        osbReference: "BIA.249",
        formNumbers: ["55"],
        description: "Detailed account statement"
      }
    ],
    riskIndicators: [
      {
        field: "feesAmount",
        riskType: "financial",
        severity: "medium",
        description: "Fee reasonableness analysis",
        threshold: {
          type: "percentage",
          value: 15,
          comparison: "maximum",
          baseline: "estateValue"
        }
      }
    ]
  },
  "56": {
    formNumber: "56",
    title: "Notice of Hearing of Application for Bankruptcy Order",
    category: "administrative",
    subcategory: "hearings",
    purpose: "Bankruptcy hearing notification",
    relatedForms: ["1", "57"],
    clientInfoFields: [
      "applicantName",
      "respondentName",
      "courtLocation"
    ],
    keyDates: [
      "hearingDate",
      "serviceDeadline"
    ],
    monetaryFields: [
      "claimAmount",
      "securityValue"
    ],
    requiredFields: [
      {
        name: "hearingDetails",
        type: "text",
        required: true,
        osbReference: "BIA.43(5)",
        formNumbers: ["56"],
        description: "Hearing information"
      }
    ],
    riskIndicators: [
      {
        field: "serviceDeadline",
        riskType: "legal",
        severity: "high",
        description: "Service requirement compliance",
        threshold: {
          type: "days",
          value: 7,
          comparison: "minimum",
          baseline: "hearingDate"
        }
      }
    ]
  }
};
