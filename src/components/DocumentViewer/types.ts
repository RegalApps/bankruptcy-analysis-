
export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
  deadline?: string;
}

export interface DocumentDetails {
  id: string;
  title?: string;
  type?: string;
  status?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  analysis?: { 
    content: any 
  }[];
  comments?: any[];
  deadline?: string;
  submission_date?: string;
  size?: number;
  storage_path?: string;
  deadlines?: Deadline[];
  file_size?: string;
  creation_date?: string;
}

export interface DocumentSummaryProps {
  summary?: string;
  regulatoryCompliance?: {
    status: string;
    details: string[];
    references: string[];
  };
}

export interface ExtractedInfo {
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  trusteeName?: string;
  trusteeAddress?: string;
  trusteeEmail?: string;
  trusteePhone?: string;
  formType?: string;
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
  filingDate?: string;
  submissionDeadline?: string;
  documentStatus?: string;
  summary?: string;
  paymentSchedule?: string;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'upcoming' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high';
  related_to?: string;
  type?: string;
  created_by?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_at?: string;
  created_by?: string;
  document_id?: string;
  risk_id?: string;
  solution?: string;
  requiredAction?: string;
  severity?: string;
  regulation?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at?: string;
  created_by?: string;
  is_current?: boolean;
  description?: string;
  changes_summary?: string;
  storage_path?: string;
}

export interface Form31FieldMapping {
  section1: {
    creditorMailingAddress: string;
    creditorFacsimileEmail?: string;
    contactPersonName: string;
    contactTelephone: string;
  };
  section2: {
    debtorName: string;
    debtorCity: string;
    debtorProvince: string;
    creditorName: string;
  };
  section3: {
    certifierName: string;
    isRepresentative: boolean;
    debtValidityDate: string;
    debtAmountCAD: number;
    isStatuteBarred: boolean;
  };
  section4: {
    dateDebtDue: string;
    lastPaymentDate?: string;
    lastAcknowledgementDate?: string;
    claimHistory: string;
  };
  section5: {
    unsecuredClaim?: {
      amount: number;
      prioritySubsection?: string;
      priorityJustification?: string;
    };
    lessorClaim?: {
      amount: number;
      leaseParticulars: string;
      hasAttachedLease: boolean;
    };
    securedClaim?: {
      amount: number;
      securityValue: number;
      hasAttachedDocumentation: boolean;
    };
    farmerFishermanClaim?: {
      amount: number;
      hasAttachedRecords: boolean;
    };
    wageEarnerClaim?: {
      amount: number;
      employmentPeriodStart: string;
      employmentPeriodEnd: string;
      hasAttachedRecords: boolean;
    };
    pensionPlanClaim?: {
      amount: number;
      hasAttachedRecords: boolean;
    };
    directorClaim?: {
      amount: number;
      hasAttachedProof: boolean;
    };
    securitiesFirmClaim?: {
      amount: number;
      hasAttachedStatements: boolean;
    };
  };
  section6: {
    isRelatedToDebtor: boolean;
    hadNonArmsLengthTransactions: boolean;
    transfersAtUndervalue?: string;
  };
  section7: {
    requestSurplusIncomeNotification: boolean;
    requestTrusteeDischargeReport: boolean;
  };
  section8: {
    executionDate: string;
    hasSignature: boolean;
  };
  section9: {
    hasScheduleA: boolean;
    additionalAttachments?: string[];
  };
}
