
export interface AnalysisResult {
  extracted_info: {
    formNumber: string;
    clientName: string;
    dateSigned: string;
    trusteeName: string;
    type: string;
    summary: string;
    clientAddress?: string;
    clientPhone?: string;
    clientEmail?: string;
    trusteeAddress?: string;
    trusteePhone?: string;
    trusteeEmail?: string;
    totalDebts?: string;
    totalAssets?: string;
    monthlyIncome?: string;
  };
  risks: Array<{
    type: string;
    description: string;
    severity: string;
    regulation: string;
    impact: string;
    requiredAction: string;
    solution: string;
    deadline: string;
  }>;
  regulatory_compliance: {
    status: string;
    details: string;
    references: string[];
  };
  // Add Form 31 specific field structure
  form31_fields?: {
    creditor: {
      name: string;
      mailingAddress: string;
      telephone?: string;
      email?: string;
      contactPerson?: string;
    };
    debtor: {
      name: string;
      city?: string;
      province?: string;
    };
    declaration: {
      representativeName?: string;
      isRepresentative: boolean;
      debtValidityDate?: string;
      debtAmount?: string;
      isStatuteBarred?: boolean;
    };
    debtParticulars: {
      debtDueDate?: string;
      lastPaymentDate?: string;
      lastAcknowledgementDate?: string;
      claimHistory?: string;
    };
    claimCategories: {
      unsecured?: {
        amount?: string;
        prioritySubsection?: string;
        priorityJustification?: string;
      };
      lessor?: {
        damagesAmount?: string;
        particulars?: string;
        hasAttachedAgreement?: boolean;
      };
      secured?: {
        amount?: string;
        securityValue?: string;
        hasDocumentation?: boolean;
      };
      farmerFisherman?: {
        amount?: string;
        hasSalesRecords?: boolean;
      };
      wageEarner?: {
        amount?: string;
        employmentPeriod?: string;
        hasPayrollRecords?: boolean;
      };
      pensionPlan?: {
        amount?: string;
        hasContributionRecords?: boolean;
      };
      director?: {
        amount?: string;
        hasLiabilityProof?: boolean;
      };
      securitiesFirm?: {
        netEquityAmount?: string;
        hasAccountStatements?: boolean;
      };
    };
    relationship: {
      isRelatedToDebtor: boolean;
      isNonArmsLength: boolean;
      transfersAtUndervalue?: string;
    };
    bankruptcyRequests: {
      requestSurplusIncomeNotification: boolean;
      requestTrusteeDischargeReport: boolean;
    };
    execution: {
      date?: string;
      hasSigned: boolean;
    };
    attachments: {
      hasScheduleA: boolean;
      otherAttachments?: string[];
    };
    validationIssues: Array<{
      field: string;
      issue: string;
      severity: 'high' | 'medium' | 'low';
      biaReference: string;
    }>;
  };
}

// Add Form 31 specific validation rules
export interface Form31ValidationRules {
  fieldRules: {
    [fieldPath: string]: {
      required: boolean;
      type: 'text' | 'currency' | 'date' | 'boolean' | 'attachment';
      biaReference: string;
      validationFn?: (value: any) => boolean;
      errorMessage?: string;
    }
  };
  conditionalRules: Array<{
    condition: {
      field: string;
      value: any;
    };
    requiredFields: string[];
    biaReference: string;
  }>;
}
