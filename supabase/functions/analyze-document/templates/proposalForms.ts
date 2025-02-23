import { OSBFormTemplate } from "../types.ts";

export const proposalForms: Record<string, OSBFormTemplate> = {
  "31": {
    formNumber: "31",
    title: "Notice of Division I Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Filing of a commercial proposal under Division I",
    relatedForms: ["32", "33", "34"],
    clientInfoFields: [
      "insolventPerson",
      "businessAddress",
      "natureOfBusiness"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "votingDate"
    ],
    monetaryFields: [
      "totalClaims",
      "proposalAmount",
      "estimatedRealization"
    ],
    requiredFields: [
      {
        name: "proposalTerms",
        type: "text",
        required: true,
        osbReference: "BIA.50(2)",
        formNumbers: ["31"],
        description: "Terms of the proposal"
      },
      {
        name: "securedClaims",
        type: "currency",
        required: true,
        osbReference: "BIA.50(5)",
        formNumbers: ["31"],
        description: "Amount of secured claims"
      }
    ],
    riskIndicators: [
      {
        field: "proposalTerms",
        riskType: "financial",
        severity: "high",
        description: "Unfeasible proposal terms may lead to failure"
      },
      {
        field: "creditorRights",
        riskType: "legal",
        severity: "high",
        description: "Improper treatment of creditor classes"
      }
    ]
  },
  "32": {
    formNumber: "32",
    title: "Notice of Intention to Make a Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Filing notice of intention for commercial proposal",
    relatedForms: ["31", "33", "34"],
    clientInfoFields: [
      "insolventPerson",
      "businessAddress",
      "trusteeInformation",
      "natureOfBusiness"
    ],
    keyDates: [
      "filingDate",
      "stayExpiryDate",
      "proposalDeadline",
      "cashFlowDate"
    ],
    monetaryFields: [
      "totalLiabilities",
      "securedDebt",
      "unsecuredDebt",
      "preferredClaims",
      "projectedRevenue",
      "projectedExpenses"
    ],
    requiredFields: [
      {
        name: "trusteeConsent",
        type: "file",
        required: true,
        osbReference: "BIA.50.4(1)",
        formNumbers: ["32"],
        description: "Licensed Trustee's consent to act"
      },
      {
        name: "cashFlowStatement",
        type: "file",
        required: true,
        osbReference: "BIA.50.4(2)",
        formNumbers: ["32"],
        description: "30-day cash flow projection"
      },
      {
        name: "creditorList",
        type: "file",
        required: true,
        osbReference: "BIA.50.4(1)(c)",
        formNumbers: ["32"],
        description: "List of creditors with claims >$250"
      }
    ],
    riskIndicators: [
      {
        field: "projectedRevenue",
        riskType: "financial",
        severity: "high",
        description: "Revenue projections may be unrealistic",
        threshold: {
          type: "percentage",
          value: 20,
          comparison: "increase",
          baseline: "historicalRevenue"
        }
      },
      {
        field: "cashFlowStatement",
        riskType: "operational",
        severity: "high",
        description: "Cash flow indicates potential operational issues",
        threshold: {
          type: "ratio",
          value: 1.1,
          comparison: "minimum",
          formula: "currentAssets/currentLiabilities"
        }
      },
      {
        field: "stayExpiryDate",
        riskType: "legal",
        severity: "high",
        description: "Risk of stay expiry before proposal filing",
        threshold: {
          type: "days",
          value: 7,
          comparison: "minimum",
          baseline: "currentDate"
        }
      }
    ]
  },
  "33": {
    formNumber: "33",
    title: "Report of Trustee on Proposal",
    category: "proposal",
    subcategory: "division_1_proposal",
    purpose: "Trustee's assessment of proposal viability and recommendations",
    relatedForms: ["31", "32", "34"],
    clientInfoFields: [
      "debtorName",
      "businessName",
      "trusteeContact",
      "estateNumber"
    ],
    keyDates: [
      "filingDate",
      "meetingDate",
      "reportDate",
      "projectionPeriod"
    ],
    monetaryFields: [
      "totalDebt",
      "proposalPayment",
      "projectedCashFlow",
      "administrativeCosts"
    ],
    requiredFields: [
      {
        name: "viabilityAssessment",
        type: "text",
        required: true,
        osbReference: "BIA.50(10)",
        formNumbers: ["33"],
        description: "Assessment of proposal viability"
      },
      {
        name: "cashFlowStatement",
        type: "file",
        required: true,
        osbReference: "BIA.50(6)",
        formNumbers: ["33"],
        description: "Projected cash flow statement"
      }
    ],
    riskIndicators: [
      {
        field: "projectedCashFlow",
        riskType: "financial",
        severity: "high",
        description: "Insufficient cash flow to support proposal payments"
      },
      {
        field: "viabilityAssessment",
        riskType: "compliance",
        severity: "high",
        description: "Concerns about business viability"
      }
    ]
  }
};
