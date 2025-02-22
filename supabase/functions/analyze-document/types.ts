
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
  regulation: string;
  requiredAction: string;
  solution: string;
}

export interface ExtractedInfo {
  type: string;
  formNumber: string;
  clientName?: string;
  dateSigned?: string;
  trusteeName?: string;
  estateNumber?: string;
  district?: string;
  divisionNumber?: string;
  courtNumber?: string;
  meetingOfCreditors?: string;
  chairInfo?: string;
  securityInfo?: string;
  dateBankruptcy?: string;
  officialReceiver?: string;
  summary: string;
}

export interface DocumentAnalysis {
  extracted_info: ExtractedInfo;
  risks: Risk[];
}
