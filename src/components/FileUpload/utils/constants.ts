
export const FINANCIAL_TERMS = [
  'bankruptcy',
  'insolvency',
  'creditor',
  'debtor',
  'trustee',
  'proposal',
  'liquidation',
  'assignment',
  'discharge',
  'estate',
  'receiver',
  'secured',
  'unsecured',
  'asset',
  'liability',
  'petition',
  'stay of proceedings',
  'meeting of creditors',
  'proof of claim',
  'dividend',
  'discharge',
  'certificate',
];

export const RISK_SEVERITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const FORM_TYPES = {
  BANKRUPTCY: 'bankruptcy',
  PROPOSAL: 'proposal',
  MEETING: 'meeting',
  COURT: 'court',
  UNKNOWN: 'unknown',
} as const;

export const MANDATORY_FIELDS = {
  [FORM_TYPES.BANKRUPTCY]: [
    'formNumber',
    'clientName',
    'trusteeName',
    'dateSigned',
    'estateNumber',
  ],
  [FORM_TYPES.PROPOSAL]: [
    'formNumber',
    'clientName',
    'trusteeName',
    'dateSigned',
    'proposalAmount',
  ],
  // ... add other form types
} as const;
