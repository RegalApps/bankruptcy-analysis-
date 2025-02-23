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
  },
  "63": {
    formNumber: "63",
    title: "Notice of Impending Automatic Discharge of First-Time Bankrupt",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Discharge notification",
    relatedForms: ["64", "65"],
    clientInfoFields: [
      "bankruptName",
      "trusteeInfo",
      "estateNumber"
    ],
    keyDates: [
      "bankruptcyDate",
      "dischargeDate",
      "notificationDate"
    ],
    monetaryFields: [
      "totalClaims",
      "totalPayments",
      "surplusIncome"
    ],
    requiredFields: [
      {
        name: "complianceStatus",
        type: "text",
        required: true,
        osbReference: "BIA.168.1",
        formNumbers: ["63"],
        description: "Bankruptcy compliance status"
      },
      {
        name: "counselingSessions",
        type: "text",
        required: true,
        osbReference: "BIA.157.1",
        formNumbers: ["63"],
        description: "Counseling sessions completed"
      }
    ],
    riskIndicators: [
      {
        field: "notificationDate",
        riskType: "compliance",
        severity: "high",
        description: "Discharge notification timing",
        threshold: {
          type: "days",
          value: 60,
          comparison: "minimum",
          baseline: "dischargeDate"
        }
      }
    ]
  },
  "64": {
    formNumber: "64",
    title: "Report of Trustee on Bankrupt's Application for Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Discharge assessment",
    relatedForms: ["63", "65"],
    clientInfoFields: [
      "bankruptName",
      "trusteeInfo",
      "courtReference"
    ],
    keyDates: [
      "applicationDate",
      "reportDate",
      "hearingDate"
    ],
    monetaryFields: [
      "realizedAssets",
      "distributedAmount",
      "trusteeRemuneration"
    ],
    requiredFields: [
      {
        name: "conductAssessment",
        type: "text",
        required: true,
        osbReference: "BIA.170",
        formNumbers: ["64"],
        description: "Assessment of bankrupt's conduct"
      },
      {
        name: "recommendationDetails",
        type: "text",
        required: true,
        osbReference: "BIA.170",
        formNumbers: ["64"],
        description: "Trustee's recommendation"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeRemuneration",
        riskType: "financial",
        severity: "medium",
        description: "Remuneration analysis",
        threshold: {
          type: "percentage",
          value: 25,
          comparison: "maximum",
          baseline: "realizedAssets"
        }
      }
    ]
  },
  "65": {
    formNumber: "65",
    title: "Notice of Hearing of Application for Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Discharge hearing notification",
    relatedForms: ["63", "64"],
    clientInfoFields: [
      "bankruptName",
      "courtInfo",
      "creditorList"
    ],
    keyDates: [
      "hearingDate",
      "noticeDate",
      "oppositionDeadline"
    ],
    monetaryFields: [
      "outstandingClaims",
      "proposedSettlement"
    ],
    requiredFields: [
      {
        name: "hearingDetails",
        type: "text",
        required: true,
        osbReference: "BIA.169",
        formNumbers: ["65"],
        description: "Hearing location and time"
      },
      {
        name: "oppositionProcess",
        type: "text",
        required: true,
        osbReference: "BIA.169",
        formNumbers: ["65"],
        description: "Process for filing opposition"
      }
    ],
    riskIndicators: [
      {
        field: "noticeDate",
        riskType: "compliance",
        severity: "high",
        description: "Notice period compliance",
        threshold: {
          type: "days",
          value: 15,
          comparison: "minimum",
          baseline: "hearingDate"
        }
      },
      {
        field: "proposedSettlement",
        riskType: "financial",
        severity: "medium",
        description: "Settlement adequacy",
        threshold: {
          type: "percentage",
          value: 30,
          comparison: "minimum",
          baseline: "outstandingClaims"
        }
      }
    ]
  },
  "66": {
    formNumber: "66",
    title: "Notice of Conditional Order of Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Conditional discharge notification",
    relatedForms: ["63", "64", "65"],
    clientInfoFields: [
      "bankruptName",
      "courtInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "orderDate",
      "notificationDate",
      "conditionDeadline"
    ],
    monetaryFields: [
      "requiredPayment",
      "monthlyInstallment"
    ],
    requiredFields: [
      {
        name: "conditions",
        type: "text",
        required: true,
        osbReference: "BIA.172",
        formNumbers: ["66"],
        description: "Discharge conditions"
      },
      {
        name: "paymentSchedule",
        type: "text",
        required: true,
        osbReference: "BIA.172",
        formNumbers: ["66"],
        description: "Payment schedule details"
      }
    ],
    riskIndicators: [
      {
        field: "notificationDate",
        riskType: "compliance",
        severity: "high",
        description: "Order notification timing",
        threshold: {
          type: "days",
          value: 5,
          comparison: "maximum",
          baseline: "orderDate"
        }
      }
    ]
  },
  "67": {
    formNumber: "67",
    title: "Notice of Deemed Annulment of Bankruptcy",
    category: "administrative",
    subcategory: "annulment",
    purpose: "Bankruptcy annulment notice",
    relatedForms: ["66", "68"],
    clientInfoFields: [
      "bankruptName",
      "estateNumber",
      "creditorList"
    ],
    keyDates: [
      "bankruptcyDate",
      "annulmentDate",
      "noticeDate"
    ],
    monetaryFields: [
      "totalClaims",
      "totalPayments"
    ],
    requiredFields: [
      {
        name: "annulmentReason",
        type: "text",
        required: true,
        osbReference: "BIA.181",
        formNumbers: ["67"],
        description: "Reason for annulment"
      },
      {
        name: "effectiveDate",
        type: "date",
        required: true,
        osbReference: "BIA.181",
        formNumbers: ["67"],
        description: "Effective date of annulment"
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
          value: 10,
          comparison: "maximum",
          baseline: "annulmentDate"
        }
      }
    ]
  },
  "68": {
    formNumber: "68",
    title: "Notice of Final Dividend and Application for Discharge of Trustee",
    category: "administrative",
    subcategory: "dividend",
    purpose: "Final dividend distribution",
    relatedForms: ["66", "67"],
    clientInfoFields: [
      "trusteeInfo",
      "estateNumber",
      "creditorList"
    ],
    keyDates: [
      "applicationDate",
      "dividendDate",
      "objectionsDeadline"
    ],
    monetaryFields: [
      "totalEstate",
      "totalClaims",
      "dividendAmount",
      "trusteeRemuneration"
    ],
    requiredFields: [
      {
        name: "dividendDetails",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["68"],
        description: "Dividend calculation details"
      },
      {
        name: "remuneration",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["68"],
        description: "Trustee remuneration details"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeRemuneration",
        riskType: "financial",
        severity: "medium",
        description: "Remuneration analysis",
        threshold: {
          type: "percentage",
          value: 20,
          comparison: "maximum",
          baseline: "totalEstate"
        }
      },
      {
        field: "dividendAmount",
        riskType: "financial",
        severity: "high",
        description: "Dividend ratio analysis",
        threshold: {
          type: "percentage",
          value: 5,
          comparison: "minimum",
          baseline: "totalClaims"
        }
      }
    ]
  }
};
