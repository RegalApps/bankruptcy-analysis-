
export interface ClientInsightData {
  id?: string;
  clientProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
    website?: string;
    avatarUrl?: string;
    tags?: string[];
    assignedAgent?: string;
    leadDescription?: string;
    leadSource?: string;
    accountStatus?: string;
  };
  financialData?: {
    income?: number;
    expenses?: number;
    assets?: number;
    liabilities?: number;
    creditScore?: number;
  };
  interactions?: {
    date: string;
    type: string;
    description: string;
  }[];
}

export interface ClientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  tags?: string[];
}
