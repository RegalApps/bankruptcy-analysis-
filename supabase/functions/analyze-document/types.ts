
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact?: string;
  requiredAction?: string;
  solution?: string;
  regulation?: string;
  reference?: string;
}

export interface ExtractedInfo {
  type?: string;
  clientName?: string;
  clientAddress?: string;
  trusteeName?: string;
  trusteeAddress?: string;
  formNumber?: string;
  dateSigned?: string;
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
}
