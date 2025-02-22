<lov-code>
import { FormTemplate, FormField, ValidationRule } from "./types";

// Common validation rules
const commonValidations = {
  required: (fieldName: string): ValidationRule => ({
    rule: 'required',
    message: `${fieldName} is required`
  }),
  minLength: (fieldName: string, length: number): ValidationRule => ({
    rule: 'minLength',
    message: `${fieldName} must be at least ${length} characters`,
    params: { length }
  }),
  maxLength: (fieldName: string, length: number): ValidationRule => ({
    rule: 'maxLength',
    message: `${fieldName} must be no more than ${length} characters`,
    params: { length }
  }),
  pattern: (fieldName: string, pattern: string): ValidationRule => ({
    rule: 'pattern',
    message: `${fieldName} must match the pattern ${pattern}`,
    params: { pattern }
  }),
  validDate: (fieldName: string): ValidationRule => ({
    rule: 'validDate',
    message: `${fieldName} must be a valid date`
  }),
  currency: (fieldName: string): ValidationRule => ({
    rule: 'currency',
    message: 'Must be a valid currency amount'
  }),
  date: (): ValidationRule => ({
    rule: 'validDate',
    message: 'Must be a valid date'
  })
};

// Common regulatory framework references
const commonRegulations = {
  bankruptcy: {
    bia: ['68', '69', '70'],
    ccaa: [],
    osb: ['33', '34', '35']
  },
  proposal: {
    bia: ['66', '67'],
    ccaa: [],
    osb: ['41', '42']
  },
  receivership: {
    bia: ['72', '73'],
    ccaa: ['42', '43'],
    osb: []
  },
  ccaa: {
    bia: [],
    ccaa: ['11', '12'],
    osb: []
  },
  administrative: {
    bia: [],
    ccaa: [],
    osb: []
  }
};

// Add more sophisticated validation patterns
const advancedValidations = {
  ...commonValidations,
  postalCode: (): ValidationRule => ({
    rule: 'pattern',
    message: 'Must be a valid postal code',
    params: { pattern: '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$' }
  }),
  phoneNumber: (): ValidationRule => ({
    rule: 'pattern',
    message: 'Must be a valid phone number',
    params: { pattern: '^\\+?[1-9]\\d{1,14}$' }
  }),
  email: (): ValidationRule => ({
    rule: 'pattern',
    message: 'Must be a valid email address',
    params: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
  }),
  sinNumber: (): ValidationRule => ({
    rule: 'pattern',
    message: 'Must be a valid SIN number',
    params: { pattern: '^\\d{3}-\\d{3}-\\d{3}$' }
  })
};

// Enhanced regulatory framework references
const regulatoryFramework = {
  ...commonRegulations,
  civilProceedings: {
    bia: ['69.3', '69.4'],
    ccaa: ['11.02', '11.03'],
    osb: ['45', '46']
  },
  consumerProposal: {
    bia: ['66.11', '66.12', '66.13', '66.14'],
    osb: ['42', '43']
  },
  corporateProposal: {
    bia: ['50', '51', '52', '53'],
    osb: ['35', '36']
  }
};

export const formTemplates: Record<string, FormTemplate> = {
  "1": {
    formNumber: "1",
    title: "Statement of Affairs",
    category: "bankruptcy",
    description: "Comprehensive overview of the debtor's financial situation",
    requiredFields: [
      {
        name: "totalAssets",
        type: "currency",
        required: true,
        description: "Total value of all assets",
        regulatoryReferences: {
          bia: ['68(1)(a)'],
          osb: ['33(1)(a)']
        }
      },
      {
        name: "totalLiabilities",
        type: "currency",
        required: true,
        description: "Total amount of all liabilities",
        regulatoryReferences: {
          bia: ['68(1)(b)'],
          osb: ['33(1)(b)']
        }
      }
    ],
    validationRules: {
      totalAssets: [
        commonValidations.required("Total Assets"),
        commonValidations.currency()
      ],
      totalLiabilities: [
        commonValidations.required("Total Liabilities"),
        commonValidations.currency()
      ]
    },
    fieldMappings: {
      totalAssets: ["Total Assets:", "Assets Total", "Total Value of Assets"],
      totalLiabilities: ["Total Liabilities:", "Liabilities Total", "Total Value of Liabilities"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "2": {
    formNumber: "2",
    title: "Proof of Claim",
    category: "bankruptcy",
    description: "Formal claim submitted by a creditor",
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        description: "Name of the creditor",
        regulatoryReferences: {
          bia: ['70(1)'],
          osb: ['35(1)']
        }
      },
      {
        name: "amountClaimed",
        type: "currency",
        required: true,
        description: "Amount of the claim",
        regulatoryReferences: {
          bia: ['70(2)'],
          osb: ['35(2)']
        }
      }
    ],
    validationRules: {
      creditorName: [
        commonValidations.required("Creditor Name"),
        commonValidations.minLength("Creditor Name", 2)
      ],
      amountClaimed: [
        commonValidations.required("Amount Claimed"),
        commonValidations.currency()
      ]
    },
    fieldMappings: {
      creditorName: ["Creditor Name:", "Name of Creditor", "Claimant"],
      amountClaimed: ["Amount Claimed:", "Claim Amount", "Total Claim"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "3": {
    formNumber: "3",
    title: "Proxy Form",
    category: "bankruptcy",
    description: "Authorizes a representative to act on behalf of a creditor",
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        description: "Name of the creditor granting proxy",
        regulatoryReferences: {
          bia: ['69(1)'],
          osb: ['34(1)']
        }
      },
      {
        name: "proxyHolderName",
        type: "text",
        required: true,
        description: "Name of the person holding the proxy",
        regulatoryReferences: {
          bia: ['69(2)'],
          osb: ['34(2)']
        }
      }
    ],
    validationRules: {
      creditorName: [
        commonValidations.required("Creditor Name"),
        commonValidations.minLength("Creditor Name", 2)
      ],
      proxyHolderName: [
        commonValidations.required("Proxy Holder Name"),
        commonValidations.minLength("Proxy Holder Name", 2)
      ]
    },
    fieldMappings: {
      creditorName: ["Creditor Name:", "Name of Creditor", "Grantor"],
      proxyHolderName: ["Proxy Holder Name:", "Proxy Name", "Representative"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "4": {
    formNumber: "4",
    title: "Ballot",
    category: "proposal",
    description: "Used for voting on proposals",
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        description: "Name of the creditor casting the ballot",
        regulatoryReferences: {
          bia: ['66(1)'],
          osb: ['41(1)']
        }
      },
      {
        name: "voteChoice",
        type: "select",
        required: true,
        description: "Choice of vote (Yes/No)",
        options: ["Yes", "No"],
        regulatoryReferences: {
          bia: ['66(2)'],
          osb: ['41(2)']
        }
      }
    ],
    validationRules: {
      creditorName: [
        commonValidations.required("Creditor Name"),
        commonValidations.minLength("Creditor Name", 2)
      ],
      voteChoice: [
        commonValidations.required("Vote Choice")
      ]
    },
    fieldMappings: {
      creditorName: ["Creditor Name:", "Name of Creditor", "Voter"],
      voteChoice: ["Vote Choice:", "Choice", "Selection"]
    },
    regulatoryFramework: regulatoryFramework.proposal
  },
  "5": {
    formNumber: "5",
    title: "Notice of Intention to Make a Proposal",
    category: "proposal",
    description: "Formal notice of intent to present a proposal to creditors",
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor filing the notice",
        regulatoryReferences: {
          bia: ['66.11(1)'],
          osb: ['42(1)']
        }
      },
      {
        name: "filingDate",
        type: "date",
        required: true,
        description: "Date the notice was filed",
        regulatoryReferences: {
          bia: ['66.11(2)'],
          osb: ['42(2)']
        }
      }
    ],
    validationRules: {
      debtorName: [
        commonValidations.required("Debtor Name"),
        commonValidations.minLength("Debtor Name", 2)
      ],
      filingDate: [
        commonValidations.required("Filing Date"),
        commonValidations.validDate("Filing Date")
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Applicant"],
      filingDate: ["Filing Date:", "Date Filed", "Notice Date"]
    },
    regulatoryFramework: regulatoryFramework.proposal
  },
  "6": {
    formNumber: "6",
    title: "Proposal",
    category: "proposal",
    description: "Detailed plan presented to creditors",
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor making the proposal",
        regulatoryReferences: {
          bia: ['66.12(1)'],
          osb: ['43(1)']
        }
      },
      {
        name: "proposalDetails",
        type: "multiline",
        required: true,
        description: "Terms and conditions of the proposal",
        regulatoryReferences: {
          bia: ['66.12(2)'],
          osb: ['43(2)']
        }
      }
    ],
    validationRules: {
      debtorName: [
        commonValidations.required("Debtor Name"),
        commonValidations.minLength("Debtor Name", 2)
      ],
      proposalDetails: [
        commonValidations.required("Proposal Details"),
        commonValidations.minLength("Proposal Details", 10)
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Proposer"],
      proposalDetails: ["Proposal Details:", "Terms", "Conditions"]
    },
    regulatoryFramework: regulatoryFramework.proposal
  },
  "7": {
    formNumber: "7",
    title: "Receivership Order",
    category: "receivership",
    description: "Court order appointing a receiver",
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor in receivership",
        regulatoryReferences: {
          bia: ['72(1)'],
          ccaa: ['42(1)']
        }
      },
      {
        name: "receiverName",
        type: "text",
        required: true,
        description: "Name of the appointed receiver",
        regulatoryReferences: {
          bia: ['72(2)'],
          ccaa: ['42(2)']
        }
      }
    ],
    validationRules: {
      debtorName: [
        commonValidations.required("Debtor Name"),
        commonValidations.minLength("Debtor Name", 2)
      ],
      receiverName: [
        commonValidations.required("Receiver Name"),
        commonValidations.minLength("Receiver Name", 2)
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Entity"],
      receiverName: ["Receiver Name:", "Name of Receiver", "Appointee"]
    },
    regulatoryFramework: regulatoryFramework.receivership
  },
  "8": {
    formNumber: "8",
    title: "Notice to Creditors of Receiver's Appointment",
    category: "receivership",
    description: "Notification to creditors regarding the appointment of a receiver",
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor in receivership",
        regulatoryReferences: {
          bia: ['73(1)'],
          ccaa: ['43(1)']
        }
      },
      {
        name: "receiverName",
        type: "text",
        required: true,
        description: "Name of the appointed receiver",
        regulatoryReferences: {
          bia: ['73(2)'],
          ccaa: ['43(2)']
        }
      },
      {
        name: "appointmentDate",
        type: "date",
        required: true,
        description: "Date of the receiver's appointment",
        regulatoryReferences: {
          bia: ['73(3)'],
          ccaa: ['43(3)']
        }
      }
    ],
    validationRules: {
      debtorName: [
        commonValidations.required("Debtor Name"),
        commonValidations.minLength("Debtor Name", 2)
      ],
      receiverName: [
        commonValidations.required("Receiver Name"),
        commonValidations.minLength("Receiver Name", 2)
      ],
      appointmentDate: [
        commonValidations.required("Appointment Date"),
        commonValidations.validDate("Appointment Date")
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Entity"],
      receiverName: ["Receiver Name:", "Name of Receiver", "Appointee"],
      appointmentDate: ["Appointment Date:", "Date Appointed", "Effective Date"]
    },
    regulatoryFramework: regulatoryFramework.receivership
  },
  "9": {
    formNumber: "9",
    title: "CCAA Initial Order",
    category: "ccaa",
    description: "Initial order under the Companies' Creditors Arrangement Act",
    requiredFields: [
      {
        name: "companyName",
        type: "text",
        required: true,
        description: "Name of the company seeking protection",
        regulatoryReferences: {
          ccaa: ['11(1)']
        }
      },
      {
        name: "courtName",
        type: "text",
        required: true,
        description: "Name of the court issuing the order",
        regulatoryReferences: {
          ccaa: ['11(2)']
        }
      },
      {
        name: "orderDate",
        type: "date",
        required: true,
        description: "Date of the order",
        regulatoryReferences: {
          ccaa: ['11(3)']
        }
      }
    ],
    validationRules: {
      companyName: [
        commonValidations.required("Company Name"),
        commonValidations.minLength("Company Name", 2)
      ],
      courtName: [
        commonValidations.required("Court Name"),
        commonValidations.minLength("Court Name", 2)
      ],
      orderDate: [
        commonValidations.required("Order Date"),
        commonValidations.validDate("Order Date")
      ]
    },
    fieldMappings: {
      companyName: ["Company Name:", "Name of Company", "Applicant"],
      courtName: ["Court Name:", "Name of Court", "Jurisdiction"],
      orderDate: ["Order Date:", "Date of Order", "Effective Date"]
    },
    regulatoryFramework: regulatoryFramework.ccaa
  },
  "10": {
    formNumber: "10",
    title: "Notice of Bankruptcy",
    category: "bankruptcy",
    description: "Official notice of bankruptcy filing",
    requiredFields: [
      {
        name: "bankruptcyDate",
        type: "date",
        required: true,
        description: "Date of bankruptcy",
        regulatoryReferences: {
          bia: ['69(1)'],
          osb: ['34']
        }
      }
    ],
    validationRules: {
      bankruptcyDate: [
        advancedValidations.required("Bankruptcy date"),
        advancedValidations.date()
      ]
    },
    fieldMappings: {
      bankruptcyDate: [
        "Date of Bankruptcy:",
        "Bankruptcy Date",
        "Filed Date",
        "Date of Filing"
      ]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "11": {
    formNumber: "11",
    title: "List of Creditors",
    category: "bankruptcy",
    description: "A detailed list of all creditors with outstanding claims.",
    requiredFields: [
      {
        name: "creditorName",
        type: "text",
        required: true,
        description: "Name of the creditor.",
        regulatoryReferences: {
          bia: ['121(1)'],
          osb: ['60']
        }
      },
      {
        name: "amountOwed",
        type: "currency",
        required: true,
        description: "Amount owed to the creditor.",
        regulatoryReferences: {
          bia: ['121(2)'],
          osb: ['60']
        }
      }
    ],
    validationRules: {
      creditorName: [
        advancedValidations.required("Creditor Name"),
        advancedValidations.minLength("Creditor Name", 2)
      ],
      amountOwed: [
        advancedValidations.required("Amount Owed"),
        advancedValidations.currency()
      ]
    },
    fieldMappings: {
      creditorName: ["Creditor Name:", "Name of Creditor", "Claimant"],
      amountOwed: ["Amount Owed:", "Claim Amount", "Total Claim"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "12": {
    formNumber: "12",
    title: "Statement of Income and Expenses",
    category: "bankruptcy",
    description: "A detailed statement of the debtor's income and expenses.",
    requiredFields: [
      {
        name: "totalIncome",
        type: "currency",
        required: true,
        description: "Total monthly income.",
        regulatoryReferences: {
          bia: ['158(1)'],
          osb: ['75']
        }
      },
      {
        name: "totalExpenses",
        type: "currency",
        required: true,
        description: "Total monthly expenses.",
        regulatoryReferences: {
          bia: ['158(2)'],
          osb: ['75']
        }
      }
    ],
    validationRules: {
      totalIncome: [
        advancedValidations.required("Total Income"),
        advancedValidations.currency()
      ],
      totalExpenses: [
        advancedValidations.required("Total Expenses"),
        advancedValidations.currency()
      ]
    },
    fieldMappings: {
      totalIncome: ["Total Income:", "Monthly Income", "Income Total"],
      totalExpenses: ["Total Expenses:", "Monthly Expenses", "Expenses Total"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "13": {
    formNumber: "13",
    title: "List of Assets",
    category: "bankruptcy",
    description: "A detailed list of all assets owned by the debtor.",
    requiredFields: [
      {
        name: "assetDescription",
        type: "text",
        required: true,
        description: "Description of the asset.",
        regulatoryReferences: {
          bia: ['159(1)'],
          osb: ['76']
        }
      },
      {
        name: "assetValue",
        type: "currency",
        required: true,
        description: "Value of the asset.",
        regulatoryReferences: {
          bia: ['159(2)'],
          osb: ['76']
        }
      }
    ],
    validationRules: {
      assetDescription: [
        advancedValidations.required("Asset Description"),
        advancedValidations.minLength("Asset Description", 2)
      ],
      assetValue: [
        advancedValidations.required("Asset Value"),
        advancedValidations.currency()
      ]
    },
    fieldMappings: {
      assetDescription: ["Asset Description:", "Description of Asset", "Asset Name"],
      assetValue: ["Asset Value:", "Value of Asset", "Asset Worth"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "14": {
    formNumber: "14",
    title: "List of Liabilities",
    category: "bankruptcy",
    description: "A detailed list of all liabilities owed by the debtor.",
    requiredFields: [
      {
        name: "liabilityDescription",
        type: "text",
        required: true,
        description: "Description of the liability.",
        regulatoryReferences: {
          bia: ['160(1)'],
          osb: ['77']
        }
      },
      {
        name: "liabilityAmount",
        type: "currency",
        required: true,
        description: "Amount of the liability.",
        regulatoryReferences: {
          bia: ['160(2)'],
          osb: ['77']
        }
      }
    ],
    validationRules: {
      liabilityDescription: [
        advancedValidations.required("Liability Description"),
        advancedValidations.minLength("Liability Description", 2)
      ],
      liabilityAmount: [
        advancedValidations.required("Liability Amount"),
        advancedValidations.currency()
      ]
    },
    fieldMappings: {
      liabilityDescription: ["Liability Description:", "Description of Liability", "Liability Name"],
      liabilityAmount: ["Liability Amount:", "Amount of Liability", "Liability Worth"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "15": {
    formNumber: "15",
    title: "Notice of First Meeting of Creditors",
    category: "bankruptcy",
    description: "Official notice of the first meeting of creditors.",
    requiredFields: [
      {
        name: "meetingDate",
        type: "date",
        required: true,
        description: "Date of the meeting.",
        regulatoryReferences: {
          bia: ['102(1)'],
          osb: ['50']
        }
      },
      {
        name: "meetingLocation",
        type: "text",
        required: true,
        description: "Location of the meeting.",
        regulatoryReferences: {
          bia: ['102(2)'],
          osb: ['50']
        }
      }
    ],
    validationRules: {
      meetingDate: [
        advancedValidations.required("Meeting Date"),
        advancedValidations.date()
      ],
      meetingLocation: [
        advancedValidations.required("Meeting Location"),
        advancedValidations.minLength("Meeting Location", 2)
      ]
    },
    fieldMappings: {
      meetingDate: ["Meeting Date:", "Date of Meeting", "Meeting Time"],
      meetingLocation: ["Meeting Location:", "Location of Meeting", "Meeting Place"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "16": {
    formNumber: "16",
    title: "Minutes of the First Meeting of Creditors",
    category: "bankruptcy",
    description: "Official minutes of the first meeting of creditors.",
    requiredFields: [
      {
        name: "meetingDate",
        type: "date",
        required: true,
        description: "Date of the meeting.",
        regulatoryReferences: {
          bia: ['102(1)'],
          osb: ['50']
        }
      },
      {
        name: "attendees",
        type: "text",
        required: true,
        description: "List of attendees.",
        regulatoryReferences: {
          bia: ['102(2)'],
          osb: ['50']
        }
      }
    ],
    validationRules: {
      meetingDate: [
        advancedValidations.required("Meeting Date"),
        advancedValidations.date()
      ],
      attendees: [
        advancedValidations.required("Attendees"),
        advancedValidations.minLength("Attendees", 2)
      ]
    },
    fieldMappings: {
      meetingDate: ["Meeting Date:", "Date of Meeting", "Meeting Time"],
      attendees: ["Attendees:", "List of Attendees", "People Present"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "17": {
    formNumber: "17",
    title: "Application for Discharge",
    category: "bankruptcy",
    description: "Application by the bankrupt for discharge from bankruptcy.",
    requiredFields: [
      {
        name: "applicationDate",
        type: "date",
        required: true,
        description: "Date of the application.",
        regulatoryReferences: {
          bia: ['170(1)'],
          osb: ['85']
        }
      },
      {
        name: "courtName",
        type: "text",
        required: true,
        description: "Name of the court.",
        regulatoryReferences: {
          bia: ['170(2)'],
          osb: ['85']
        }
      }
    ],
    validationRules: {
      applicationDate: [
        advancedValidations.required("Application Date"),
        advancedValidations.date()
      ],
      courtName: [
        advancedValidations.required("Court Name"),
        advancedValidations.minLength("Court Name", 2)
      ]
    },
    fieldMappings: {
      applicationDate: ["Application Date:", "Date of Application", "Filing Date"],
      courtName: ["Court Name:", "Name of Court", "Jurisdiction"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "18": {
    formNumber: "18",
    title: "Notice of Hearing of Application for Discharge",
    category: "bankruptcy",
    description: "Official notice of the hearing for the application for discharge.",
    requiredFields: [
      {
        name: "hearingDate",
        type: "date",
        required: true,
        description: "Date of the hearing.",
        regulatoryReferences: {
          bia: ['172(1)'],
          osb: ['86']
        }
      },
      {
        name: "hearingLocation",
        type: "text",
        required: true,
        description: "Location of the hearing.",
        regulatoryReferences: {
          bia: ['172(2)'],
          osb: ['86']
        }
      }
    ],
    validationRules: {
      hearingDate: [
        advancedValidations.required("Hearing Date"),
        advancedValidations.date()
      ],
      hearingLocation: [
        advancedValidations.required("Hearing Location"),
        advancedValidations.minLength("Hearing Location", 2)
      ]
    },
    fieldMappings: {
      hearingDate: ["Hearing Date:", "Date of Hearing", "Hearing Time"],
      hearingLocation: ["Hearing Location:", "Location of Hearing", "Hearing Place"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "19": {
    formNumber: "19",
    title: "Order of Discharge",
    category: "bankruptcy",
    description: "Official order of discharge from bankruptcy.",
    requiredFields: [
      {
        name: "dischargeDate",
        type: "date",
        required: true,
        description: "Date of the discharge.",
        regulatoryReferences: {
          bia: ['178(1)'],
          osb: ['90']
        }
      },
      {
        name: "courtName",
        type: "text",
        required: true,
        description: "Name of the court.",
        regulatoryReferences: {
          bia: ['178(2)'],
          osb: ['90']
        }
      }
    ],
    validationRules: {
      dischargeDate: [
        advancedValidations.required("Discharge Date"),
        advancedValidations.date()
      ],
      courtName: [
        advancedValidations.required("Court Name"),
        advancedValidations.minLength("Court Name", 2)
      ]
    },
    fieldMappings: {
      dischargeDate: ["Discharge Date:", "Date of Discharge", "Effective Date"],
      courtName: ["Court Name:", "Name of Court", "Jurisdiction"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "20": {
    formNumber: "20",
    title: "Statement of Affairs (Corporations)",
    category: "bankruptcy",
    description: "Statement of Affairs specific to corporate entities.",
    requiredFields: [
      {
        name: "corporationName",
        type: "text",
        required: true,
        description: "Name of the corporation.",
        regulatoryReferences: {
          bia: ['68(1)(a)'],
          osb: ['33(1)(a)']
        }
      },
      {
        name: "totalAssets",
        type: "currency",
        required: true,
        description: "Total assets of the corporation.",
        regulatoryReferences: {
          bia: ['68(1)(b)'],
          osb: ['33(1)(b)']
        }
      }
    ],
    validationRules: {
      corporationName: [
        advancedValidations.required("Corporation Name"),
        advancedValidations.minLength("Corporation Name", 2)
      ],
      totalAssets: [
        advancedValidations.required("Total Assets"),
        advancedValidations.currency()
      ]
    },
    fieldMappings: {
      corporationName: ["Corporation Name:", "Name of Corporation", "Company Name"],
      totalAssets: ["Total Assets:", "Assets Total", "Total Value of Assets"]
    },
    regulatoryFramework: regulatoryFramework.bankruptcy
  },
  "22": {
    formNumber: "22",
    title: "Notice of Intention to Enforce Security",
    category: "receivership",
    description: "Notice to enforce security under the Bankruptcy and Insolvency Act.",
    requiredFields: [
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor.",
        regulatoryReferences: {
          bia: ['244(1)'],
          osb: []
        }
      },
      {
        name: "securityDetails",
        type: "text",
        required: true,
        description: "Details of the security being enforced.",
        regulatoryReferences: {
          bia: ['244(2)'],
          osb: []
        }
      }
    ],
    validationRules: {
      debtorName: [
        advancedValidations.required("Debtor Name"),
        advancedValidations.minLength("Debtor Name", 2)
      ],
      securityDetails: [
        advancedValidations.required("Security Details"),
        advancedValidations.minLength("Security Details", 2)
      ]
    },
    fieldMappings: {
      debtorName: ["Debtor Name:", "Name of Debtor", "Entity"],
      securityDetails: ["Security Details:", "Details of Security", "Security Description"]
    },
    regulatoryFramework: regulatoryFramework.receivership
  },
  "23": {
    formNumber: "23",
    title: "Statement of Receiver",
    category: "receivership",
    description: "Statement of affairs by the receiver.",
    requiredFields: [
      {
        name: "receiverName",
        type: "text",
        required: true,
        description: "Name of the receiver.",
        regulatoryReferences: {
          bia: ['246(1)'],
          osb: []
        }
      },
      {
        name: "debtorName",
        type: "text",
        required: true,
        description: "Name of the debtor.",
        regulatoryReferences: {
          bia: ['246(2)'],
          osb: []
        }
      }
    ],
    validationRules: {
      receiverName: [
        advancedValidations.required("Receiver Name"),
        advancedValidations.minLength("Receiver Name", 2)
      ],
      debtorName: [
        advancedValidations
