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
  riskLevel: "high" | "medium" | "low"; // Required field
  riskScore: number; // Required field
  complianceStatus: "compliant" | "issues" | "critical"; // Updated to use string literal types
  caseProgress: number; // Required field
  lastContactDate?: string;
  nextFollowUp?: string;
  caseStatus?: string;
  assignedTrustee?: string;
  pendingTasks?: {
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
    action?: string;  // Add this optional field
    timestamp?: string; // Add this optional field for compatibility
  }[];
  aiSuggestions?: {
    id: string;
    text: string;
    type: string;
    message?: string; // Add for compatibility with other components
  }[];
  upcomingDeadlines?: {
    id: string;
    title: string;
    date: string;
    type: string;
    priority?: 'low' | 'medium' | 'high'; // Add for compatibility
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
