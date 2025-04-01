
export interface FormData {
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  businessType: string;
  notes: string;
  address: string;
  
  // Enhanced Personal Information
  dateOfBirth?: string;
  sin?: string;
  maritalStatus?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  mobilePhone?: string;
  leadSource?: string;
  otherLeadSourceDetails?: string;
  preferredContactMethod?: string;
  preferredLanguage?: string;
  
  // Lead Information
  leadDescription?: string;
  accountStatus?: string;
  
  // Spouse Information (if married/common-law)
  spouseName?: string;
  spouseSin?: string;
  spouseIncome?: string;
  
  // Employment & Income Details
  employmentType?: string;
  employer?: string;
  occupation?: string;
  industry?: string;
  monthlyIncome?: string;
  incomeFrequency?: string;
  
  // Government Benefits
  ei?: string;
  cpp?: string;
  oas?: string;
  disability?: string;
  childBenefits?: string;
  
  // Business Information (if self-employed)
  businessName?: string;
  businessNumber?: string; 
  annualRevenue?: string;
  annualExpenses?: string;
  businessTaxes?: string;
  
  // Debt Information
  unsecuredDebt?: string;
  securedDebt?: string;
  taxDebt?: string;
  courtJudgments?: string;
  
  // Asset Information
  realEstate?: string;
  bankAccounts?: string;
  investments?: string;
  vehicles?: string;
  personalAssets?: string;
  
  // Monthly Expenses
  housingCosts?: string;
  utilitiesInternet?: string;
  transportationCosts?: string;
  foodHousehold?: string;
  childcareEducation?: string;
  healthcareExpenses?: string;
  entertainmentDiscretionary?: string;
  debtRepayments?: string;
}
