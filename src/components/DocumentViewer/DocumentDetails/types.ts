
export interface EditableField {
  label: string;
  key: string;
  value: string | undefined;
  showForTypes: string[];
}

export interface DocumentDetailsProps {
  clientName?: string;
  trusteeName?: string;
  dateSigned?: string;
  formNumber?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  summary?: string;
  documentId: string;
  formType?: string;
}
