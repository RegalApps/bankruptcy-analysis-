
export interface FormField {
  name: string;
  type: 'text' | 'date' | 'number' | 'currency' | 'checkbox';
  required: boolean;
  pattern?: string;
  description?: string;
}

export interface FormTemplate {
  formNumber: string;
  title: string;
  description: string;
  requiredFields: FormField[];
  validationRules: {
    [key: string]: {
      rule: string;
      message: string;
    }[];
  };
  fieldMappings: {
    [key: string]: string[];
  };
}

export const formTemplates: { [key: string]: FormTemplate } = {
  // Example template for Form 1
  '1': {
    formNumber: '1',
    title: 'Voluntary Petition',
    description: 'Initial bankruptcy filing form',
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
        name: 'caseNumber',
        type: 'text',
        required: true,
        pattern: '^\\d{2}-\\d{5}$',
        description: 'Bankruptcy case number'
      }
    ],
    validationRules: {
      debtorName: [
        {
          rule: 'required',
          message: 'Debtor name is required'
        }
      ],
      filingDate: [
        {
          rule: 'required',
          message: 'Filing date is required'
        },
        {
          rule: 'validDate',
          message: 'Must be a valid date'
        }
      ]
    },
    fieldMappings: {
      debtorName: [
        'Debtor Name:',
        'Name of Debtor',
        'Debtor 1'
      ],
      filingDate: [
        'Date Filed:',
        'Filing Date',
        'Date'
      ],
      caseNumber: [
        'Case Number:',
        'Case No.',
        'Bankruptcy Case #'
      ]
    }
  }
  // Additional form templates would be added here
};
