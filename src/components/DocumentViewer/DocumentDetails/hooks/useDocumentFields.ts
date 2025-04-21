
import { useState, useMemo } from 'react';
import { EditableField } from "../types";

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
    // Basic fields for all documents
    const basicFields: EditableField[] = [
      {
        key: 'clientName',
        label: 'Client Name',
        value: clientName || '',
        showForTypes: ['all']
      }
    ];

    if (formType === 'form-31' || formType?.includes('proof-of-claim')) {
      // Fields specific to Form 31 - Proof of Claim
      return [
        ...basicFields,
        {
          key: 'formNumber',
          label: 'Form Number',
          value: formNumber || '31',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimantName',
          label: 'Creditor Name',
          value: claimantName || creditorName || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimAmount',
          label: 'Claim Amount',
          value: claimAmount || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'claimType',
          label: 'Claim Type',
          value: claimType || claimClassification || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'securityDetails',
          label: 'Security Details',
          value: securityDetails || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'creditorAddress',
          label: 'Creditor Address',
          value: creditorAddress || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'dateSigned',
          label: 'Date Signed',
          value: dateSigned || '',
          showForTypes: ['all']
        },
        {
          key: 'estateNumber',
          label: 'Estate Number',
          value: estateNumber || '',
          showForTypes: ['form-31', 'proof-of-claim']
        },
        {
          key: 'documentStatus',
          label: 'Status',
          value: documentStatus || 'Pending Review',
          showForTypes: ['all']
        }
      ];
    } else if (formType === 'form-47' || formType?.includes('consumer-proposal')) {
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
    } else if (formType?.includes('bankruptcy') || formType?.includes('assignment')) {
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
