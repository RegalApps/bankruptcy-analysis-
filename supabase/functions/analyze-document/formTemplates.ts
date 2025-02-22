
import { FormTemplate } from "./types.ts";

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
  // ... Additional form templates would be added here following the same pattern
  // Forms 8-96 would follow similar structure based on specific requirements
};

// Helper function to validate forms
export const validateFormData = (formNumber: string, data: any) => {
  const template = formTemplates[formNumber];
  if (!template) {
    return { valid: false, errors: ["Invalid form number"] };
  }

  const errors: string[] = [];
  template.requiredFields.forEach(field => {
    if (field.required && !data[field.name]) {
      errors.push(`${field.name} is required`);
    }
    if (data[field.name] && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(data[field.name])) {
        errors.push(`${field.name} format is invalid`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

// Export types for type safety
export type { FormField } from "./types.ts";
