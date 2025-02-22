
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
  }
  // ... Additional forms would be added here
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
