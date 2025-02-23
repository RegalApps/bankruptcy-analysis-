
import { OSBFormTemplate } from "../types.ts";

export const bankruptcyForms: Record<string, OSBFormTemplate> = {
  "1": {
    formNumber: "1",
    title: "Assignment for the General Benefit of Creditors",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Initial filing to commence bankruptcy proceedings",
    relatedForms: ["2", "3", "4"],
    clientInfoFields: ["debtorName", "address", "occupation"],
    keyDates: ["assignmentDate"],
    monetaryFields: ["totalAssets", "totalLiabilities"],
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["1"],
        description: "Full legal name of the debtor"
      },
      {
        name: "assignmentDate",
        type: "date",
        required: true,
        osbReference: "BIA.49(1)",
        formNumbers: ["1"],
        description: "Date of the assignment"
      }
    ],
    riskIndicators: [
      {
        field: "totalAssets",
        riskType: "financial",
        severity: "high",
        description: "Asset value significantly different from liabilities"
      },
      {
        field: "assignmentDate",
        riskType: "compliance",
        severity: "high",
        description: "Assignment date must be within required filing period"
      }
    ]
  },
  "2": {
    formNumber: "2",
    title: "Statement of Affairs (Non-Business Bankruptcy)",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Detailed disclosure of debtor's financial situation",
    relatedForms: ["1", "3", "4"],
    clientInfoFields: ["debtorName", "address", "maritalStatus", "dependents"],
    keyDates: ["statementDate"],
    monetaryFields: [
      "totalAssets",
      "totalLiabilities",
      "monthlyIncome",
      "monthlyExpenses"
    ],
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        osbReference: "BIA.158",
        formNumbers: ["2"],
        description: "Full legal name of the debtor"
      },
      {
        name: "maritalStatus",
        type: "select",
        required: true,
        options: ["Single", "Married", "Separated", "Divorced", "Widowed"],
        osbReference: "BIA.158(d)",
        formNumbers: ["2"],
        description: "Current marital status"
      }
    ],
    riskIndicators: [
      {
        field: "monthlyIncome",
        riskType: "financial",
        severity: "high",
        description: "Income may be sufficient to support a proposal"
      },
      {
        field: "assets",
        riskType: "compliance",
        severity: "high",
        description: "Undisclosed or undervalued assets"
      }
    ]
  },
  "3": {
    formNumber: "3",
    title: "Assignment",
    category: "bankruptcy",
    subcategory: "business_bankruptcy",
    purpose: "Business bankruptcy assignment filing",
    relatedForms: ["1", "2", "4"],
    clientInfoFields: [
      "businessName",
      "tradingName",
      "businessAddress",
      "natureOfBusiness",
      "registrationNumber"
    ],
    keyDates: ["assignmentDate", "cessationDate"],
    monetaryFields: ["totalAssets", "totalLiabilities", "estimatedDeficiency"],
    requiredFields: [
      {
        name: "businessName",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["3"],
        description: "Legal business name"
      },
      {
        name: "natureOfBusiness",
        type: "text",
        required: true,
        osbReference: "BIA.49",
        formNumbers: ["3"],
        description: "Nature of business operations"
      }
    ],
    riskIndicators: [
      {
        field: "estimatedDeficiency",
        riskType: "financial",
        severity: "high",
        description: "Large deficiency may indicate potential fraud or mismanagement"
      },
      {
        field: "cessationDate",
        riskType: "compliance",
        severity: "medium",
        description: "Gap between cessation and filing date requires explanation"
      }
    ]
  },
  "4": {
    formNumber: "4",
    title: "Report of Trustee on Bankrupt's Application for Discharge",
    category: "bankruptcy",
    subcategory: "consumer_bankruptcy",
    purpose: "Trustee's assessment of bankrupt's conduct and discharge recommendation",
    relatedForms: ["1", "2", "3"],
    clientInfoFields: ["bankruptName", "estateNumber", "dateOfBankruptcy"],
    keyDates: [
      "bankruptcyDate",
      "dischargeHearingDate",
      "counsellingDates"
    ],
    monetaryFields: [
      "realizedAmount",
      "dividendPaid",
      "trusteeRemuneration",
      "monthlyIncome"
    ],
    requiredFields: [
      {
        name: "conductAssessment",
        type: "text",
        required: true,
        osbReference: "BIA.170",
        formNumbers: ["4"],
        description: "Assessment of bankrupt's conduct"
      },
      {
        name: "recommendationType",
        type: "select",
        required: true,
        options: [
          "Absolute Discharge",
          "Conditional Discharge",
          "Suspended Discharge",
          "Refuse Discharge"
        ],
        osbReference: "BIA.172",
        formNumbers: ["4"],
        description: "Trustee's discharge recommendation"
      }
    ],
    riskIndicators: [
      {
        field: "conductAssessment",
        riskType: "compliance",
        severity: "high",
        description: "Negative conduct assessment requires detailed documentation"
      },
      {
        field: "counsellingDates",
        riskType: "legal",
        severity: "high",
        description: "Missing or late counselling sessions impact discharge"
      }
    ]
  }
};
