import { OSBFormTemplate } from "../types.ts";

const administrativeForms: Record<string, OSBFormTemplate> = {
  "53": {
    formNumber: "53",
    title: "Notice of Intention to Make a Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Initiate proposal process",
    relatedForms: ["50", "51"],
    clientInfoFields: [
      "debtorInfo",
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "deadlineDate"
    ],
    monetaryFields: [
      "totalDebt",
      "assetsValue",
      "proposedPayment"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.50.1",
        directives: ["11R2"],
        formNumbers: ["53"],
        description: "Terms of the proposal"
      },
      {
        name: "creditorList",
        type: "table",
        required: true,
        osbReference: "BIA.50.2",
        directives: ["11R2"],
        formNumbers: ["53"],
        description: "List of creditors"
      }
    ],
    riskIndicators: [
      {
        field: "totalDebt",
        riskType: "financial",
        severity: "medium",
        description: "High debt to asset ratio",
        regulation: "BIA.50",
        directive: "11R2",
        threshold: {
          type: "ratio",
          value: 0.75,
          comparison: "greater",
          baseline: "assetsValue"
        }
      }
    ]
  },
  "54": {
    formNumber: "54",
    title: "Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Formalize proposal terms",
    relatedForms: ["53", "55"],
    clientInfoFields: [
      "debtorInfo",
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "proposalDate",
      "acceptanceDate",
      "implementationDate"
    ],
    monetaryFields: [
      "totalDebt",
      "assetsValue",
      "paymentTerms"
    ],
    requiredFields: [
      {
        name: "paymentSchedule",
        type: "text",
        required: true,
        osbReference: "BIA.54.1",
        directives: ["11R2"],
        formNumbers: ["54"],
        description: "Schedule of payments"
      },
      {
        name: "creditorApproval",
        type: "checkbox",
        required: true,
        osbReference: "BIA.54.2",
        directives: ["11R2"],
        formNumbers: ["54"],
        description: "Creditor approval status"
      }
    ],
    riskIndicators: [
      {
        field: "paymentTerms",
        riskType: "financial",
        severity: "medium",
        description: "Unrealistic payment terms",
        regulation: "BIA.54",
        directive: "11R2",
        threshold: {
          type: "percentage",
          value: 0.1,
          comparison: "less",
          baseline: "totalDebt"
        }
      }
    ]
  },
  "55": {
    formNumber: "55",
    title: "Certificate of Full Performance of Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Certify proposal completion",
    relatedForms: ["54", "56"],
    clientInfoFields: [
      "debtorInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "performanceDate",
      "certificationDate"
    ],
    monetaryFields: [
      "totalPaid",
      "originalDebt"
    ],
    requiredFields: [
      {
        name: "trusteeStatement",
        type: "text",
        required: true,
        osbReference: "BIA.66.1",
        directives: ["11R2"],
        formNumbers: ["55"],
        description: "Trustee statement of completion"
      },
      {
        name: "debtorRelease",
        type: "checkbox",
        required: true,
        osbReference: "BIA.66.2",
        directives: ["11R2"],
        formNumbers: ["55"],
        description: "Debtor release confirmation"
      }
    ],
    riskIndicators: [
      {
        field: "totalPaid",
        riskType: "financial",
        severity: "low",
        description: "Discrepancy in total paid vs original debt",
        regulation: "BIA.66",
        directive: "11R2",
        threshold: {
          type: "percentage",
          value: 0.05,
          comparison: "greater",
          baseline: "originalDebt"
        }
      }
    ]
  },
  "56": {
    formNumber: "56",
    title: "Notice of Default Under Proposal",
    category: "administrative",
    subcategory: "proposal",
    purpose: "Notify proposal default",
    relatedForms: ["55", "57"],
    clientInfoFields: [
      "debtorInfo",
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "defaultDate",
      "noticeDate"
    ],
    monetaryFields: [
      "amountOutstanding",
      "originalDebt"
    ],
    requiredFields: [
      {
        name: "defaultReason",
        type: "text",
        required: true,
        osbReference: "BIA.66.3",
        directives: ["11R2"],
        formNumbers: ["56"],
        description: "Reason for default"
      },
      {
        name: "creditorRemedies",
        type: "text",
        required: true,
        osbReference: "BIA.66.4",
        directives: ["11R2"],
        formNumbers: ["56"],
        description: "Creditor remedies"
      }
    ],
    riskIndicators: [
      {
        field: "amountOutstanding",
        riskType: "financial",
        severity: "high",
        description: "Significant amount outstanding after default",
        regulation: "BIA.66",
        directive: "11R2",
        threshold: {
          type: "percentage",
          value: 0.2,
          comparison: "greater",
          baseline: "originalDebt"
        }
      }
    ]
  },
  "57": {
    formNumber: "57",
    title: "Assignment for the General Benefit of Creditors",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Assign assets to trustee",
    relatedForms: ["56", "58"],
    clientInfoFields: [
      "assignorInfo",
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "assignmentDate",
      "effectiveDate"
    ],
    monetaryFields: [
      "estimatedAssets",
      "totalLiabilities"
    ],
    requiredFields: [
      {
        name: "assetList",
        type: "table",
        required: true,
        osbReference: "BIA.73.1",
        directives: ["12R2"],
        formNumbers: ["57"],
        description: "List of assigned assets"
      },
      {
        name: "liabilityList",
        type: "table",
        required: true,
        osbReference: "BIA.73.2",
        directives: ["12R2"],
        formNumbers: ["57"],
        description: "List of liabilities"
      }
    ],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        severity: "high",
        description: "High liabilities compared to assets",
        regulation: "BIA.73",
        directive: "12R2",
        threshold: {
          type: "ratio",
          value: 0.9,
          comparison: "greater",
          baseline: "estimatedAssets"
        }
      }
    ]
  },
  "58": {
    formNumber: "58",
    title: "Statement of Affairs",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Detail financial status",
    relatedForms: ["57", "59"],
    clientInfoFields: [
      "bankruptInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "statementDate"
    ],
    monetaryFields: [
      "assetsRealizable",
      "liabilitiesTotal"
    ],
    requiredFields: [
      {
        name: "assetValuation",
        type: "text",
        required: true,
        osbReference: "BIA.78.1",
        directives: ["12R2"],
        formNumbers: ["58"],
        description: "Method of asset valuation"
      },
      {
        name: "liabilityDetails",
        type: "text",
        required: true,
        osbReference: "BIA.78.2",
        directives: ["12R2"],
        formNumbers: ["58"],
        description: "Details of liabilities"
      }
    ],
    riskIndicators: [
      {
        field: "liabilitiesTotal",
        riskType: "financial",
        severity: "high",
        description: "High total liabilities",
        regulation: "BIA.78",
        directive: "12R2",
        threshold: {
          type: "amount",
          value: 1000000,
          comparison: "greater"
        }
      }
    ]
  },
  "59": {
    formNumber: "59",
    title: "Proof of Claim",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Assert creditor claim",
    relatedForms: ["58", "60"],
    clientInfoFields: [
      "creditorInfo",
      "bankruptInfo"
    ],
    keyDates: [
      "claimDate"
    ],
    monetaryFields: [
      "claimAmount"
    ],
    requiredFields: [
      {
        name: "claimBasis",
        type: "text",
        required: true,
        osbReference: "BIA.81.1",
        directives: ["12R2"],
        formNumbers: ["59"],
        description: "Basis of claim"
      },
      {
        name: "supportingDocs",
        type: "text",
        required: true,
        osbReference: "BIA.81.2",
        directives: ["12R2"],
        formNumbers: ["59"],
        description: "Supporting documentation"
      }
    ],
    riskIndicators: [
      {
        field: "claimAmount",
        riskType: "financial",
        severity: "medium",
        description: "Large claim amount",
        regulation: "BIA.81",
        directive: "12R2",
        threshold: {
          type: "amount",
          value: 500000,
          comparison: "greater"
        }
      }
    ]
  },
  "60": {
    formNumber: "60",
    title: "Proxy",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Authorize representation",
    relatedForms: ["59", "61"],
    clientInfoFields: [
      "creditorInfo",
      "proxyInfo"
    ],
    keyDates: [
      "authorizationDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "votingInstructions",
        type: "text",
        required: true,
        osbReference: "BIA.102.1",
        directives: ["12R2"],
        formNumbers: ["60"],
        description: "Voting instructions"
      },
      {
        name: "proxyLimitations",
        type: "text",
        required: true,
        osbReference: "BIA.102.2",
        directives: ["12R2"],
        formNumbers: ["60"],
        description: "Limitations on proxy"
      }
    ],
    riskIndicators: [
      {
        field: "proxyLimitations",
        riskType: "governance",
        severity: "low",
        description: "Unclear proxy limitations",
        regulation: "BIA.102",
        directive: "12R2",
        threshold: {
          type: "textLength",
          value: 50,
          comparison: "less"
        }
      }
    ]
  },
  "61": {
    formNumber: "61",
    title: "Minutes of Meeting of Creditors",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Record meeting events",
    relatedForms: ["60", "62"],
    clientInfoFields: [
      "trusteeInfo",
      "creditorAttendees"
    ],
    keyDates: [
      "meetingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "meetingAgenda",
        type: "text",
        required: true,
        osbReference: "BIA.107.1",
        directives: ["12R2"],
        formNumbers: ["61"],
        description: "Meeting agenda"
      },
      {
        name: "resolutionsPassed",
        type: "text",
        required: true,
        osbReference: "BIA.107.2",
        directives: ["12R2"],
        formNumbers: ["61"],
        description: "Resolutions passed"
      }
    ],
    riskIndicators: [
      {
        field: "resolutionsPassed",
        riskType: "governance",
        severity: "medium",
        description: "Controversial resolutions",
        regulation: "BIA.107",
        directive: "12R2",
        threshold: {
          type: "keywordCount",
          value: 3,
          comparison: "greater",
          keywords: ["dispute", "objection", "challenge"]
        }
      }
    ]
  },
  "62": {
    formNumber: "62",
    title: "Trustee's Preliminary Report",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Initial bankruptcy overview",
    relatedForms: ["61", "63"],
    clientInfoFields: [
      "trusteeInfo",
      "bankruptInfo"
    ],
    keyDates: [
      "reportDate"
    ],
    monetaryFields: [
      "estimatedAssets",
      "totalLiabilities"
    ],
    requiredFields: [
      {
        name: "assetSummary",
        type: "text",
        required: true,
        osbReference: "BIA.152.1",
        directives: ["12R2"],
        formNumbers: ["62"],
        description: "Summary of assets"
      },
      {
        name: "liabilityAnalysis",
        type: "text",
        required: true,
        osbReference: "BIA.152.2",
        directives: ["12R2"],
        formNumbers: ["62"],
        description: "Analysis of liabilities"
      }
    ],
    riskIndicators: [
      {
        field: "totalLiabilities",
        riskType: "financial",
        severity: "high",
        description: "High liabilities relative to assets",
        regulation: "BIA.152",
        directive: "12R2",
        threshold: {
          type: "ratio",
          value: 0.8,
          comparison: "greater",
          baseline: "estimatedAssets"
        }
      }
    ]
  },
  "63": {
    formNumber: "63",
    title: "Notice of Bankruptcy",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Public bankruptcy notice",
    relatedForms: ["62", "64"],
    clientInfoFields: [
      "bankruptInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "bankruptcyDate",
      "noticeDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "bankruptcyDetails",
        type: "text",
        required: true,
        osbReference: "BIA.157.1",
        directives: ["12R2"],
        formNumbers: ["63"],
        description: "Details of bankruptcy"
      },
      {
        name: "creditorMeetingInfo",
        type: "text",
        required: true,
        osbReference: "BIA.157.2",
        directives: ["12R2"],
        formNumbers: ["63"],
        description: "Information on creditor meeting"
      }
    ],
    riskIndicators: [
      {
        field: "noticeDate",
        riskType: "regulatory",
        severity: "medium",
        description: "Delay in bankruptcy notice",
        regulation: "BIA.157",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 30,
          comparison: "greater",
          baseline: "bankruptcyDate"
        }
      }
    ]
  },
  "64": {
    formNumber: "64",
    title: "Application for Discharge",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Request bankruptcy discharge",
    relatedForms: ["63", "65"],
    clientInfoFields: [
      "bankruptInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "applicationDate",
      "hearingDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "dischargeGrounds",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        directives: ["12R2"],
        formNumbers: ["64"],
        description: "Grounds for discharge"
      },
      {
        name: "creditorObjections",
        type: "text",
        required: false,
        osbReference: "BIA.170.2",
        directives: ["12R2"],
        formNumbers: ["64"],
        description: "Creditor objections"
      }
    ],
    riskIndicators: [
      {
        field: "creditorObjections",
        riskType: "legal",
        severity: "medium",
        description: "Creditor objections to discharge",
        regulation: "BIA.170",
        directive: "12R2",
        threshold: {
          type: "keywordCount",
          value: 1,
          comparison: "greater",
          keywords: ["objection", "dispute", "challenge"]
        }
      }
    ]
  },
  "65": {
    formNumber: "65",
    title: "Order of Discharge",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Grant bankruptcy discharge",
    relatedForms: ["64", "66"],
    clientInfoFields: [
      "bankruptInfo",
      "courtInfo"
    ],
    keyDates: [
      "orderDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "dischargeTerms",
        type: "text",
        required: true,
        osbReference: "BIA.172.1",
        directives: ["12R2"],
        formNumbers: ["65"],
        description: "Terms of discharge"
      },
      {
        name: "conditionsMet",
        type: "checkbox",
        required: true,
        osbReference: "BIA.172.2",
        directives: ["12R2"],
        formNumbers: ["65"],
        description: "Conditions met for discharge"
      }
    ],
    riskIndicators: [
      {
        field: "dischargeTerms",
        riskType: "legal",
        severity: "low",
        description: "Restrictive discharge terms",
        regulation: "BIA.172",
        directive: "12R2",
        threshold: {
          type: "keywordCount",
          value: 2,
          comparison: "greater",
          keywords: ["restriction", "condition", "limitation"]
        }
      }
    ]
  },
  "66": {
    formNumber: "66",
    title: "Final Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Summarize financial activity",
    relatedForms: ["65", "67"],
    clientInfoFields: [
      "trusteeInfo",
      "bankruptInfo"
    ],
    keyDates: [
      "statementDate"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements"
    ],
    requiredFields: [
      {
        name: "receiptDetails",
        type: "table",
        required: true,
        osbReference: "BIA.152.3",
        directives: ["12R2"],
        formNumbers: ["66"],
        description: "Details of receipts"
      },
      {
        name: "disbursementDetails",
        type: "table",
        required: true,
        osbReference: "BIA.152.4",
        directives: ["12R2"],
        formNumbers: ["66"],
        description: "Details of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "totalDisbursements",
        riskType: "financial",
        severity: "medium",
        description: "High disbursements relative to receipts",
        regulation: "BIA.152",
        directive: "12R2",
        threshold: {
          type: "ratio",
          value: 0.9,
          comparison: "greater",
          baseline: "totalReceipts"
        }
      }
    ]
  },
  "67": {
    formNumber: "67",
    title: "Application for Taxation of Accounts",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Request account review",
    relatedForms: ["66", "68"],
    clientInfoFields: [
      "trusteeInfo",
      "courtInfo"
    ],
    keyDates: [
      "applicationDate"
    ],
    monetaryFields: [
      "feesRequested",
      "expensesRequested"
    ],
    requiredFields: [
      {
        name: "feeJustification",
        type: "text",
        required: true,
        osbReference: "BIA.39.1",
        directives: ["12R2"],
        formNumbers: ["67"],
        description: "Justification of fees"
      },
      {
        name: "expenseDetails",
        type: "text",
        required: true,
        osbReference: "BIA.39.2",
        directives: ["12R2"],
        formNumbers: ["67"],
        description: "Details of expenses"
      }
    ],
    riskIndicators: [
      {
        field: "feesRequested",
        riskType: "financial",
        severity: "medium",
        description: "High fees requested",
        regulation: "BIA.39",
        directive: "12R2",
        threshold: {
          type: "amount",
          value: 100000,
          comparison: "greater"
        }
      }
    ]
  },
  "68": {
    formNumber: "68",
    title: "Order for Taxation of Accounts",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Authorize account review",
    relatedForms: ["67", "69"],
    clientInfoFields: [
      "courtInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "orderDate",
      "taxationDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "taxationDetails",
        type: "text",
        required: true,
        osbReference: "BIA.39.3",
        directives: ["12R2"],
        formNumbers: ["68"],
        description: "Details of taxation"
      },
      {
        name: "noticeRequirements",
        type: "text",
        required: true,
        osbReference: "BIA.39.4",
        directives: ["12R2"],
        formNumbers: ["68"],
        description: "Notice requirements"
      }
    ],
    riskIndicators: [
      {
        field: "taxationDetails",
        riskType: "regulatory",
        severity: "low",
        description: "Unclear taxation details",
        regulation: "BIA.39",
        directive: "12R2",
        threshold: {
          type: "textLength",
          value: 50,
          comparison: "less"
        }
      }
    ]
  },
  "69": {
    formNumber: "69",
    title: "Certificate of Taxation",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Certify account taxation",
    relatedForms: ["68", "70"],
    clientInfoFields: [
      "courtInfo",
      "trusteeInfo"
    ],
    keyDates: [
      "taxationDate",
      "certificationDate"
    ],
    monetaryFields: [
      "feesAllowed",
      "expensesAllowed"
    ],
    requiredFields: [
      {
        name: "taxationResult",
        type: "text",
        required: true,
        osbReference: "BIA.39.5",
        directives: ["12R2"],
        formNumbers: ["69"],
        description: "Result of taxation"
      },
      {
        name: "appealRights",
        type: "text",
        required: true,
        osbReference: "BIA.39.6",
        directives: ["12R2"],
        formNumbers: ["69"],
        description: "Appeal rights"
      }
    ],
    riskIndicators: [
      {
        field: "feesAllowed",
        riskType: "financial",
        severity: "medium",
        description: "Significant reduction in fees",
        regulation: "BIA.39",
        directive: "12R2",
        threshold: {
          type: "percentage",
          value: 0.2,
          comparison: "less",
          baseline: "feesRequested"
        }
      }
    ]
  },
  "70": {
    formNumber: "70",
    title: "Dividend Sheet",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Record dividend distribution",
    relatedForms: ["69", "71"],
    clientInfoFields: [
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "dividendDate"
    ],
    monetaryFields: [
      "dividendAmount",
      "claimAmount"
    ],
    requiredFields: [
      {
        name: "dividendRate",
        type: "text",
        required: true,
        osbReference: "BIA.144.1",
        directives: ["12R2"],
        formNumbers: ["70"],
        description: "Dividend rate"
      },
      {
        name: "paymentMethod",
        type: "text",
        required: true,
        osbReference: "BIA.144.2",
        directives: ["12R2"],
        formNumbers: ["70"],
        description: "Payment method"
      }
    ],
    riskIndicators: [
      {
        field: "dividendAmount",
        riskType: "financial",
        severity: "low",
        description: "Low dividend amount",
        regulation: "BIA.144",
        directive: "12R2",
        threshold: {
          type: "percentage",
          value: 0.05,
          comparison: "less",
          baseline: "claimAmount"
        }
      }
    ]
  },
  "71": {
    formNumber: "71",
    title: "Notice of Final Dividend and Application for Discharge",
    category: "administrative",
    subcategory: "bankruptcy",
    purpose: "Notify final actions",
    relatedForms: ["70"],
    clientInfoFields: [
      "trusteeInfo",
      "creditorInfo"
    ],
    keyDates: [
      "dividendDate",
      "dischargeApplicationDate"
    ],
    monetaryFields: [],
    requiredFields: [
      {
        name: "dischargeDetails",
        type: "text",
        required: true,
        osbReference: "BIA.170.3",
        directives: ["12R2"],
        formNumbers: ["71"],
        description: "Details of discharge application"
      },
      {
        name: "objectionDeadline",
        type: "text",
        required: true,
        osbReference: "BIA.170.4",
        directives: ["12R2"],
        formNumbers: ["71"],
        description: "Deadline for objections"
      }
    ],
    riskIndicators: [
      {
        field: "objectionDeadline",
        riskType: "legal",
        severity: "medium",
        description: "Short objection deadline",
        regulation: "BIA.170",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 15,
          comparison: "less"
        }
      }
    ]
  },
  "72": {
    formNumber: "72",
    title: "Notice of Appointment of Receiver",
    category: "administrative",
    subcategory: "receivership_appointment",
    purpose: "Receiver appointment",
    relatedForms: ["73", "74"],
    clientInfoFields: [
      "receiverInfo",
      "debtorInfo",
      "securedCreditor"
    ],
    keyDates: [
      "appointmentDate",
      "noticeDate",
      "registrationDeadline"
    ],
    monetaryFields: [
      "securedAmount",
      "estimatedAssets"
    ],
    requiredFields: [
      {
        name: "appointmentBasis",
        type: "text",
        required: true,
        osbReference: "BIA.243",
        directives: ["12R2"],
        formNumbers: ["72"],
        description: "Basis of receiver appointment"
      },
      {
        name: "securityDetails",
        type: "text",
        required: true,
        osbReference: "BIA.243(1)",
        directives: ["12R2"],
        formNumbers: ["72"],
        description: "Security instrument details"
      }
    ],
    riskIndicators: [
      {
        field: "noticeDate",
        riskType: "regulatory",
        severity: "high",
        description: "BIA 243(1) compliance - Notice timing",
        regulation: "BIA.243(1)",
        directive: "12R2",
        threshold: {
          type: "days",
          value: 10,
          comparison: "maximum",
          baseline: "appointmentDate"
        }
      }
    ]
  }
};

export { administrativeForms };
