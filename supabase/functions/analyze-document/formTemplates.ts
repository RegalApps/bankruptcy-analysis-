import { FormTemplate, FormField, ValidationRule } from "./types.ts";

// Common validation rules that can be reused across forms
const commonValidations = {
  required: (fieldName: string): ValidationRule => ({
    rule: 'required',
    message: `${fieldName} is required`
  }),
  date: (): ValidationRule => ({
    rule: 'validDate',
    message: 'Must be a valid date'
  }),
  currency: (): ValidationRule => ({
    rule: 'currency',
    message: 'Must be a valid currency amount'
  }),
  caseNumber: (): ValidationRule => ({
    rule: 'pattern',
    message: 'Must be in format XX-XXXXX',
    params: { pattern: '^\\d{2}-\\d{5}$' }
  })
};

// Common regulatory references
const commonRegulations = {
  bankruptcy: {
    bia: ['43(1)', '43(2)', '43(3)'],
    ccaa: ['4', '5'],
    osb: ['31', '33']
  },
  proposal: {
    bia: ['50(1)', '50(2)', '50(3)'],
    ccaa: ['6', '7'],
    osb: ['21', '22']
  }
};

export const formTemplates: Record<string, FormTemplate> = {
  "1": {
    formNumber: "1",
    title: "Voluntary Petition for Individuals",
    description: "Initial bankruptcy filing for individuals",
    requiredFields: [
      { name: "debtorName", type: "text", required: true, description: "Full legal name of debtor" },
      { name: "filingDate", type: "date", required: true, description: "Date of filing" },
      { name: "caseNumber", type: "text", required: true, pattern: "^\\d{2}-\\d{5}$", description: "Case number" }
    ],
    validationRules: {
      debtorName: [{ rule: "required", message: "Debtor name required" }],
      filingDate: [
        { rule: "required", message: "Filing date required" },
        { rule: "validDate", message: "Must be valid date" }
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Debtor 1"],
      filingDate: ["Date Filed:", "Filing Date", "Date"],
      caseNumber: ["Case Number:", "Case No.", "Bankruptcy Case #"]
    }
  },
  "2": {
    formNumber: "2",
    title: "Declaration of Assets and Liabilities",
    description: "Detailed list of debtor's assets and liabilities",
    requiredFields: [
      { name: "totalAssets", type: "currency", required: true, description: "Total value of assets" },
      { name: "totalLiabilities", type: "currency", required: true, description: "Total liabilities" },
      { name: "declarationDate", type: "date", required: true, description: "Date of declaration" }
    ],
    validationRules: {
      totalAssets: [{ rule: "required", message: "Total assets required" }],
      totalLiabilities: [{ rule: "required", message: "Total liabilities required" }]
    },
    fieldMappings: {
      totalAssets: ["Total Assets:", "Value of Assets", "Assets Total"],
      totalLiabilities: ["Total Liabilities:", "Liabilities Amount", "Total Debts"],
      declarationDate: ["Declaration Date:", "Date Signed", "As of Date"]
    }
  },
  "3": {
    formNumber: "3",
    title: "Application for Bankruptcy Order",
    description: "Official application for bankruptcy order",
    requiredFields: [
      { name: "applicantName", type: "text", required: true, description: "Name of applicant" },
      { name: "applicationDate", type: "date", required: true, description: "Date of application" },
      { name: "courtLocation", type: "text", required: true, description: "Court location" }
    ],
    validationRules: {
      applicantName: [{ rule: "required", message: "Applicant name required" }],
      courtLocation: [{ rule: "required", message: "Court location required" }]
    },
    fieldMappings: {
      applicantName: ["Applicant:", "Name of Applicant", "Applicant Name"],
      applicationDate: ["Application Date:", "Date of Application", "Filed On"],
      courtLocation: ["Court Location:", "Court", "Filing Location"]
    }
  },
  "4": {
    formNumber: "4",
    title: "Statement of Affairs",
    description: "Detailed financial and personal information",
    requiredFields: [
      { name: "occupation", type: "text", required: true, description: "Debtor's occupation" },
      { name: "monthlyIncome", type: "currency", required: true, description: "Monthly income" },
      { name: "dependents", type: "number", required: true, description: "Number of dependents" }
    ],
    validationRules: {
      monthlyIncome: [{ rule: "required", message: "Monthly income required" }],
      dependents: [{ rule: "required", message: "Number of dependents required" }]
    },
    fieldMappings: {
      occupation: ["Occupation:", "Employment", "Current Job"],
      monthlyIncome: ["Monthly Income:", "Income per Month", "Regular Income"],
      dependents: ["Dependents:", "Number of Dependents", "Family Size"]
    }
  },
  "5": {
    formNumber: "5",
    title: "Notice of Stay of Proceedings",
    description: "Notice informing creditors of stay of proceedings",
    requiredFields: [
      { name: "effectiveDate", type: "date", required: true, description: "Effective date of stay" },
      { name: "trusteeInfo", type: "text", required: true, description: "Trustee information" },
      { name: "creditorList", type: "text", required: true, description: "List of affected creditors" }
    ],
    validationRules: {
      effectiveDate: [{ rule: "required", message: "Effective date required" }],
      trusteeInfo: [{ rule: "required", message: "Trustee information required" }]
    },
    fieldMappings: {
      effectiveDate: ["Effective Date:", "Stay Date", "Date of Effect"],
      trusteeInfo: ["Trustee:", "Licensed Insolvency Trustee", "LIT Information"],
      creditorList: ["Creditors:", "Affected Creditors", "List of Creditors"]
    }
  },
  "6": {
    formNumber: "6",
    title: "Monthly Income and Expense Statement",
    description: "Detailed monthly financial statement",
    requiredFields: [
      { name: "totalIncome", type: "currency", required: true, description: "Total monthly income" },
      { name: "totalExpenses", type: "currency", required: true, description: "Total monthly expenses" },
      { name: "statementDate", type: "date", required: true, description: "Statement date" }
    ],
    validationRules: {
      totalIncome: [{ rule: "required", message: "Total income required" }],
      totalExpenses: [{ rule: "required", message: "Total expenses required" }]
    },
    fieldMappings: {
      totalIncome: ["Total Income:", "Monthly Income Total", "Income Amount"],
      totalExpenses: ["Total Expenses:", "Monthly Expenses", "Expense Total"],
      statementDate: ["Statement Date:", "For Month Of", "Period Ending"]
    }
  },
  "7": {
    formNumber: "7",
    title: "Proof of Claim",
    description: "Creditor's claim documentation",
    requiredFields: [
      { name: "creditorName", type: "text", required: true, description: "Creditor's name" },
      { name: "claimAmount", type: "currency", required: true, description: "Amount claimed" },
      { name: "claimDate", type: "date", required: true, description: "Date of claim" }
    ],
    validationRules: {
      creditorName: [{ rule: "required", message: "Creditor name required" }],
      claimAmount: [{ rule: "required", message: "Claim amount required" }]
    },
    fieldMappings: {
      creditorName: ["Creditor:", "Name of Creditor", "Claimant"],
      claimAmount: ["Amount:", "Claim Amount", "Total Claim"],
      claimDate: ["Date:", "Claim Date", "Filing Date"]
    }
  },
  "8": {
    formNumber: "8",
    title: "Assignment for General Benefit of Creditors",
    description: "Document for voluntary assignment into bankruptcy",
    category: "bankruptcy",
    requiredFields: [
      {
        name: "assignorName",
        type: "text",
        required: true,
        description: "Name of person making assignment",
        regulatoryReferences: {
          bia: ['49(1)'],
          osb: ['31']
        }
      },
      {
        name: "assignmentDate",
        type: "date",
        required: true,
        description: "Date of assignment",
        regulatoryReferences: {
          bia: ['49(2)']
        }
      }
    ],
    validationRules: {
      assignorName: [commonValidations.required("Assignor name")],
      assignmentDate: [
        commonValidations.required("Assignment date"),
        commonValidations.date()
      ]
    },
    fieldMappings: {
      assignorName: ["Assignor:", "Name of Assignor", "Debtor Name"],
      assignmentDate: ["Date of Assignment:", "Assignment Date", "Date"]
    },
    regulatoryFramework: commonRegulations.bankruptcy
  },
  "9": {
    formNumber: "9",
    title: "Certificate of Assignment",
    description: "Official certification of bankruptcy assignment",
    category: "bankruptcy",
    requiredFields: [
      {
        name: "officialReceiver",
        type: "text",
        required: true,
        description: "Name of Official Receiver",
        regulatoryReferences: {
          bia: ['49(3)'],
          osb: ['32']
        }
      },
      {
        name: "certificateDate",
        type: "date",
        required: true,
        description: "Date of certificate"
      }
    ],
    validationRules: {
      officialReceiver: [commonValidations.required("Official Receiver name")],
      certificateDate: [
        commonValidations.required("Certificate date"),
        commonValidations.date()
      ]
    },
    fieldMappings: {
      officialReceiver: ["Official Receiver:", "Receiver Name", "OR Name"],
      certificateDate: ["Certificate Date:", "Date Issued", "Date"]
    },
    regulatoryFramework: commonRegulations.bankruptcy
  },
  "21": {
    formNumber: "21",
    title: "Statement of Receipts and Disbursements",
    description: "Financial statement of bankruptcy administration",
    category: "administrative",
    requiredFields: [
      {
        name: "totalReceipts",
        type: "currency",
        required: true,
        description: "Total receipts amount",
        regulatoryReferences: {
          bia: ['152(1)'],
          osb: ['75']
        }
      },
      {
        name: "totalDisbursements",
        type: "currency",
        required: true,
        description: "Total disbursements amount"
      }
    ],
    validationRules: {
      totalReceipts: [
        commonValidations.required("Total receipts"),
        commonValidations.currency()
      ],
      totalDisbursements: [
        commonValidations.required("Total disbursements"),
        commonValidations.currency()
      ]
    },
    fieldMappings: {
      totalReceipts: ["Total Receipts:", "Receipts Total", "Income"],
      totalDisbursements: ["Total Disbursements:", "Disbursements", "Expenses"]
    },
    regulatoryFramework: {
      bia: ['152', '153'],
      ccaa: [],
      osb: ['75', '76']
    }
  },
  "47": {
    formNumber: "47",
    title: "Consumer Proposal",
    description: "Proposal to creditors under Division II",
    category: "proposal",
    requiredFields: [
      {
        name: "proposalAmount",
        type: "currency",
        required: true,
        description: "Total proposal amount",
        regulatoryReferences: {
          bia: ['66.13'],
          osb: ['42']
        }
      },
      {
        name: "paymentSchedule",
        type: "text",
        required: true,
        description: "Payment schedule details"
      }
    ],
    validationRules: {
      proposalAmount: [
        commonValidations.required("Proposal amount"),
        commonValidations.currency()
      ],
      paymentSchedule: [commonValidations.required("Payment schedule")]
    },
    fieldMappings: {
      proposalAmount: ["Proposal Amount:", "Total Proposal", "Amount Offered"],
      paymentSchedule: ["Payment Schedule:", "Schedule of Payments", "Terms"]
    },
    regulatoryFramework: commonRegulations.proposal
  }
};

// Enhanced validation function
export const validateFormData = (formNumber: string, data: any) => {
  const template = formTemplates[formNumber];
  if (!template) {
    return { valid: false, errors: ["Invalid form number"] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  template.requiredFields.forEach(field => {
    // Required field validation
    if (field.required && !data[field.name]) {
      errors.push(`${field.name} is required`);
    }

    // Type-specific validation
    if (data[field.name]) {
      switch (field.type) {
        case 'date':
          if (!isValidDate(data[field.name])) {
            errors.push(`${field.name} must be a valid date`);
          }
          break;
        case 'currency':
          if (!isValidCurrency(data[field.name])) {
            errors.push(`${field.name} must be a valid currency amount`);
          }
          break;
        case 'number':
          if (isNaN(Number(data[field.name]))) {
            errors.push(`${field.name} must be a valid number`);
          }
          break;
      }
    }

    // Pattern validation
    if (data[field.name] && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(data[field.name])) {
        errors.push(`${field.name} format is invalid`);
      }
    }

    // Regulatory compliance checks
    if (field.regulatoryReferences) {
      Object.entries(field.regulatoryReferences).forEach(([framework, sections]) => {
        sections.forEach(section => {
          if (!isCompliantWithRegulation(data[field.name], framework, section)) {
            warnings.push(`${field.name} may not comply with ${framework} section ${section}`);
          }
        });
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Helper functions for validation
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isValidCurrency(amount: string): boolean {
  return /^\$?\d+(\.\d{2})?$/.test(amount.toString());
}

function isCompliantWithRegulation(value: any, framework: string, section: string): boolean {
  // Implement specific regulatory compliance checks
  // This would contain actual logic to verify compliance with specific sections
  return true; // Placeholder
}

export type { FormField, ValidationRule } from "./types.ts";
