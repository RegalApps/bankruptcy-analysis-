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
  },
  "40": {
    formNumber: "40",
    title: "Assignment of Book Debts",
    category: "receivership",
    subcategory: "receivership_appointment",
    purpose: "Documentation of receivership over book debts",
    relatedForms: ["41", "42"],
    clientInfoFields: [
      "debtorName",
      "securedCreditor",
      "receiverName"
    ],
    keyDates: [
      "appointmentDate",
      "effectiveDate",
      "registrationDate"
    ],
    monetaryFields: [
      "bookDebtsValue",
      "securedAmount",
      "estimatedRealization"
    ],
    requiredFields: [
      {
        name: "securityDescription",
        type: "text",
        required: true,
        osbReference: "BIA.243",
        formNumbers: ["40"],
        description: "Description of security agreement"
      },
      {
        name: "collateralDescription",
        type: "text",
        required: true,
        osbReference: "BIA.243(1)",
        formNumbers: ["40"],
        description: "Description of book debts"
      }
    ],
    riskIndicators: [
      {
        field: "bookDebtsValue",
        riskType: "financial",
        severity: "high",
        description: "Significant variance between book value and estimated realization"
      },
      {
        field: "registrationDate",
        riskType: "legal",
        severity: "high",
        description: "Late registration may affect priority"
      }
    ]
  },
  "50": {
    formNumber: "50",
    title: "Notice of Stay of Proceedings",
    category: "ccaa",
    subcategory: "ccaa_initial",
    purpose: "Notice of CCAA proceedings and stay of proceedings",
    relatedForms: ["51", "52"],
    clientInfoFields: [
      "companyName",
      "courtFileNumber",
      "monitorName"
    ],
    keyDates: [
      "filingDate",
      "stayExpiryDate",
      "hearingDate"
    ],
    monetaryFields: [
      "totalLiabilities",
      "operatingCosts",
      "interimFinancing"
    ],
    requiredFields: [
      {
        name: "stayPeriod",
        type: "date",
        required: true,
        osbReference: "CCAA.11.02",
        formNumbers: ["50"],
        description: "Period of stay of proceedings"
      },
      {
        name: "courtOrder",
        type: "file",
        required: true,
        osbReference: "CCAA.11",
        formNumbers: ["50"],
        description: "Initial court order"
      }
    ],
    riskIndicators: [
      {
        field: "operatingCosts",
        riskType: "financial",
        severity: "high",
        description: "Insufficient working capital during stay period"
      },
      {
        field: "stayPeriod",
        riskType: "legal",
        severity: "medium",
        description: "Stay extension may be required"
      }
    ]
  },
  "82": {
    formNumber: "82",
    title: "Notice of Mediation",
    category: "administrative",
    subcategory: "administrative_general",
    purpose: "Notification of mediation for disputed matters",
    relatedForms: ["83", "84"],
    clientInfoFields: [
      "bankruptName",
      "trusteeContact",
      "mediatorName"
    ],
    keyDates: [
      "mediationDate",
      "responseDeadline",
      "documentationDeadline"
    ],
    monetaryFields: [
      "disputedAmount",
      "mediationCosts"
    ],
    requiredFields: [
      {
        name: "disputeDescription",
        type: "text",
        required: true,
        osbReference: "BIA.170.1",
        formNumbers: ["82"],
        description: "Description of disputed matters"
      },
      {
        name: "mediatorAppointment",
        type: "file",
        required: true,
        osbReference: "BIA.170.1(1)",
        formNumbers: ["82"],
        description: "Mediator appointment document"
      }
    ],
    riskIndicators: [
      {
        field: "disputedAmount",
        riskType: "financial",
        severity: "medium",
        description: "High disputed amount may affect estate administration"
      },
      {
        field: "responseDeadline",
        riskType: "compliance",
        severity: "high",
        description: "Missed deadline may result in adverse determination"
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

  // Required field validation
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

  // Date validations
  template.keyDates.forEach(dateField => {
    if (data[dateField]) {
      const date = new Date(data[dateField]);
      if (isNaN(date.getTime())) {
        errors.push({
          field: dateField,
          type: 'error',
          message: `Invalid date format for ${dateField}`,
          code: 'INVALID_DATE'
        });
      }
    }
  });

  // Monetary field validations
  template.monetaryFields.forEach(moneyField => {
    if (data[moneyField]) {
      const amount = parseFloat(data[moneyField]);
      if (isNaN(amount) || amount < 0) {
        errors.push({
          field: moneyField,
          type: 'error',
          message: `Invalid monetary value for ${moneyField}`,
          code: 'INVALID_AMOUNT'
        });
      }
    }
  });

  // Risk analysis
  template.riskIndicators.forEach(indicator => {
    const value = data[indicator.field];
    if (value) {
      switch (indicator.riskType) {
        case 'financial':
          validateFinancialRisk(value, indicator, errors);
          break;
        case 'compliance':
          validateComplianceRisk(value, indicator, errors);
          break;
        case 'legal':
          validateLegalRisk(value, indicator, errors);
          break;
        case 'operational':
          validateOperationalRisk(value, indicator, errors);
          break;
      }
    }
  });

  return errors;
}

function validateFinancialRisk(value: any, indicator: any, errors: ValidationError[]) {
  // Add specific financial risk validation logic
  if (indicator.field.includes('cashFlow') && parseFloat(value) < 0) {
    errors.push({
      field: indicator.field,
      type: 'warning',
      message: 'Negative cash flow detected',
      code: 'NEGATIVE_CASH_FLOW'
    });
  }
}

function validateComplianceRisk(value: any, indicator: any, errors: ValidationError[]) {
  // Add specific compliance risk validation logic
  if (indicator.field.includes('Date')) {
    const date = new Date(value);
    const today = new Date();
    if (date < today) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Past due date detected',
        code: 'PAST_DUE_DATE'
      });
    }
  }
}

function validateLegalRisk(value: any, indicator: any, errors: ValidationError[]) {
  // Add specific legal risk validation logic
  if (indicator.field.includes('court') || indicator.field.includes('order')) {
    if (!value || value.length < 10) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Insufficient legal documentation',
        code: 'INSUFFICIENT_LEGAL_DOC'
      });
    }
  }
}

function validateOperationalRisk(value: any, indicator: any, errors: ValidationError[]) {
  // Add specific operational risk validation logic
  if (indicator.field.includes('process') || indicator.field.includes('procedure')) {
    if (!value || value.length < 50) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Incomplete process documentation',
        code: 'INCOMPLETE_PROCESS_DOC'
      });
    }
  }
}

export type {
  OSBFormTemplate,
  ValidationRule
} from "./types.ts";
