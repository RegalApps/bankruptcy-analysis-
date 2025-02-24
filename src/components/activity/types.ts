
export interface IncomeExpenseData {
  monthly_income: string;
  employment_income: string;
  other_income: string;
  rent_mortgage: string;
  utilities: string;
  food: string;
  transportation: string;
  insurance: string;
  medical_expenses: string;
  other_expenses: string;
  notes: string;
}

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
}
