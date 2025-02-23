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
  },
  "57": {
    formNumber: "57",
    title: "Trustee's Final Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "financial_reporting",
    purpose: "Final estate accounting",
    relatedForms: ["58", "59"],
    clientInfoFields: [
      "trusteeName",
      "estateNumber",
      "bankruptName"
    ],
    keyDates: [
      "statementDate",
      "periodStart",
      "periodEnd",
      "dischargeDate"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements",
      "trusteeRemuneration",
      "dividendAmount"
    ],
    requiredFields: [
      {
        name: "receiptsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["57"],
        description: "Detailed breakdown of receipts"
      },
      {
        name: "disbursementsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["57"],
        description: "Detailed breakdown of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeRemuneration",
        riskType: "financial",
        severity: "high",
        description: "Trustee fee analysis",
        threshold: {
          type: "percentage",
          value: 20,
          comparison: "maximum",
          baseline: "totalReceipts"
        }
      },
      {
        field: "dividendAmount",
        riskType: "financial",
        severity: "medium",
        description: "Dividend distribution verification",
        threshold: {
          type: "percentage",
          value: 95,
          comparison: "minimum",
          baseline: "availableFunds"
        }
      }
    ]
  },
  "58": {
    formNumber: "58",
    title: "Interim Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "financial_reporting",
    purpose: "Periodic estate accounting",
    relatedForms: ["57", "59"],
    clientInfoFields: [
      "trusteeName",
      "estateNumber"
    ],
    keyDates: [
      "reportingDate",
      "periodStart",
      "periodEnd"
    ],
    monetaryFields: [
      "periodReceipts",
      "periodDisbursements",
      "cumulativeReceipts",
      "cumulativeDisbursements",
      "cashBalance"
    ],
    requiredFields: [
      {
        name: "periodTransactions",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["58"],
        description: "Period transaction details"
      }
    ],
    riskIndicators: [
      {
        field: "cashBalance",
        riskType: "financial",
        severity: "medium",
        description: "Cash management analysis",
        threshold: {
          type: "absolute",
          value: 10000,
          comparison: "maximum"
        }
      }
    ]
  },
  "59": {
    formNumber: "59",
    title: "Notice of Taxable Distribution",
    category: "administrative",
    subcategory: "taxation",
    purpose: "Tax reporting for distributions",
    relatedForms: ["57", "58"],
    clientInfoFields: [
      "trusteeName",
      "creditorInfo",
      "taxYear"
    ],
    keyDates: [
      "distributionDate",
      "taxYearEnd",
      "reportingDeadline"
    ],
    monetaryFields: [
      "distributionAmount",
      "taxableAmount",
      "withholdingAmount"
    ],
    requiredFields: [
      {
        name: "taxCalculation",
        type: "text",
        required: true,
        osbReference: "ITA.150",
        formNumbers: ["59"],
        description: "Tax calculation details"
      }
    ],
    riskIndicators: [
      {
        field: "withholdingAmount",
        riskType: "compliance",
        severity: "high",
        description: "Tax withholding compliance",
        threshold: {
          type: "percentage",
          value: 25,
          comparison: "exact",
          baseline: "taxableAmount"
        }
      }
    ]
  },
  "60": {
    formNumber: "60",
    title: "Assignment for the General Benefit of Creditors",
    category: "administrative",
    subcategory: "creditor_rights",
    purpose: "Voluntary assignment",
    relatedForms: ["61", "62"],
    clientInfoFields: [
      "debtorName",
      "assigneeName",
      "creditorList"
    ],
    keyDates: [
      "assignmentDate",
      "acceptanceDate",
      "notificationDeadline"
    ],
    monetaryFields: [
      "totalAssets",
      "totalLiabilities",
      "estimatedDeficiency"
    ],
    requiredFields: [
      {
        name: "assetList",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["60"],
        description: "List of assigned assets"
      },
      {
        name: "creditorSchedule",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["60"],
        description: "Schedule of creditors"
      }
    ],
    riskIndicators: [
      {
        field: "notificationDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Creditor notification compliance",
        threshold: {
          type: "days",
          value: 5,
          comparison: "maximum",
          baseline: "assignmentDate"
        }
      },
      {
        field: "estimatedDeficiency",
        riskType: "financial",
        severity: "medium",
        description: "Asset deficiency analysis",
        threshold: {
          type: "percentage",
          value: 50,
          comparison: "maximum",
          baseline: "totalLiabilities"
        }
      }
    ]
  },
  "61": {
    formNumber: "61",
    title: "Certificate of Independent Legal Advice",
    category: "administrative",
    subcategory: "legal_compliance",
    purpose: "Legal advice verification",
    relatedForms: ["60", "62"],
    clientInfoFields: [
      "clientName",
      "lawyerName",
      "lawFirm"
    ],
    keyDates: [
      "consultationDate",
      "certificationDate"
    ],
    monetaryFields: [
      "consultationFee"
    ],
    requiredFields: [
      {
        name: "adviceScope",
        type: "text",
        required: true,
        osbReference: "BIA.R104",
        formNumbers: ["61"],
        description: "Scope of legal advice provided"
      },
      {
        name: "clientUnderstanding",
        type: "text",
        required: true,
        osbReference: "BIA.R104",
        formNumbers: ["61"],
        description: "Confirmation of client understanding"
      }
    ],
    riskIndicators: [
      {
        field: "certificationDate",
        riskType: "legal",
        severity: "high",
        description: "Certification timing verification",
        threshold: {
          type: "days",
          value: 1,
          comparison: "maximum",
          baseline: "consultationDate"
        }
      }
    ]
  },
  "62": {
    formNumber: "62",
    title: "Notice of Intention to Enforce Security",
    category: "administrative",
    subcategory: "secured_creditors",
    purpose: "Security enforcement notice",
    relatedForms: ["60", "61"],
    clientInfoFields: [
      "securedCreditorName",
      "debtorName",
      "securityDescription"
    ],
    keyDates: [
      "noticeDate",
      "enforcementDate",
      "responseDeadline"
    ],
    monetaryFields: [
      "securedAmount",
      "estimatedValue",
      "enforcementCosts"
    ],
    requiredFields: [
      {
        name: "securityDetails",
        type: "text",
        required: true,
        osbReference: "BIA.244",
        formNumbers: ["62"],
        description: "Details of security being enforced"
      }
    ],
    riskIndicators: [
      {
        field: "enforcementDate",
        riskType: "compliance",
        severity: "high",
        description: "Notice period compliance",
        threshold: {
          type: "days",
          value: 10,
          comparison: "minimum",
          baseline: "noticeDate"
        }
      },
      {
        field: "estimatedValue",
        riskType: "financial",
        severity: "medium",
        description: "Security valuation analysis",
        threshold: {
          type: "percentage",
          value: 120,
          comparison: "minimum",
          baseline: "securedAmount"
        }
      }
    ]
  }
};
