import { OSBFormTemplate, ValidationRule } from "./types.ts";
import { validationPatterns } from "./validation/patterns.ts";

export const osbFormTemplates: Record<string, OSBFormTemplate> = {
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
  },
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
  "78": {
    formNumber: "78",
    title: "Statement of Receipts and Disbursements",
    category: "administrative",
    subcategory: "administrative_general",
    purpose: "Detailed accounting of estate administration",
    relatedForms: ["1", "2", "3", "4"],
    clientInfoFields: [
      "estateId",
      "trusteeName",
      "estateName"
    ],
    keyDates: [
      "startDate",
      "endDate",
      "reportingPeriod"
    ],
    monetaryFields: [
      "totalReceipts",
      "totalDisbursements",
      "trusteeFees",
      "creditorDividends"
    ],
    requiredFields: [
      {
        name: "receiptsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.Directive.5R",
        formNumbers: ["78"],
        description: "Detailed breakdown of receipts"
      },
      {
        name: "disbursementsBreakdown",
        type: "text",
        required: true,
        osbReference: "BIA.Directive.5R",
        formNumbers: ["78"],
        description: "Detailed breakdown of disbursements"
      }
    ],
    riskIndicators: [
      {
        field: "trusteeFees",
        riskType: "compliance",
        severity: "high",
        description: "Trustee fees exceed tariff or guidelines"
      },
      {
        field: "unexplainedDisbursements",
        riskType: "financial",
        severity: "high",
        description: "Unexplained or unusual disbursements"
      }
    ]
  }
};

export function validateOSBForm(formNumber: string, data: any): ValidationError[] {
  const template = osbFormTemplates[formNumber];
  if (!template) {
    throw new Error(`No template found for form ${formNumber}`);
  }

  const errors: ValidationError[] = [];

  // Validate required fields
  template.requiredFields.forEach(field => {
    if (field.required && !data[field.name]) {
      errors.push({
        field: field.name,
        type: 'error',
        message: `${field.name} is required for Form ${formNumber}`,
        code: 'REQUIRED_FIELD'
      });
    }
  });

  // Check for risk indicators
  template.riskIndicators.forEach(indicator => {
    const value = data[indicator.field];
    if (value) {
      // Add risk-based validation logic here
      switch (indicator.riskType) {
        case 'financial':
          // Financial risk checks
          break;
        case 'compliance':
          // Compliance risk checks
          break;
        case 'legal':
          // Legal risk checks
          break;
        case 'operational':
          // Operational risk checks
          break;
      }
    }
  });

  return errors;
}

export type {
  OSBFormTemplate,
  ValidationRule
} from "./types.ts";
