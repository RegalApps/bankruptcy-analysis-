import { OSBFormTemplate } from "../types.ts";

export const specializedForms: Record<string, OSBFormTemplate> = {
  "90": {
    formNumber: "90",
    title: "Certificate of Full Performance of Consumer Proposal",
    category: "specialized",
    subcategory: "consumer_proposal",
    purpose: "Proposal completion certification",
    relatedForms: ["91", "92"],
    clientInfoFields: [
      "debtorName",
      "trusteeInfo",
      "estateNumber"
    ],
    keyDates: [
      "completionDate",
      "startDate",
      "certificateDate"
    ],
    monetaryFields: [
      "totalPaid",
      "originalProposal",
      "distributionAmount"
    ],
    requiredFields: [
      {
        name: "completionConfirmation",
        type: "text",
        required: true,
        osbReference: "BIA.66.4",
        formNumbers: ["90"],
        description: "Confirmation of proposal completion"
      }
    ],
    riskIndicators: [
      {
        field: "distributionAmount",
        riskType: "financial",
        severity: "medium",
        description: "Distribution accuracy verification",
        threshold: {
          type: "percentage",
          value: 95,
          comparison: "minimum",
          baseline: "originalProposal"
        }
      }
    ]
  },
  "91": {
    formNumber: "91",
    title: "Notice of Default of Consumer Proposal",
    category: "specialized",
    subcategory: "consumer_proposal",
    purpose: "Default notification",
    relatedForms: ["90", "92"],
    clientInfoFields: [
      "debtorName",
      "creditorInfo"
    ],
    keyDates: [
      "defaultDate",
      "remedyDeadline"
    ],
    monetaryFields: [
      "missedPayments",
      "totalArrears"
    ],
    requiredFields: [
      {
        name: "defaultReason",
        type: "text",
        required: true,
        osbReference: "BIA.66.31",
        formNumbers: ["91"],
        description: "Reason for default"
      }
    ],
    riskIndicators: [
      {
        field: "remedyDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Default remedy timeline",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "defaultDate"
        }
      }
    ]
  },
  "92": {
    formNumber: "92",
    title: "Affidavit of Service",
    category: "specialized",
    subcategory: "legal_documentation",
    purpose: "Document service verification",
    relatedForms: ["93", "94"],
    clientInfoFields: [
      "serverName",
      "recipientName",
      "documentDescription"
    ],
    keyDates: [
      "serviceDate",
      "affidavitDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "serviceMethod",
        type: "text",
        required: true,
        osbReference: "BIA.R71",
        formNumbers: ["92"],
        description: "Method of service details"
      },
      {
        name: "serviceLocation",
        type: "text",
        required: true,
        osbReference: "BIA.R71",
        formNumbers: ["92"],
        description: "Location of service"
      }
    ],
    riskIndicators: [
      {
        field: "serviceDate",
        riskType: "legal",
        severity: "high",
        description: "Service timing compliance",
        threshold: {
          type: "days",
          value: 1,
          comparison: "maximum",
          baseline: "affidavitDate"
        }
      }
    ]
  },
  "93": {
    formNumber: "93",
    title: "Application for Review of Trustee's Decision",
    category: "specialized",
    subcategory: "dispute_resolution",
    purpose: "Decision review request",
    relatedForms: ["92", "94"],
    clientInfoFields: [
      "applicantName",
      "trusteeName",
      "estateReference"
    ],
    keyDates: [
      "decisionDate",
      "applicationDate",
      "reviewDeadline"
    ],
    monetaryFields: [
      "disputedAmount",
      "securityPosted"
    ],
    requiredFields: [
      {
        name: "decisionDetails",
        type: "text",
        required: true,
        osbReference: "BIA.37",
        formNumbers: ["93"],
        description: "Details of disputed decision"
      },
      {
        name: "groundsForReview",
        type: "text",
        required: true,
        osbReference: "BIA.37",
        formNumbers: ["93"],
        description: "Grounds for review request"
      }
    ],
    riskIndicators: [
      {
        field: "applicationDate",
        riskType: "legal",
        severity: "high",
        description: "Application deadline compliance",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "decisionDate"
        }
      },
      {
        field: "securityPosted",
        riskType: "financial",
        severity: "medium",
        description: "Security deposit adequacy",
        threshold: {
          type: "percentage",
          value: 100,
          comparison: "minimum",
          baseline: "disputedAmount"
        }
      }
    ]
  },
  "94": {
    formNumber: "94",
    title: "Notice of Stay of Proceedings",
    category: "specialized",
    subcategory: "legal_proceedings",
    purpose: "Stay notification",
    relatedForms: ["92", "93"],
    clientInfoFields: [
      "debtorName",
      "creditorNames",
      "courtReference"
    ],
    keyDates: [
      "stayDate",
      "noticeDate",
      "expiryDate"
    ],
    monetaryFields: [
      "affectedClaims",
      "exemptedClaims"
    ],
    requiredFields: [
      {
        name: "stayScope",
        type: "text",
        required: true,
        osbReference: "BIA.69",
        formNumbers: ["94"],
        description: "Scope of stay order"
      },
      {
        name: "exemptions",
        type: "text",
        required: true,
        osbReference: "BIA.69",
        formNumbers: ["94"],
        description: "Stay exemptions"
      }
    ],
    riskIndicators: [
      {
        field: "noticeDate",
        riskType: "compliance",
        severity: "high",
        description: "Notice timing compliance",
        threshold: {
          type: "days",
          value: 5,
          comparison: "maximum",
          baseline: "stayDate"
        }
      },
      {
        field: "exemptedClaims",
        riskType: "financial",
        severity: "medium",
        description: "Exempted claims analysis",
        threshold: {
          type: "percentage",
          value: 25,
          comparison: "maximum",
          baseline: "affectedClaims"
        }
      }
    ]
  }
};
