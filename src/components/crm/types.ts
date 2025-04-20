
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
  riskLevel: "high" | "medium" | "low"; // Changed to non-optional to match activity hooks type
  riskScore: number; // Changed to non-optional to match activity hooks type
  complianceStatus: string; // Changed to non-optional to match activity hooks type
  caseProgress: number; // Changed to non-optional to match activity hooks type
  assignedTrustee?: string;
  // Add the missing properties
  pendingTasks?: {
    id: string;
    title: string;
    dueDate: string;
    priority: string;
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
  }[];
  aiSuggestions?: {
    id: string;
    text: string;
    type: string;
  }[];
  upcomingDeadlines?: {
    id: string;
    title: string;
    date: string;
    type: string;
  }[];
  lastContactDate?: string;
  nextFollowUp?: string;
  caseStatus?: string;
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

// Add FormData interface
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
