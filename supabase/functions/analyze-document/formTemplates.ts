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

const commonRegulations = {
  bia: {
    bankruptcy: ['49', '50', '51'],
    proposal: ['66.11', '66.12', '66.13'],
    receivership: ['243', '244', '246']
  },
  ccaa: {
    general: ['11.1', '11.2', '11.3'],
    monitor: ['23', '24', '25']
  },
  osb: {
    directives: ['1R4', '2R3', '3R2']
  }
};

export const formTemplates: Record<string, FormTemplate> = {
  '1': {
    formNumber: '1',
    title: 'Assignment in Bankruptcy',
    description: 'Form for voluntary assignment in bankruptcy',
    category: 'bankruptcy',
    requiredFields: [
      {
        name: 'debtorName',
        type: 'text',
        required: true,
        description: 'Full legal name of the debtor'
      },
      {
        name: 'filingDate',
        type: 'date',
        required: true,
        description: 'Date of filing'
      },
      {
        name: 'totalDebt',
        type: 'currency',
        required: true,
        description: 'Total amount of debt'
      }
    ],
    validationRules: {
      debtorName: [commonValidations.required('Debtor name')],
      filingDate: [commonValidations.required('Filing date'), commonValidations.date()],
      totalDebt: [commonValidations.required('Total debt'), commonValidations.currency()]
    },
    fieldMappings: {
      debtorName: ['debtor name', 'name of debtor', 'assignor'],
      filingDate: ['filing date', 'date of filing', 'submission date'],
      totalDebt: ['total debt', 'debt amount', 'total liabilities']
    },
    regulatoryFramework: {
      bia: commonRegulations.bia.bankruptcy,
      ccaa: [],
      osb: commonRegulations.osb.directives
    }
  },
  '2': {
    formNumber: '2',
    title: 'Notice of Intention to Make a Proposal',
    description: 'Form for filing a notice of intention to make a proposal',
    category: 'proposal',
    requiredFields: [
      {
        name: 'insolventPerson',
        type: 'text',
        required: true,
        description: 'Name of the insolvent person'
      },
      {
        name: 'trusteeInfo',
        type: 'text',
        required: true,
        description: 'Information about the licensed trustee'
      },
      {
        name: 'noticeDate',
        type: 'date',
        required: true,
        description: 'Date of the notice'
      }
    ],
    validationRules: {
      insolventPerson: [commonValidations.required('Insolvent person name')],
      trusteeInfo: [commonValidations.required('Trustee information')],
      noticeDate: [commonValidations.required('Notice date'), commonValidations.date()]
    },
    fieldMappings: {
      insolventPerson: ['insolvent person', 'debtor name', 'person name'],
      trusteeInfo: ['trustee', 'licensed trustee', 'trustee information'],
      noticeDate: ['notice date', 'date of notice', 'filing date']
    },
    regulatoryFramework: {
      bia: commonRegulations.bia.proposal,
      ccaa: [],
      osb: commonRegulations.osb.directives
    }
  }
};

// Helper functions
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isValidCurrency(amount: string): boolean {
  return /^\$?\d+(\.\d{2})?$/.test(amount.toString());
}

function isCompliantWithRegulation(value: any, framework: string, section: string): boolean {
  // Implement specific regulatory compliance checks
  return true; // Placeholder implementation
}

export type { FormField, ValidationRule } from "./types.ts";
