
import { IncomeExpenseData } from "../../types";

export const mapDatabaseRecordToIncomeExpenseData = (record: any): IncomeExpenseData => {
  const metadata = record.metadata || {};
  
  // Helper function to convert numbers to strings safely
  const numToStr = (value: any): string => {
    if (value === null || value === undefined) return '';
    return typeof value === 'number' ? value.toString() : (value || '');
  };
  
  // Check both record and metadata for each field to ensure backwards compatibility
  const getValue = (key: string): string => {
    // Try direct access first
    if (record[key] !== undefined && record[key] !== null) {
      return numToStr(record[key]);
    }
    
    // Then check metadata
    if (metadata[key] !== undefined && metadata[key] !== null) {
      return numToStr(metadata[key]);
    }
    
    // Then try some common mappings
    const mappings: Record<string, string[]> = {
      'employment_income': ['monthly_income'],
      'total_monthly_income': ['monthly_income', 'total_income'],
      'total_essential_expenses': ['total_expenses'],
      'mortgage_rent': ['rent_mortgage'],
      'medical_dental': ['medical_expenses'],
    };
    
    if (mappings[key]) {
      for (const altKey of mappings[key]) {
        if (record[altKey] !== undefined && record[altKey] !== null) {
          return numToStr(record[altKey]);
        }
        if (metadata[altKey] !== undefined && metadata[altKey] !== null) {
          return numToStr(metadata[altKey]);
        }
      }
    }
    
    // Default to empty string
    return '';
  };
  
  return {
    // Client Information
    client_id: record.user_id || "",
    full_name: getValue('full_name'),
    residential_address: getValue('residential_address'),
    phone_home: getValue('phone_home'),
    marital_status: getValue('marital_status'),
    employer_name: getValue('employer_name'),
    work_phone: getValue('work_phone'),
    occupation: getValue('occupation'),
    spouse_name: getValue('spouse_name'),
    household_size: getValue('household_size'),
    submission_date: record.submission_date ? new Date(record.submission_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    
    // Income Information - Debtor
    employment_income: getValue('employment_income'),
    pension_annuities: getValue('pension_annuities'),
    child_spousal_support: getValue('child_spousal_support'),
    self_employment_income: getValue('self_employment_income'),
    government_benefits: getValue('government_benefits'),
    rental_income: getValue('rental_income'),
    other_income: getValue('other_income'),
    other_income_description: getValue('other_income_description'),
    total_monthly_income: getValue('total_monthly_income'),
    
    // Income Information - Spouse
    spouse_employment_income: getValue('spouse_employment_income'),
    spouse_pension_annuities: getValue('spouse_pension_annuities'),
    spouse_child_spousal_support: getValue('spouse_child_spousal_support'),
    spouse_self_employment_income: getValue('spouse_self_employment_income'),
    spouse_government_benefits: getValue('spouse_government_benefits'),
    spouse_rental_income: getValue('spouse_rental_income'),
    spouse_other_income: getValue('spouse_other_income'),
    spouse_total_monthly_income: getValue('spouse_total_monthly_income'),
    
    // Essential Expenses
    mortgage_rent: getValue('mortgage_rent'),
    utilities: getValue('utilities'),
    groceries: getValue('groceries'),
    child_care: getValue('child_care'),
    medical_dental: getValue('medical_dental'),
    transportation: getValue('transportation'),
    education_tuition: getValue('education_tuition'),
    debt_repayments: getValue('debt_repayments'),
    misc_essential_expenses: getValue('misc_essential_expenses'),
    total_essential_expenses: getValue('total_essential_expenses'),
    
    // Discretionary Expenses
    dining_out: getValue('dining_out'),
    alcohol: getValue('alcohol'),
    tobacco: getValue('tobacco'),
    entertainment: getValue('entertainment'),
    gym_memberships: getValue('gym_memberships'),
    gifts_donations: getValue('gifts_donations'),
    subscriptions: getValue('subscriptions'),
    clothing: getValue('clothing'),
    pet_care: getValue('pet_care'),
    leisure_travel: getValue('leisure_travel'),
    other_discretionary: getValue('other_discretionary'),
    other_discretionary_description: getValue('other_discretionary_description'),
    total_discretionary_expenses: getValue('total_discretionary_expenses'),
    
    // Savings & Investments
    emergency_savings: getValue('emergency_savings'),
    retirement_savings: getValue('retirement_savings'),
    education_savings: getValue('education_savings'),
    investment_contributions: getValue('investment_contributions'),
    total_savings: getValue('total_savings'),
    
    // Insurance Expenses
    vehicle_insurance: getValue('vehicle_insurance'),
    health_insurance: getValue('health_insurance'),
    life_insurance: getValue('life_insurance'),
    home_insurance: getValue('home_insurance'),
    other_insurance: getValue('other_insurance'),
    other_insurance_description: getValue('other_insurance_description'),
    total_insurance: getValue('total_insurance'),
    
    // Signature & Consent
    electronic_signature: getValue('electronic_signature'),
    verification_date: getValue('verification_date'),
    consent_data_use: getValue('consent_data_use'),
    consent_date: getValue('consent_date'),
    
    // Frequency settings
    income_frequency: (getValue('income_frequency') || 'monthly') as 'monthly' | 'bi-weekly' | 'weekly',
    expense_frequency: (getValue('expense_frequency') || 'monthly') as 'monthly' | 'bi-monthly' | 'one-time',
    notes: getValue('notes'),
  };
};
