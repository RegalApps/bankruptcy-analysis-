
import { useState, useMemo } from 'react';

interface Field {
  key: string;
  label: string;
  value: string;
}

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
  claimAmount?: string,
  claimType?: string
) => {
  const getRelevantFields = (formType: string): Field[] => {
    // Basic fields for all documents
    const basicFields: Field[] = [
      {
        key: 'clientName',
        label: 'Client Name',
        value: clientName || ''
      }
    ];

    if (formType === 'form-31' || formType?.includes('proof-of-claim')) {
      // Fields specific to Form 31 - Proof of Claim
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '31'
        },
        {
          key: 'claimantName',
          label: 'Creditor Name',
          value: claimantName || ''
        },
        {
          key: 'claimAmount',
          label: 'Claim Amount',
          value: claimAmount || ''
        },
        {
          key: 'claimType',
          label: 'Claim Type',
          value: claimType || ''
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || ''
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || ''
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review'
        }
      ];
    } else if (formType === 'form-47' || formType?.includes('consumer-proposal')) {
      // Fields specific to Form 47 - Consumer Proposal
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '47'
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || ''
        },
        {
          key: 'administratorName',
          label: 'Administrator Name',
          value: administratorName || trusteeName || ''
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || ''
        },
        {
          key: 'filingDate',
          label: 'Filing Date',
          value: filingDate || dateSigned || ''
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review'
        }
      ];
    } else if (formType?.includes('bankruptcy') || formType?.includes('assignment')) {
      // Fields related to bankruptcy forms
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || ''
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || ''
        },
        {
          key: 'dateBankruptcy',
          label: 'Date of Bankruptcy',
          value: dateBankruptcy || dateSigned || ''
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || ''
        },
        {
          key: 'district',
          label: 'District',
          value: district || ''
        },
        {
          key: 'divisionNumber',
          label: 'Division Number',
          value: divisionNumber || ''
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review'
        }
      ];
    } else {
      // Generic fields for unknown document types
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || ''
        },
        {
          key: 'trusteeName',
          label: 'Trustee Name',
          value: trusteeName || ''
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || ''
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review'
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || ''
        }
      ];
    }
  };

  return { getRelevantFields };
};
