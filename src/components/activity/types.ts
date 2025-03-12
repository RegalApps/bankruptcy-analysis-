
export interface IncomeExpenseData {
  // Client Information
  client_id?: string;
  full_name: string;
  residential_address: string;
  phone_home: string;
  marital_status: string;
  employer_name: string;
  work_phone: string;
  occupation: string;
  spouse_name: string;
  household_size: string;
  submission_date: string;
  
  // Income Information - Debtor
  employment_income: string;
  pension_annuities: string;
  child_spousal_support: string;
  self_employment_income: string;
  government_benefits: string;
  rental_income: string;
  other_income: string;
  other_income_description: string;
  total_monthly_income: string;
  
  // Income Information - Spouse
  spouse_employment_income: string;
  spouse_pension_annuities: string;
  spouse_child_spousal_support: string;
  spouse_self_employment_income: string;
  spouse_government_benefits: string;
  spouse_rental_income: string;
  spouse_other_income: string;
  spouse_total_monthly_income: string;
  
  // Essential Expenses
  mortgage_rent: string;
  utilities: string;
  groceries: string;
  child_care: string;
  medical_dental: string;
  transportation: string;
  education_tuition: string;
  debt_repayments: string;
  misc_essential_expenses: string;
  total_essential_expenses: string;
  
  // Discretionary Expenses
  dining_out: string;
  alcohol: string;
  tobacco: string;
  entertainment: string;
  gym_memberships: string;
  gifts_donations: string;
  subscriptions: string;
  clothing: string;
  pet_care: string;
  leisure_travel: string;
  other_discretionary: string;
  other_discretionary_description: string;
  total_discretionary_expenses: string;
  
  // Savings & Investments
  emergency_savings: string;
  retirement_savings: string;
  education_savings: string;
  investment_contributions: string;
  total_savings: string;
  
  // Insurance Expenses
  vehicle_insurance: string;
  health_insurance: string;
  life_insurance: string;
  home_insurance: string;
  other_insurance: string;
  other_insurance_description: string;
  total_insurance: string;
  
  // Frequency settings
  income_frequency: 'monthly' | 'bi-weekly' | 'weekly';
  expense_frequency: 'monthly' | 'bi-monthly' | 'one-time';
  notes: string;
}

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
}

export interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  last_activity?: string;
}
