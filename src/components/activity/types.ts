
export interface IncomeExpenseData {
  // Client Information
  client_id?: string;
  
  // Income Information
  monthly_income: string;
  employment_income: string;
  primary_salary: string;
  overtime_bonuses: string;
  other_income: string;
  freelance_income: string;
  investment_income: string;
  rental_income: string;
  income_frequency: 'monthly' | 'bi-weekly' | 'weekly';

  // Expense Information
  rent_mortgage: string;
  utilities: string;
  electricity: string;
  gas: string;
  water: string;
  internet: string;
  food: string;
  groceries: string;
  dining_out: string;
  transportation: string;
  fuel: string;
  vehicle_maintenance: string;
  insurance: string;
  medical_expenses: string;
  other_expenses: string;
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
