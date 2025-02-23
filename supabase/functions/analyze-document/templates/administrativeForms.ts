import { OSBFormTemplate } from "../types.ts";

export const administrativeForms: Record<string, OSBFormTemplate> = {
  "53": {
    formNumber: "53",
    title: "Statement of Affairs",
    category: "administrative",
    subcategory: "financial",
    purpose: "Financial disclosure",
    relatedForms: ["54", "55"],
    clientInfoFields: [
      "debtorName",
      "address",
      "occupation"
    ],
    keyDates: [
      "statementDate",
      "assessmentDate"
    ],
    monetaryFields: [
      "totalAssets",
      "totalLiabilities",
      "estimatedDeficiency"
    ],
    requiredFields: [
      {
        name: "declaration",
        type: "text",
        required: true,
        osbReference: "BIA.128",
        formNumbers: ["53"],
        description: "Debtor's declaration of accuracy"
      },
      {
        name: "signature",
        type: "signature",
        required: true,
        osbReference: "BIA.128",
        formNumbers: ["53"],
        description: "Debtor's signature"
      }
    ],
    riskIndicators: [
      {
        field: "estimatedDeficiency",
        riskType: "financial",
        severity: "high",
        description: "Significant deficiency",
        threshold: {
          type: "amount",
          value: 100000,
          comparison: "maximum"
        }
      }
    ]
  },
  "54": {
    formNumber: "54",
    title: "Proof of Claim",
    category: "administrative",
    subcategory: "claims",
    purpose: "Creditor claim submission",
    relatedForms: ["53", "55"],
    clientInfoFields: [
      "creditorName",
      "address",
      "contactPerson"
    ],
    keyDates: [
      "claimDate",
      "responseDeadline"
    ],
    monetaryFields: [
      "claimAmount",
      "interestRate",
      "totalDue"
    ],
    requiredFields: [
      {
        name: "basisOfClaim",
        type: "text",
        required: true,
        osbReference: "BIA.81",
        formNumbers: ["54"],
        description: "Legal basis for the claim"
      },
      {
        name: "supportingDocuments",
        type: "file",
        required: false,
        osbReference: "BIA.81",
        formNumbers: ["54"],
        description: "Attachments supporting the claim"
      }
    ],
    riskIndicators: [
      {
        field: "claimAmount",
        riskType: "financial",
        severity: "medium",
        description: "Large claim amount",
        threshold: {
          type: "amount",
          value: 50000,
          comparison: "maximum"
        }
      }
    ]
  },
  "55": {
    formNumber: "55",
    title: "Proxy Form",
    category: "administrative",
    subcategory: "voting",
    purpose: "Authorization for voting",
    relatedForms: ["53", "54"],
    clientInfoFields: [
      "creditorName",
      "proxyHolderName",
      "meetingDetails"
    ],
    keyDates: [
      "meetingDate",
      "proxyGrantDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "votingInstructions",
        type: "text",
        required: true,
        osbReference: "BIA.102",
        formNumbers: ["55"],
        description: "Specific voting instructions"
      },
      {
        name: "proxyLimitations",
        type: "text",
        required: false,
        osbReference: "BIA.102",
        formNumbers: ["55"],
        description: "Limitations on proxy's authority"
      }
    ],
    riskIndicators: [
      {
        field: "proxyGrantDate",
        riskType: "compliance",
        severity: "low",
        description: "Late proxy submission",
        threshold: {
          type: "days",
          value: 2,
          comparison: "maximum",
          baseline: "meetingDate"
        }
      }
    ]
  },
  "56": {
    formNumber: "56",
    title: "Notice of Bankruptcy",
    category: "administrative",
    subcategory: "notification",
    purpose: "Official bankruptcy notification",
    relatedForms: [],
    clientInfoFields: [
      "bankruptName",
      "trusteeName",
      "estateNumber"
    ],
    keyDates: [
      "bankruptcyDate",
      "meetingOfCreditorsDate"
    ],
    monetaryFields: [
      "estimatedAssets",
      "estimatedLiabilities"
    ],
    requiredFields: [
      {
        name: "courtJurisdiction",
        type: "text",
        required: true,
        osbReference: "BIA.71",
        formNumbers: ["56"],
        description: "Court handling the bankruptcy"
      },
      {
        name: "trusteeContact",
        type: "contact",
        required: true,
        osbReference: "BIA.71",
        formNumbers: ["56"],
        description: "Trustee's contact information"
      }
    ],
    riskIndicators: [
      {
        field: "estimatedLiabilities",
        riskType: "financial",
        severity: "medium",
        description: "High liability amount",
        threshold: {
          type: "amount",
          value: 250000,
          comparison: "maximum"
        }
      }
    ]
  },
  "57": {
    formNumber: "57",
    title: "Bankruptcy Application",
    category: "legal",
    subcategory: "application",
    purpose: "Formal bankruptcy request",
    relatedForms: [],
    clientInfoFields: [
      "applicantName",
      "address",
      "socialInsuranceNumber"
    ],
    keyDates: [
      "applicationDate",
      "assessmentDate"
    ],
    monetaryFields: [
      "totalDebt",
      "monthlyIncome",
      "monthlyExpenses"
    ],
    requiredFields: [
      {
        name: "reasonForBankruptcy",
        type: "text",
        required: true,
        osbReference: "BIA.43",
        formNumbers: ["57"],
        description: "Explanation for bankruptcy filing"
      },
      {
        name: "assetDetails",
        type: "text",
        required: true,
        osbReference: "BIA.43",
        formNumbers: ["57"],
        description: "Details of all assets"
      }
    ],
    riskIndicators: [
      {
        field: "totalDebt",
        riskType: "financial",
        severity: "high",
        description: "Excessive debt level",
        threshold: {
          type: "amount",
          value: 500000,
          comparison: "maximum"
        }
      }
    ]
  },
  "58": {
    formNumber: "58",
    title: "Creditor's Proposal",
    category: "legal",
    subcategory: "proposal",
    purpose: "Offer to creditors",
    relatedForms: [],
    clientInfoFields: [
      "debtorName",
      "trusteeName",
      "creditorList"
    ],
    keyDates: [
      "proposalDate",
      "acceptanceDeadline"
    ],
    monetaryFields: [
      "proposalAmount",
      "totalDebt",
      "paymentTerms"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        formNumbers: ["58"],
        description: "Detailed terms of the proposal"
      },
      {
        name: "creditorVotingInstructions",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        formNumbers: ["58"],
        description: "Instructions for creditors to vote"
      }
    ],
    riskIndicators: [
      {
        field: "proposalAmount",
        riskType: "financial",
        severity: "medium",
        description: "Low proposal amount",
        threshold: {
          type: "percentage",
          value: 25,
          comparison: "minimum",
          baseline: "totalDebt"
        }
      }
    ]
  },
  "59": {
    formNumber: "59",
    title: "Trustee's Report on Proposal",
    category: "administrative",
    subcategory: "reporting",
    purpose: "Trustee's assessment of proposal",
    relatedForms: ["58"],
    clientInfoFields: [
      "debtorName",
      "trusteeName",
      "creditorList"
    ],
    keyDates: [
      "reportDate",
      "creditorMeetingDate"
    ],
    monetaryFields: [
      "estimatedRecovery",
      "trusteeFees",
      "expenses"
    ],
    requiredFields: [
      {
        name: "trusteeOpinion",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        formNumbers: ["59"],
        description: "Trustee's opinion on the proposal"
      },
      {
        name: "creditorRecommendations",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        formNumbers: ["59"],
        description: "Recommendations for creditors"
      }
    ],
    riskIndicators: [
      {
        field: "estimatedRecovery",
        riskType: "financial",
        severity: "medium",
        description: "Low recovery estimate",
        threshold: {
          type: "percentage",
          value: 30,
          comparison: "minimum",
          baseline: "totalDebt"
        }
      }
    ]
  },
  "60": {
    formNumber: "60",
    title: "Minutes of Creditors' Meeting",
    category: "administrative",
    subcategory: "meeting",
    purpose: "Record of meeting proceedings",
    relatedForms: ["58", "59"],
    clientInfoFields: [
      "debtorName",
      "trusteeName",
      "meetingLocation"
    ],
    keyDates: [
      "meetingDate",
      "minutesDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "attendees",
        type: "list",
        required: true,
        osbReference: "BIA.102",
        formNumbers: ["60"],
        description: "List of attendees"
      },
      {
        name: "resolutionsPassed",
        type: "text",
        required: true,
        osbReference: "BIA.102",
        formNumbers: ["60"],
        description: "Summary of resolutions"
      }
    ],
    riskIndicators: [
      {
        field: "meetingDate",
        riskType: "compliance",
        severity: "low",
        description: "Delay in minutes preparation",
        threshold: {
          type: "days",
          value: 7,
          comparison: "maximum",
          baseline: "minutesDate"
        }
      }
    ]
  },
  "61": {
    formNumber: "61",
    title: "Order for Examination",
    category: "legal",
    subcategory: "examination",
    purpose: "Court order for examination",
    relatedForms: [],
    clientInfoFields: [
      "examineeName",
      "examinerName",
      "courtDetails"
    ],
    keyDates: [
      "examinationDate",
      "orderDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "scopeOfExamination",
        type: "text",
        required: true,
        osbReference: "BIA.163",
        formNumbers: ["61"],
        description: "Scope of the examination"
      },
      {
        name: "documentsRequired",
        type: "list",
        required: true,
        osbReference: "BIA.163",
        formNumbers: ["61"],
        description: "List of required documents"
      }
    ],
    riskIndicators: [
      {
        field: "examinationDate",
        riskType: "compliance",
        severity: "medium",
        description: "Delay in examination",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "orderDate"
        }
      }
    ]
  },
  "62": {
    formNumber: "62",
    title: "Notice of Intention to Make a Proposal",
    category: "legal",
    subcategory: "proposal",
    purpose: "Formal notice of proposal intention",
    relatedForms: [],
    clientInfoFields: [
      "debtorName",
      "trusteeName",
      "creditorList"
    ],
    keyDates: [
      "noticeDate",
      "proposalFilingDeadline"
    ],
    monetaryFields: [
      "estimatedDebt",
      "assetsAvailable"
    ],
    requiredFields: [
      {
        name: "proposalTermsSummary",
        type: "text",
        required: true,
        osbReference: "BIA.50.4",
        formNumbers: ["62"],
        description: "Summary of proposal terms"
      },
      {
        name: "creditorMeetingDetails",
        type: "text",
        required: true,
        osbReference: "BIA.50.4",
        formNumbers: ["62"],
        description: "Details for the creditor meeting"
      }
    ],
    riskIndicators: [
      {
        field: "proposalFilingDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Filing deadline approaching",
        threshold: {
          type: "days",
          value: 10,
          comparison: "minimum",
          baseline: "noticeDate"
        }
      }
    ]
  },
  "63": {
    formNumber: "63",
    title: "Statement of Income and Expenses",
    category: "administrative",
    subcategory: "financial",
    purpose: "Disclosure of financial status",
    relatedForms: [],
    clientInfoFields: [
      "debtorName",
      "address",
      "occupation"
    ],
    keyDates: [
      "statementPeriodStart",
      "statementPeriodEnd"
    ],
    monetaryFields: [
      "totalIncome",
      "totalExpenses",
      "netIncome"
    ],
    requiredFields: [
      {
        name: "incomeSources",
        type: "text",
        required: true,
        osbReference: "BIA.129",
        formNumbers: ["63"],
        description: "Sources of income"
      },
      {
        name: "expenseCategories",
        type: "text",
        required: true,
        osbReference: "BIA.129",
        formNumbers: ["63"],
        description: "Categories of expenses"
      }
    ],
    riskIndicators: [
      {
        field: "netIncome",
        riskType: "financial",
        severity: "medium",
        description: "Negative net income",
        threshold: {
          type: "amount",
          value: 0,
          comparison: "minimum"
        }
      }
    ]
  },
  "64": {
    formNumber: "64",
    title: "Discharge of Trustee",
    category: "legal",
    subcategory: "discharge",
    purpose: "Release of trustee from duties",
    relatedForms: [],
    clientInfoFields: [
      "trusteeName",
      "estateNumber",
      "courtDetails"
    ],
    keyDates: [
      "dischargeApplicationDate",
      "dischargeOrderDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "trusteeComplianceStatement",
        type: "text",
        required: true,
        osbReference: "BIA.41",
        formNumbers: ["64"],
        description: "Statement of compliance"
      },
      {
        name: "courtApproval",
        type: "text",
        required: true,
        osbReference: "BIA.41",
        formNumbers: ["64"],
        description: "Court approval details"
      }
    ],
    riskIndicators: [
      {
        field: "dischargeApplicationDate",
        riskType: "compliance",
        severity: "low",
        description: "Delay in discharge application",
        threshold: {
          type: "days",
          value: 90,
          comparison: "maximum",
          baseline: "dischargeOrderDate"
        }
      }
    ]
  },
  "65": {
    formNumber: "65",
    title: "Final Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "financial",
    purpose: "Summary of financial transactions",
    relatedForms: [],
    clientInfoFields: [
      "trusteeName",
      "estateNumber",
      "bankDetails"
    ],
    keyDates: [
      "statementPeriodStart",
      "statementPeriodEnd"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements",
      "balanceRemaining"
    ],
    requiredFields: [
      {
        name: "receiptDetails",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["65"],
        description: "Details of receipts"
      },
      {
        name: "disbursementDetails",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        formNumbers: ["65"],
        description: "Details of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "balanceRemaining",
        riskType: "financial",
        severity: "low",
        description: "Significant balance remaining",
        threshold: {
          type: "percentage",
          value: 5,
          comparison: "maximum",
          baseline: "totalReceipts"
        }
      }
    ]
  },
  "66": {
    formNumber: "66",
    title: "Application for Discharge",
    category: "legal",
    subcategory: "discharge",
    purpose: "Request for discharge from bankruptcy",
    relatedForms: [],
    clientInfoFields: [
      "bankruptName",
      "trusteeName",
      "courtDetails"
    ],
    keyDates: [
      "applicationDate",
      "hearingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "bankruptComplianceStatement",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["66"],
        description: "Statement of compliance"
      },
      {
        name: "courtOrderDetails",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["66"],
        description: "Details of court order"
      }
    ],
    riskIndicators: [
      {
        field: "hearingDate",
        riskType: "compliance",
        severity: "medium",
        description: "Delay in hearing",
        threshold: {
          type: "days",
          value: 60,
          comparison: "maximum",
          baseline: "applicationDate"
        }
      }
    ]
  },
  "67": {
    formNumber: "67",
    title: "Order of Discharge",
    category: "legal",
    subcategory: "discharge",
    purpose: "Court order granting discharge",
    relatedForms: ["66"],
    clientInfoFields: [
      "bankruptName",
      "courtDetails",
      "trusteeName"
    ],
    keyDates: [
      "orderDate",
      "effectiveDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "dischargeConditions",
        type: "text",
        required: false,
        osbReference: "BIA.178",
        formNumbers: ["67"],
        description: "Conditions of discharge"
      },
      {
        name: "courtSignature",
        type: "signature",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["67"],
        description: "Court official's signature"
      }
    ],
    riskIndicators: [
      {
        field: "effectiveDate",
        riskType: "compliance",
        severity: "low",
        description: "Future effective date",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "orderDate"
        }
      }
    ]
  },
  "68": {
    formNumber: "68",
    title: "Reasons for Judgment",
    category: "legal",
    subcategory: "judgment",
    purpose: "Explanation of court's decision",
    relatedForms: ["67"],
    clientInfoFields: [
      "bankruptName",
      "courtDetails",
      "judgeName"
    ],
    keyDates: [
      "judgmentDate",
      "hearingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "legalArguments",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["68"],
        description: "Summary of legal arguments"
      },
      {
        name: "courtFindings",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["68"],
        description: "Court's findings of fact"
      }
    ],
    riskIndicators: [
      {
        field: "judgmentDate",
        riskType: "compliance",
        severity: "low",
        description: "Delay in judgment issuance",
        threshold: {
          type: "days",
          value: 45,
          comparison: "maximum",
          baseline: "hearingDate"
        }
      }
    ]
  },
  "69": {
    formNumber: "69",
    title: "Certificate of Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Discharge certification",
    relatedForms: ["66", "67", "68"],
    clientInfoFields: [
      "bankruptName",
      "estateNumber",
      "trusteeInfo"
    ],
    keyDates: [
      "bankruptcyDate",
      "dischargeDate",
      "certificateDate"
    ],
    monetaryFields: [
      "totalLiabilities",
      "totalDistributions"
    ],
    requiredFields: [
      {
        name: "dischargeType",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["69"],
        description: "Type of discharge granted"
      },
      {
        name: "courtReference",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        formNumbers: ["69"],
        description: "Court order reference"
      }
    ],
    riskIndicators: [
      {
        field: "certificateDate",
        riskType: "compliance",
        severity: "high",
        description: "Certificate timing verification",
        threshold: {
          type: "days",
          value: 5,
          comparison: "maximum",
          baseline: "dischargeDate"
        }
      }
    ]
  },

  "70": {
    formNumber: "70",
    title: "Notice of Mediation",
    category: "administrative",
    subcategory: "mediation",
    purpose: "Mediation process",
    relatedForms: ["71", "72"],
    clientInfoFields: [
      "mediatorInfo",
      "parties",
      "location"
    ],
    keyDates: [
      "mediationDate",
      "noticeDate",
      "responseDeadline"
    ],
    monetaryFields: [
      "mediationFee",
      "disputeAmount"
    ],
    requiredFields: [
      {
        name: "mediationSubject",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["70"],
        description: "Subject of mediation"
      },
      {
        name: "procedureRules",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["70"],
        description: "Mediation procedures"
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
          baseline: "mediationDate"
        }
      }
    ]
  },

  "71": {
    formNumber: "71",
    title: "Mediation Report",
    category: "administrative",
    subcategory: "mediation",
    purpose: "Mediation outcome",
    relatedForms: ["70", "72"],
    clientInfoFields: [
      "mediatorInfo",
      "parties",
      "fileNumber"
    ],
    keyDates: [
      "mediationDate",
      "reportDate",
      "followUpDeadline"
    ],
    monetaryFields: [
      "settlementAmount",
      "mediationCosts"
    ],
    requiredFields: [
      {
        name: "outcome",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["71"],
        description: "Mediation outcome"
      },
      {
        name: "recommendations",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["71"],
        description: "Mediator recommendations"
      }
    ],
    riskIndicators: [
      {
        field: "reportDate",
        riskType: "compliance",
        severity: "medium",
        description: "Report submission timing",
        threshold: {
          type: "days",
          value: 5,
          comparison: "maximum",
          baseline: "mediationDate"
        }
      },
      {
        field: "mediationCosts",
        riskType: "financial",
        severity: "medium",
        description: "Cost analysis",
        threshold: {
          type: "percentage",
          value: 15,
          comparison: "maximum",
          baseline: "settlementAmount"
        }
      }
    ]
  }
};
