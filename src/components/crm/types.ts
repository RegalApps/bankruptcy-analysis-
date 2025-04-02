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
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  complianceStatus: "compliant" | "issues" | "critical";
  caseProgress: number;
  lastContactDate?: string;
  nextFollowUp?: string;
  caseStatus?: string;
  assignedTrustee?: string;
  pendingTasks: {
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }[];
  missingDocuments?: {
    id: string;
    name: string;
    requiredBy: string;
  }[];
  recentActivities?: {
    id: string;
    type: string;
    description: string;
    date: string;
    action?: string;
    timestamp?: string;
  }[];
  aiSuggestions?: {
    id: string;
    text: string;
    type: string;
    message?: string;
  }[];
  upcomingDeadlines?: {
    id: string;
    title: string;
    date: string;
    type: string;
    priority?: 'low' | 'medium' | 'high';
  }[];
  clientNotes?: {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    attachments?: string[];
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

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  mobilePhone: string;
  companyName: string;
  businessType: string;
  notes: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  sin: string;
  maritalStatus: string;
  leadSource: string;
  otherLeadSourceDetails: string;
  leadDescription: string;
  accountStatus: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  employmentType?: string;
  employer?: string;
  occupation?: string;
  monthlyIncome?: string;
  incomeFrequency?: string;
  businessName?: string;
  annualRevenue?: string;
  unsecuredDebt?: string;
  securedDebt?: string;
  taxDebt?: string;
  realEstate?: string;
  vehicles?: string;
  bankAccounts?: string;
  [key: string]: string | undefined;
}
