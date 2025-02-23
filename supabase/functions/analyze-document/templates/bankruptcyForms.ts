
import { OSBFormTemplate } from "../types.ts";

export const bankruptcyForms: Record<string, OSBFormTemplate> = {
  "1": {
    formNumber: "1",
    title: "Assignment for the General Benefit of Creditors",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Voluntary assignment into bankruptcy",
    relatedForms: ["2", "3", "4"],
    clientInfoFields: [
      "debtorName",
      "debtorAddress",
      "occupation",
      "businessName"
    ],
    keyDates: [
      "filingDate",
      "assignmentDate",
      "firstMeetingDate"
    ],
    monetaryFields: [
      "totalLiabilities",
      "totalAssets",
      "monthlyIncome",
      "monthlyExpenses"
    ],
    requiredFields: [
      {
        name: "debtorSignature",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["1"],
        description: "Debtor's signature on assignment"
      }
    ],
    riskIndicators: [
      {
        field: "totalAssets",
        riskType: "financial",
        severity: "high",
        description: "Asset valuation discrepancy"
      }
    ]
  },
  "5": {
    formNumber: "5",
    title: "Notice of Bankruptcy and First Meeting of Creditors",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Notification of bankruptcy and creditors meeting",
    relatedForms: ["1", "2", "6"],
    clientInfoFields: [
      "debtorName",
      "estateNumber",
      "trusteeName"
    ],
    keyDates: [
      "bankruptcyDate",
      "meetingDate",
      "meetingTime",
      "noticeDate"
    ],
    monetaryFields: [
      "estimatedAssets",
      "estimatedLiabilities"
    ],
    requiredFields: [
      {
        name: "meetingLocation",
        type: "text",
        required: true,
        osbReference: "BIA.102(1)",
        formNumbers: ["5"],
        description: "Location of first meeting"
      }
    ],
    riskIndicators: [
      {
        field: "meetingDate",
        riskType: "compliance",
        severity: "high",
        description: "Meeting schedule compliance"
      }
    ]
  },
  "6": {
    formNumber: "6",
    title: "Notice to Creditor of Impending First Meeting",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Individual creditor notification",
    relatedForms: ["5", "7"],
    clientInfoFields: [
      "creditorName",
      "creditorAddress",
      "estateReference"
    ],
    keyDates: [
      "meetingDate",
      "proofDueDate"
    ],
    monetaryFields: [
      "claimAmount"
    ],
    requiredFields: [
      {
        name: "creditorNotification",
        type: "text",
        required: true,
        osbReference: "BIA.102(2)",
        formNumbers: ["6"],
        description: "Creditor notification details"
      }
    ],
    riskIndicators: [
      {
        field: "proofDueDate",
        riskType: "legal",
        severity: "medium",
        description: "Proof of claim deadline"
      }
    ]
  },
  "7": {
    formNumber: "7",
    title: "List of Creditors",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Comprehensive creditor listing",
    relatedForms: ["1", "5", "6"],
    clientInfoFields: [
      "debtorName",
      "estateNumber"
    ],
    keyDates: [
      "listDate"
    ],
    monetaryFields: [
      "totalUnsecured",
      "totalSecured",
      "totalPreferred"
    ],
    requiredFields: [
      {
        name: "creditorDetails",
        type: "text",
        required: true,
        osbReference: "BIA.50(1.3)",
        formNumbers: ["7"],
        description: "Complete creditor information"
      }
    ],
    riskIndicators: [
      {
        field: "totalUnsecured",
        riskType: "financial",
        severity: "medium",
        description: "Unsecured debt ratio analysis"
      }
    ]
  },
  "8": {
    formNumber: "8",
    title: "Notice of Extension of Time for Filing a Proposal",
    category: "bankruptcy",
    subcategory: "business_bankruptcy",
    purpose: "Extension request for proposal filing",
    relatedForms: ["32", "33"],
    clientInfoFields: [
      "debtorName",
      "trusteeInfo"
    ],
    keyDates: [
      "currentDeadline",
      "extensionDate",
      "hearingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "extensionReason",
        type: "text",
        required: true,
        osbReference: "BIA.50.4(9)",
        formNumbers: ["8"],
        description: "Justification for extension"
      }
    ],
    riskIndicators: [
      {
        field: "extensionDate",
        riskType: "legal",
        severity: "high",
        description: "Extension timeline compliance"
      }
    ]
  }
};
