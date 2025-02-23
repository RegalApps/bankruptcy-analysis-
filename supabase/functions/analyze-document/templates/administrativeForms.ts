<lov-code>
import { OSBFormTemplate } from "../types.ts";

const administrativeForms: Record<string, OSBFormTemplate> = {
  "53": {
    formNumber: "53",
    title: "Notice of Bankruptcy and First Meeting of Creditors",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Inform creditors of bankruptcy and meeting",
    relatedForms: ["54", "55"],
    clientInfoFields: [
      "debtorInfo",
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "bankruptcyDate",
      "meetingDate",
      "filingDeadline"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        osbReference: "BIA.102",
        directives: ["12R2"],
        formNumbers: ["53"],
        description: "Debtor's full legal name"
      },
      {
        name: "meetingLocation",
        type: "text",
        required: true,
        osbReference: "BIA.102",
        directives: ["12R2"],
        formNumbers: ["53"],
        description: "Location of the first creditors meeting"
      }
    ],
    riskIndicators: [
      {
        field: "meetingDate",
        riskType: "regulatory",
        severity: "high",
        description: "Compliance with meeting notice timeframe",
        regulation: "BIA.102",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 21,
          comparison: "minimum",
          baseline: "bankruptcyDate"
        }
      }
    ]
  },
  "54": {
    formNumber: "54",
    title: "Proof of Claim",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Formal claim submission by creditors",
    relatedForms: ["53", "55"],
    clientInfoFields: [
      "creditorInfo",
      "debtorInfo",
      "claimDetails"
    ],
    keyDates: [
      "claimDate",
      "filingDeadline"
    ],
    monetaryFields: [
      "claimAmount",
      "interestAccrued"
    ],
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        osbReference: "BIA.103",
        directives: ["11R2"],
        formNumbers: ["54"],
        description: "Name of the creditor filing the claim"
      },
      {
        name: "claimBasis",
        type: "text",
        required: true,
        osbReference: "BIA.103",
        directives: ["11R2"],
        formNumbers: ["54"],
        description: "Legal basis for the claim"
      }
    ],
    riskIndicators: [
      {
        field: "claimAmount",
        riskType: "financial",
        severity: "medium",
        description: "Unsubstantiated or excessive claim amount",
        regulation: "BIA.103",
        directive: "11R2",
        threshold: {
          type: "amount",
          value: 100000,
          comparison: "maximum"
        }
      }
    ]
  },
  "55": {
    formNumber: "55",
    title: "Proxy Form",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Authorization for representation at meetings",
    relatedForms: ["53", "54"],
    clientInfoFields: [
      "creditorInfo",
      "proxyInfo",
      "debtorInfo"
    ],
    keyDates: [
      "authorizationDate",
      "meetingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        osbReference: "BIA.104",
        directives: ["12R2"],
        formNumbers: ["55"],
        description: "Name of the creditor granting proxy"
      },
      {
        name: "proxyName",
        type: "text",
        required: true,
        osbReference: "BIA.104",
        directives: ["12R2"],
        formNumbers: ["55"],
        description: "Name of the appointed proxy"
      }
    ],
    riskIndicators: [
      {
        field: "authorizationDate",
        riskType: "compliance",
        severity: "low",
        description: "Proxy authorization validity",
        regulation: "BIA.104",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 7,
          comparison: "minimum",
          baseline: "meetingDate"
        }
      }
    ]
  },
  "56": {
    formNumber: "56",
    title: "Statement of Affairs",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Detailed financial disclosure by debtor",
    relatedForms: [],
    clientInfoFields: [
      "debtorInfo",
      "financialDetails"
    ],
    keyDates: [
      "statementDate"
    ],
    monetaryFields: [
      "totalAssets",
      "totalLiabilities"
    ],
    requiredFields: [
      {
        name: "employmentHistory",
        type: "text",
        required: true,
        osbReference: "BIA.128",
        directives: ["11R2"],
        formNumbers: ["56"],
        description: "Debtor's employment history"
      },
      {
        name: "assetList",
        type: "text",
        required: true,
        osbReference: "BIA.128",
        directives: ["11R2"],
        formNumbers: ["56"],
        description: "List of debtor's assets"
      }
    ],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        severity: "medium",
        description: "Discrepancy between declared and verified liabilities",
        regulation: "BIA.128",
        directive: "11R2",
        threshold: {
          type: "percentage",
          value: 20,
          comparison: "maximum"
        }
      }
    ]
  },
  "57": {
    formNumber: "57",
    title: "List of Creditors",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Comprehensive list of all creditors",
    relatedForms: ["56"],
    clientInfoFields: [
      "debtorInfo",
      "creditorInfo"
    ],
    keyDates: [],
    monetaryFields: [
      "outstandingBalance"
    ],
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        osbReference: "BIA.129",
        directives: ["12R2"],
        formNumbers: ["57"],
        description: "Name of each creditor"
      },
      {
        name: "amountOwed",
        type: "currency",
        required: true,
        osbReference: "BIA.129",
        directives: ["12R2"],
        formNumbers: ["57"],
        description: "Amount owed to each creditor"
      }
    ],
    riskIndicators: [
      {
        field: "amountOwed",
        riskType: "financial",
        severity: "low",
        description: "Unsecured debt concentration",
        regulation: "BIA.129",
        directive: "12R2",
        threshold: {
          type: "percentage",
          value: 50,
          comparison: "maximum"
        }
      }
    ]
  },
  "58": {
    formNumber: "58",
    title: "Notice of Intention to Make a Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Notification to creditors of proposal intention",
    relatedForms: ["59", "60"],
    clientInfoFields: [
      "debtorInfo",
      "creditorInfo"
    ],
    keyDates: [
      "noticeDate",
      "proposalFilingDeadline"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        directives: ["13R1"],
        formNumbers: ["58"],
        description: "Debtor's legal name"
      },
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.62",
        directives: ["13R1"],
        formNumbers: ["58"],
        description: "Summary of proposal terms"
      }
    ],
    riskIndicators: [
      {
        field: "proposalFilingDeadline",
        riskType: "regulatory",
        severity: "high",
        description: "Compliance with proposal filing deadline",
        regulation: "BIA.62",
        directive: "13R1",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "noticeDate"
        }
      }
    ]
  },
  "59": {
    formNumber: "59",
    title: "Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Formal debt restructuring proposal to creditors",
    relatedForms: ["58", "60"],
    clientInfoFields: [
      "debtorInfo",
      "creditorInfo",
      "proposalDetails"
    ],
    keyDates: [
      "proposalDate",
      "creditorMeetingDate",
      "acceptanceDeadline"
    ],
    monetaryFields: [
      "proposedPaymentAmount",
      "totalDebtAmount"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.63",
        directives: ["11R2"],
        formNumbers: ["59"],
        description: "Detailed terms of the proposal"
      },
      {
        name: "creditorList",
        type: "text",
        required: true,
        osbReference: "BIA.63",
        directives: ["11R2"],
        formNumbers: ["59"],
        description: "List of creditors affected by the proposal"
      }
    ],
    riskIndicators: [
      {
        field: "proposedPaymentAmount",
        riskType: "financial",
        severity: "medium",
        description: "Feasibility of proposed payments",
        regulation: "BIA.63",
        directive: "11R2",
        threshold: {
          type: "percentage",
          value: 70,
          comparison: "minimum",
          baseline: "totalDebtAmount"
        }
      }
    ]
  },
  "60": {
    formNumber: "60",
    title: "Report of the Trustee on Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Trustee's assessment of the proposal",
    relatedForms: ["58", "59"],
    clientInfoFields: [
      "trusteeInfo",
      "debtorInfo",
      "proposalDetails"
    ],
    keyDates: [
      "reportDate",
      "creditorMeetingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "trusteeAssessment",
        type: "text",
        required: true,
        osbReference: "BIA.64",
        directives: ["13R1"],
        formNumbers: ["60"],
        description: "Trustee's opinion on the proposal"
      },
      {
        name: "creditorVotingRecommendation",
        type: "text",
        required: true,
        osbReference: "BIA.64",
        directives: ["13R1"],
        formNumbers: ["60"],
        description: "Trustee's recommendation to creditors"
      }
    ],
    riskIndicators: [
      {
        field: "reportDate",
        riskType: "regulatory",
        severity: "high",
        description: "Compliance with reporting deadline",
        regulation: "BIA.64",
        directive: "13R1",
        threshold: {
          type: "days",
          value: 10,
          comparison: "maximum",
          baseline: "creditorMeetingDate"
        }
      }
    ]
  },
  "61": {
    formNumber: "61",
    title: "Application for Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Debtor's application for release from debts",
    relatedForms: [],
    clientInfoFields: [
      "debtorInfo",
      "courtInfo"
    ],
    keyDates: [
      "applicationDate",
      "hearingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "reasonForDischarge",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        directives: ["12R2"],
        formNumbers: ["61"],
        description: "Reasons for seeking discharge"
      },
      {
        name: "complianceStatement",
        type: "text",
        required: true,
        osbReference: "BIA.178",
        directives: ["12R2"],
        formNumbers: ["61"],
        description: "Statement of compliance with duties"
      }
    ],
    riskIndicators: [
      {
        field: "hearingDate",
        riskType: "regulatory",
        severity: "medium",
        description: "Timeliness of discharge hearing",
        regulation: "BIA.178",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 90,
          comparison: "maximum",
          baseline: "applicationDate"
        }
      }
    ]
  },
  "62": {
    formNumber: "62",
    title: "Order of Discharge",
    category: "administrative",
    subcategory: "discharge",
    purpose: "Court order releasing debtor from debts",
    relatedForms: ["61"],
    clientInfoFields: [
      "debtorInfo",
      "courtInfo"
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
        osbReference: "BIA.179",
        directives: ["11R2"],
        formNumbers: ["62"],
        description: "Conditions attached to the discharge"
      },
      {
        name: "debtsDischarged",
        type: "text",
        required: true,
        osbReference: "BIA.179",
        directives: ["11R2"],
        formNumbers: ["62"],
        description: "List of debts discharged"
      }
    ],
    riskIndicators: [
      {
        field: "effectiveDate",
        riskType: "compliance",
        severity: "low",
        description: "Effective date of discharge",
        regulation: "BIA.179",
        directive: "11R2",
        threshold: {
          type: "days",
          value: 30,
          comparison: "maximum",
          baseline: "orderDate"
        }
      }
    ]
  },
  "63": {
    formNumber: "63",
    title: "Notice of Final Dividend and Application for Discharge",
    category: "administrative",
    subcategory: "dividend",
    purpose: "Notification of final dividend distribution",
    relatedForms: [],
    clientInfoFields: [
      "trusteeInfo",
      "creditorInfo",
      "debtorInfo"
    ],
    keyDates: [
      "dividendDate",
      "dischargeApplicationDate"
    ],
    monetaryFields: [
      "dividendAmount",
      "totalAssetsRealized"
    ],
    requiredFields: [
      {
        name: "dividendRate",
        type: "text",
        required: true,
        osbReference: "BIA.149",
        directives: ["13R1"],
        formNumbers: ["63"],
        description: "Rate of the final dividend"
      },
      {
        name: "assetRealizationSummary",
        type: "text",
        required: true,
        osbReference: "BIA.149",
        directives: ["13R1"],
        formNumbers: ["63"],
        description: "Summary of asset realization"
      }
    ],
    riskIndicators: [
      {
        field: "dividendAmount",
        riskType: "financial",
        severity: "medium",
        description: "Adequacy of dividend distribution",
        regulation: "BIA.149",
        directive: "13R1",
        threshold: {
          type: "percentage",
          value: 5,
          comparison: "minimum",
          baseline: "totalAssetsRealized"
        }
      }
    ]
  },
  "64": {
    formNumber: "64",
    title: "Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "dividend",
    purpose: "Summary of financial transactions",
    relatedForms: [],
    clientInfoFields: [
      "trusteeInfo",
      "estateInfo"
    ],
    keyDates: [
      "statementPeriodStart",
      "statementPeriodEnd"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements"
    ],
    requiredFields: [
      {
        name: "receiptDetails",
        type: "text",
        required: true,
        osbReference: "BIA.150",
        directives: ["14R1"],
        formNumbers: ["64"],
        description: "Details of receipts"
      },
      {
        name: "disbursementDetails",
        type: "text",
        required: true,
        osbReference: "BIA.150",
        directives: ["14R1"],
        formNumbers: ["64"],
        description: "Details of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "totalDisbursements",
        riskType: "financial",
        severity: "medium",
        description: "Reasonableness of disbursements",
        regulation: "BIA.150",
        directive: "14R1",
        threshold: {
          type: "percentage",
          value: 80,
          comparison: "maximum",
          baseline: "totalReceipts"
        }
      }
    ]
  },
  "65": {
    formNumber: "65",
    title: "Minutes of the First Meeting of Creditors",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Record of the first meeting",
    relatedForms: ["53", "54", "55"],
    clientInfoFields: [
      "trusteeInfo",
      "debtorInfo",
      "creditorInfo"
    ],
    keyDates: [
      "meetingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "attendeesList",
        type: "text",
        required: true,
        osbReference: "BIA.105",
        directives: ["12R2"],
        formNumbers: ["65"],
        description: "List of attendees"
      },
      {
        name: "resolutionsPassed",
        type: "text",
        required: true,
        osbReference: "BIA.105",
        directives: ["12R2"],
        formNumbers: ["65"],
        description: "Summary of resolutions"
      }
    ],
    riskIndicators: [
      {
        field: "meetingDate",
        riskType: "regulatory",
        severity: "low",
        description: "Compliance with meeting timeframe",
        regulation: "BIA.105",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 21,
          comparison: "minimum",
          baseline: "bankruptcyDate"
        }
      }
    ]
  },
  "66": {
    formNumber: "66",
    title: "Notice of Intention to Declare Dividend",
    category: "administrative",
    subcategory: "dividend",
    purpose: "Notification of dividend distribution",
    relatedForms: ["63", "64"],
    clientInfoFields: [
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "noticeDate",
      "dividendPaymentDate"
    ],
    monetaryFields: [
      "dividendAmount"
    ],
    requiredFields: [
      {
        name: "dividendRate",
        type: "text",
        required: true,
        osbReference: "BIA.151",
        directives: ["13R1"],
        formNumbers: ["66"],
        description: "Rate of dividend"
      },
      {
        name: "paymentDetails",
        type: "text",
        required: true,
        osbReference: "BIA.151",
        directives: ["13R1"],
        formNumbers: ["66"],
        description: "Details of payment"
      }
    ],
    riskIndicators: [
      {
        field: "dividendAmount",
        riskType: "financial",
        severity: "medium",
        description: "Adequacy of dividend",
        regulation: "BIA.151",
        directive: "13R1",
        threshold: {
          type: "percentage",
          value: 5,
          comparison: "minimum",
          baseline: "totalAssetsRealized"
        }
      }
    ]
  },
  "67": {
    formNumber: "67",
    title: "Application for Taxation of Accounts",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Review of trustee's accounts",
    relatedForms: [],
    clientInfoFields: [
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "applicationDate",
      "taxationDate"
    ],
    monetaryFields: [
      "trusteeFees",
      "legalFees"
    ],
    requiredFields: [
      {
        name: "feeJustification",
        type: "text",
        required: true,
        osbReference: "BIA.39",
        directives: ["14R1"],
        formNumbers: ["67"],
        description: "Justification of fees"
      },
      {
        name: "expenseDetails",
        type: "text",
        required: true,
        osbReference: "BIA.39",
        directives: ["14R1"],
        formNumbers: ["67"],
        description: "Details of expenses"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeFees",
        riskType: "financial",
        severity: "medium",
        description: "Reasonableness of fees",
        regulation: "BIA.39",
        directive: "14R1",
        threshold: {
          type: "percentage",
          value: 10,
          comparison: "maximum",
          baseline: "totalAssetsRealized"
        }
      }
    ]
  },
  "68": {
    formNumber: "68",
    title: "Order Approving Accounts",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Court approval of trustee's accounts",
    relatedForms: ["67"],
    clientInfoFields: [
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "orderDate"
    ],
    monetaryFields: [
      "approvedFees",
      "approvedExpenses"
    ],
    requiredFields: [
      {
        name: "courtFindings",
        type: "text",
        required: true,
        osbReference: "BIA.40",
        directives: ["12R2"],
        formNumbers: ["68"],
        description: "Findings of the court"
      },
      {
        name: "approvalDetails",
        type: "text",
        required: true,
        osbReference: "BIA.40",
        directives: ["12R2"],
        formNumbers: ["68"],
        description: "Details of approval"
      }
    ],
    riskIndicators: [
      {
        field: "approvedFees",
        riskType: "financial",
        severity: "low",
        description: "Compliance with fee guidelines",
        regulation: "BIA.40",
        directive: "12R2",
        threshold: {
          type: "percentage",
          value: 10,
          comparison: "maximum",
          baseline: "totalAssetsRealized"
        }
      }
    ]
  },
  "69": {
    formNumber: "69",
    title: "Final Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "dividend",
    purpose: "Final summary of financial transactions",
    relatedForms: ["64"],
    clientInfoFields: [
      "trusteeInfo",
      "estateInfo"
    ],
    keyDates: [
      "statementPeriodStart",
      "statementPeriodEnd"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements"
    ],
    requiredFields: [
      {
        name: "receiptDetails",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        directives: ["14R1"],
        formNumbers: ["69"],
        description: "Details of receipts"
      },
      {
        name: "disbursementDetails",
        type: "text",
        required: true,
        osbReference: "BIA.152",
        directives: ["14R1"],
        formNumbers: ["69"],
        description: "Details of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "totalDisbursements",
        riskType: "financial",
        severity: "medium",
        description: "Reasonableness of disbursements",
        regulation: "BIA.152",
        directive: "14R1",
        threshold: {
          type: "percentage",
          value: 80,
          comparison: "maximum",
          baseline: "totalReceipts"
        }
      }
    ]
  },
  "70": {
    formNumber: "70",
    title: "Application for Release of Trustee",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Application for trustee release",
    relatedForms: [],
    clientInfoFields: [
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "applicationDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "completionReport",
        type: "text",
        required: true,
        osbReference: "BIA.41",
        directives: ["12R2"],
        formNumbers: ["70"],
        description: "Report on completion"
      },
      {
        name: "complianceStatement",
        type: "text",
        required: true,
        osbReference: "BIA.41",
        directives: ["12R2"],
        formNumbers: ["70"],
        description: "Statement of compliance"
      }
    ],
    riskIndicators: [
      {
        field: "applicationDate",
        riskType: "regulatory",
        severity: "low",
        description: "Timeliness of application",
        regulation: "BIA.41",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 365,
          comparison: "maximum",
          baseline: "bankruptcyDate"
        }
      }
    ]
  },
  "71": {
    formNumber: "71",
    title: "Order Releasing Trustee",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Court order releasing trustee",
    relatedForms: ["70"],
    clientInfoFields: [
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "orderDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "courtFindings",
        type: "text",
        required: true,
        osbReference: "BIA.42",
        directives: ["11R2"],
        formNumbers: ["71"],
        description: "Findings of the court"
      },
      {
        name: "releaseTerms",
        type: "text",
        required: true,
        osbReference: "BIA.42",
        directives: ["11R2"],
        formNumbers: ["71"],
        description: "Terms of release"
      }
    ],
    riskIndicators: [],
  },
  "72": {
    formNumber: "72",
    title: "Notice of Assignment",
    category: "administrative",
    subcategory: "receivership",
    purpose: "Notification of assignment",
    relatedForms: [],
    clientInfoFields: [
      "assignorInfo",
      "assigneeInfo"
    ],
    keyDates: [
      "assignmentDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "assignmentDetails",
        type: "text",
        required: true,
        osbReference: "RCA.22",
        directives: ["13R1"],
        formNumbers: ["72"],
        description: "Details of assignment"
      }
    ],
    riskIndicators: []
  },
  "73": {
    formNumber: "73",
    title: "Receiver’s Statement of Affairs",
    category: "administrative",
    subcategory: "receivership",
    purpose: "Statement of affairs",
    relatedForms: [],
    clientInfoFields: [
      "receiverInfo",
      "companyInfo"
    ],
    keyDates: [
      "statementDate"
    ],
    monetaryFields: [
      "totalAssets",
      "totalLiabilities"
    ],
    requiredFields: [
      {
        name: "assetList",
        type: "text",
        required: true,
        osbReference: "RCA.23",
        directives: ["14R1"],
        formNumbers: ["73"],
        description: "List of assets"
      },
      {
        name: "liabilityList",
        type: "text",
        required: true,
        osbReference: "RCA.23",
        directives: ["14R1"],
        formNumbers: ["73"],
        description: "List of liabilities"
      }
    ],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        severity: "medium",
        description: "Discrepancy in liabilities",
        regulation: "RCA.23",
        directive: "14R1",
        threshold: {
          type: "percentage",
          value: 20,
          comparison: "maximum"
        }
      }
    ]
  },
  "74": {
    formNumber: "74",
    title: "Receiver’s Preliminary Report",
    category: "administrative",
    subcategory: "receivership",
    purpose: "Preliminary report",
    relatedForms: [],
    clientInfoFields: [
      "receiverInfo",
      "companyInfo"
    ],
    keyDates: [
      "reportDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "assetAssessment",
        type: "text",
        required: true,
        osbReference: "RCA.24",
        directives: ["12R2"],
        formNumbers: ["74"],
        description: "Assessment of assets"
      },
      {
        name: "liabilityAssessment",
        type: "text",
        required: true,
        osbReference: "RCA.24",
        directives: ["12R2"],
        formNumbers: ["74"],
        description: "Assessment of liabilities"
      }
    ],
    riskIndicators: []
  },
  "75": {
    formNumber: "75",
    title: "Receiver’s Interim Report",
    category: "administrative",
    subcategory: "receivership",
    purpose: "Interim report",
    relatedForms: [],
    clientInfoFields: [
      "receiverInfo",
      "companyInfo"
    ],
    keyDates: [
      "reportDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "progressSummary",
        type: "text",
        required: true
