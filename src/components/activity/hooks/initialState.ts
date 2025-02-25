
import { IncomeExpenseData, HistoricalData } from "./types";

export const initialFormData: IncomeExpenseData = {
  monthly_income: "",
  employment_income: "",
  primary_salary: "",
  overtime_bonuses: "",
  other_income: "",
  freelance_income: "",
  investment_income: "",
  rental_income: "",
  income_frequency: "monthly",
  rent_mortgage: "",
  utilities: "",
  electricity: "",
  gas: "",
  water: "",
  internet: "",
  food: "",
  groceries: "",
  dining_out: "",
  transportation: "",
  fuel: "",
  vehicle_maintenance: "",
  insurance: "",
  medical_expenses: "",
  other_expenses: "",
  expense_frequency: "monthly",
  notes: "",
};

export const initialHistoricalData: HistoricalData = {
  currentPeriod: {
    totalIncome: 0,
    totalExpenses: 0,
    surplusIncome: 0,
  },
  previousPeriod: {
    totalIncome: 0,
    totalExpenses: 0,
    surplusIncome: 0,
  },
};
