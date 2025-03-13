import { IncomeExpenseData } from "../../types";

// Helper function to convert database record to IncomeExpenseData format
export const mapDatabaseRecordToIncomeExpenseData = (record: any): IncomeExpenseData => {
  // Create a default IncomeExpenseData object with empty strings
  const defaultData: IncomeExpenseData = {
    full_name: "",
    residential_address: "",
    phone_home: "",
    marital_status: "single",
    employer_name: "",
    work_phone: "",
    occupation: "",
    spouse_name: "",
    household_size: "",
    submission_date: "",
    
    employment_income: "",
    pension_annuities: "",
    child_spousal_support: "",
    self_employment_income: "",
    government_benefits: "",
    rental_income: "",
    other_income: "",
    other_income_description: "",
    total_monthly_income: "",
    
    spouse_employment_income: "",
    spouse_pension_annuities: "",
    spouse_child_spousal_support: "",
    spouse_self_employment_income: "",
    spouse_government_benefits: "",
    spouse_rental_income: "",
    spouse_other_income: "",
    spouse_total_monthly_income: "",
    
    mortgage_rent: "",
    utilities: "",
    groceries: "",
    child_care: "",
    medical_dental: "",
    transportation: "",
    education_tuition: "",
    debt_repayments: "",
    misc_essential_expenses: "",
    total_essential_expenses: "",
    
    dining_out: "",
    alcohol: "",
    tobacco: "",
    entertainment: "",
    gym_memberships: "",
    gifts_donations: "",
    subscriptions: "",
    clothing: "",
    pet_care: "",
    leisure_travel: "",
    other_discretionary: "",
    other_discretionary_description: "",
    total_discretionary_expenses: "",
    
    emergency_savings: "",
    retirement_savings: "",
    education_savings: "",
    investment_contributions: "",
    total_savings: "",
    
    vehicle_insurance: "",
    health_insurance: "",
    life_insurance: "",
    home_insurance: "",
    other_insurance: "",
    other_insurance_description: "",
    total_insurance: "",
    
    income_frequency: "monthly",
    expense_frequency: "monthly",
    notes: ""
  };

  // Map database fields to our IncomeExpenseData structure
  if (record) {
    // Extract metadata (if any) which might contain our extended fields
    const metadata = record.metadata || {};

    // Map client info (could be in metadata or directly on record)
    defaultData.full_name = metadata.full_name || record.full_name || "";
    defaultData.residential_address = metadata.residential_address || record.residential_address || "";
    defaultData.phone_home = metadata.phone_home || record.phone_home || "";
    defaultData.marital_status = metadata.marital_status || record.marital_status || "single";
    defaultData.employer_name = metadata.employer_name || record.employer_name || "";
    defaultData.work_phone = metadata.work_phone || record.work_phone || "";
    defaultData.occupation = metadata.occupation || record.occupation || "";
    defaultData.spouse_name = metadata.spouse_name || record.spouse_name || "";
    defaultData.household_size = metadata.household_size || record.household_size || "";
    defaultData.submission_date = record.submission_date || "";
    
    // Map income fields - handling both string and number types
    defaultData.employment_income = record.employment_income?.toString() || "";
    defaultData.pension_annuities = metadata.pension_annuities?.toString() || "";
    defaultData.child_spousal_support = metadata.child_spousal_support?.toString() || "";
    defaultData.self_employment_income = metadata.self_employment_income?.toString() || "";
    defaultData.government_benefits = metadata.government_benefits?.toString() || "";
    defaultData.rental_income = metadata.rental_income?.toString() || "";
    defaultData.other_income = record.other_income?.toString() || "";
    defaultData.other_income_description = metadata.other_income_description || "";
    defaultData.total_monthly_income = record.total_income?.toString() || record.monthly_income?.toString() || "";
    
    // Map spouse income fields
    defaultData.spouse_employment_income = metadata.spouse_employment_income?.toString() || "";
    defaultData.spouse_pension_annuities = metadata.spouse_pension_annuities?.toString() || "";
    defaultData.spouse_child_spousal_support = metadata.spouse_child_spousal_support?.toString() || "";
    defaultData.spouse_self_employment_income = metadata.spouse_self_employment_income?.toString() || "";
    defaultData.spouse_government_benefits = metadata.spouse_government_benefits?.toString() || "";
    defaultData.spouse_rental_income = metadata.spouse_rental_income?.toString() || "";
    defaultData.spouse_other_income = metadata.spouse_other_income?.toString() || "";
    defaultData.spouse_total_monthly_income = metadata.spouse_total_monthly_income?.toString() || "";
    
    // Map expense fields - essential expenses
    defaultData.mortgage_rent = record.rent_mortgage?.toString() || "";
    defaultData.utilities = record.utilities?.toString() || "";
    defaultData.groceries = record.food?.toString() || metadata.groceries?.toString() || "";
    defaultData.child_care = metadata.child_care?.toString() || "";
    defaultData.medical_dental = record.medical_expenses?.toString() || metadata.medical_dental?.toString() || "";
    defaultData.transportation = record.transportation?.toString() || "";
    defaultData.education_tuition = metadata.education_tuition?.toString() || "";
    defaultData.debt_repayments = metadata.debt_repayments?.toString() || "";
    defaultData.misc_essential_expenses = metadata.misc_essential_expenses?.toString() || "";
    defaultData.total_essential_expenses = record.total_expenses?.toString() || metadata.total_essential_expenses?.toString() || "";
    
    // Map expense fields - discretionary expenses
    defaultData.dining_out = metadata.dining_out?.toString() || "";
    defaultData.alcohol = metadata.alcohol?.toString() || "";
    defaultData.tobacco = metadata.tobacco?.toString() || "";
    defaultData.entertainment = metadata.entertainment?.toString() || "";
    defaultData.gym_memberships = metadata.gym_memberships?.toString() || "";
    defaultData.gifts_donations = metadata.gifts_donations?.toString() || "";
    defaultData.subscriptions = metadata.subscriptions?.toString() || "";
    defaultData.clothing = metadata.clothing?.toString() || "";
    defaultData.pet_care = metadata.pet_care?.toString() || "";
    defaultData.leisure_travel = metadata.leisure_travel?.toString() || "";
    defaultData.other_discretionary = metadata.other_discretionary?.toString() || "";
    defaultData.other_discretionary_description = metadata.other_discretionary_description || "";
    defaultData.total_discretionary_expenses = metadata.total_discretionary_expenses?.toString() || "";
    
    // Map savings fields
    defaultData.emergency_savings = metadata.emergency_savings?.toString() || "";
    defaultData.retirement_savings = metadata.retirement_savings?.toString() || "";
    defaultData.education_savings = metadata.education_savings?.toString() || "";
    defaultData.investment_contributions = metadata.investment_contributions?.toString() || "";
    defaultData.total_savings = metadata.total_savings?.toString() || "";
    
    // Map insurance fields
    defaultData.vehicle_insurance = metadata.vehicle_insurance?.toString() || "";
    defaultData.health_insurance = metadata.health_insurance?.toString() || "";
    defaultData.life_insurance = metadata.life_insurance?.toString() || "";
    defaultData.home_insurance = metadata.home_insurance?.toString() || "";
    defaultData.other_insurance = metadata.other_insurance?.toString() || record.insurance?.toString() || "";
    defaultData.other_insurance_description = metadata.other_insurance_description || "";
    defaultData.total_insurance = metadata.total_insurance?.toString() || "";
    
    // Other fields
    defaultData.notes = record.notes || "";
  }
  
  return defaultData;
};
