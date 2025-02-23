
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
  }
};
