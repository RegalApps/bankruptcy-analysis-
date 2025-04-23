import { useState, useMemo } from 'react';
import { EditableField } from "../types";
import { normalizeFormType } from '@/utils/formTypeUtils';

export const useDocumentFields = (
  clientName?: string,
  trusteeName?: string,
  administratorName?: string,
  dateSigned?: string,
  formNumber?: string,
  estateNumber?: string,
  district?: string,
  divisionNumber?: string,
  courtNumber?: string,
  meetingOfCreditors?: string,
  chairInfo?: string,
  securityInfo?: string,
  dateBankruptcy?: string,
  officialReceiver?: string,
  documentStatus?: string,
  filingDate?: string,
  submissionDeadline?: string,
  formType?: string,
  // Form 31 specific fields
  claimantName?: string,
  creditorName?: string,
  claimAmount?: string,
  claimType?: string,
  securityDetails?: string,
  debtorName?: string,
  creditorAddress?: string,
  claimClassification?: string
) => {
  const getRelevantFields = (formType: string): EditableField[] => {
    const normalized = normalizeFormType(formType);
    // Basic fields for all documents
    const basicFields: EditableField[] = [
      {
        key: 'clientName',
        label: 'Client Name',
        value: clientName || '',
        showForTypes: ['all']
      }
    ];

    if (normalized === 'form31' || normalized.includes('proofofclaim')) {
      // Fields specific to Form 31 - Proof of Claim
      return [
        {
          key: 'formNumber',
          label: 'Form Type',
          value: formNumber || '31 – Proof of Claim',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'debtorName',
          label: 'Debtor',
          value: debtorName || 'GreenTech Supplies Inc.',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'creditorName',
          label: 'Creditor',
          value: creditorName || 'ABC Restructuring Ltd.',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimantName',
          label: 'Creditor Representative',
          value: claimantName || 'Neil Armstrong',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimAmount',
          label: 'Amount Owed',
          value: claimAmount || '$89,355',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimType',
          label: 'Claim Type',
          value: claimType || 'Unsecured Claim (no security held)',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'dateBankruptcy',
          label: 'Date of Bankruptcy',
          value: dateBankruptcy || 'March 15, 2025',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'dateSigned',
          label: 'Form Signed',
          value: dateSigned || 'April 8, 2025',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Submitted',
          showForTypes: ['all']
        }
      ];
    } else if (normalized === 'form47' || normalized.includes('consumerproposal')) {
      // Fields specific to Form 47 - Consumer Proposal
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '47',
          showForTypes: ['form-47', 'consumer-proposal']
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || '',
          showForTypes: ['form-47', 'consumer-proposal']
        },
        {
          key: 'administratorName',
          label: 'Administrator Name',
          value: administratorName || trusteeName || '',
          showForTypes: ['form-47', 'consumer-proposal']
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || '',
          showForTypes: ['all']
        },
        {
          key: 'filingDate',
          label: 'Filing Date',
          value: filingDate || dateSigned || '',
          showForTypes: ['form-47', 'consumer-proposal']
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review',
          showForTypes: ['all']
        }
      ];
    } else if (normalized.includes('bankruptcy') || normalized.includes('assignment')) {
      // Fields related to bankruptcy forms
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'dateBankruptcy',
          label: 'Date of Bankruptcy',
          value: dateBankruptcy || dateSigned || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'district',
          label: 'District',
          value: district || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'divisionNumber',
          label: 'Division Number',
          value: divisionNumber || '',
          showForTypes: ['bankruptcy', 'assignment']
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review',
          showForTypes: ['all']
        }
      ];
    } else {
      // Generic fields for unknown document types
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '',
          showForTypes: ['all']
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || '',
          showForTypes: ['all']
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || '',
          showForTypes: ['all']
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review',
          showForTypes: ['all']
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || '',
          showForTypes: ['all']
        }
      ];
    }
  };

  return { getRelevantFields };
};
